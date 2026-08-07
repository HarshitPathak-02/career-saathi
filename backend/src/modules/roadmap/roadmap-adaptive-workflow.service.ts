import {
    ClientSession,
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";

import {
    ReadinessStatus,
} from "../readiness/readiness.enums.js";
import { readinessService } from "../readiness/readiness.service.js";
import { ReadinessEvaluation } from "../readiness/readiness.types.js";
import { careerJourneyRepository } from "../career-journey/career-journey.repository.js";
import { roadmapRepository } from "./roadmap.repository.js";
import { RoadmapStatus } from "./roadmap.enums.js";
import { CareerRoleModel } from "../../master-data/career-role/career-role.schema.js";
import { CareerDomainModel } from "../../master-data/career-domain/career-domain.schema.js";
import { userSkillRepository } from "../user-skill/user-skill.repository.js";
import { SkillCatalogModel } from "../../master-data/skill-catalog/skill-catalog.schema.js";
import { mockInterviewRepository } from "../mock-interview/mock-interview.repository.js";
import { READINESS_RECENT_INTERVIEW_LIMIT } from "../readiness/readiness.constants.js";
import { AdaptiveMockInterviewContext, AdaptiveRoadmapGenerationInput, AdaptiveRoadmapWorkflowContext, RoadmapGenerationOutput } from "./roadmap.types.js";
import { roadmapAdaptivePromptBuilder } from "./roadmap-adaptive-prompt.builder.js";
import { aiService } from "../../shared/ai/ai.service.js";
import { aiParser } from "../../shared/ai/ai.parser.js";
import { aiValidator } from "../../shared/ai/ai.validator.js";
import { executeTransaction } from "../../shared/utils/transaction.util.js";
import { roadmapMapper } from "./roadmap.mapper.js";
import { roadmapItemRepository } from "./roadmap-item.repository.js";
import { roadmapResponseMapper } from "./roadmap-response.mapper.js";
import { CareerJourneyStatus } from "../career-journey/index.js";
import { ROADMAP_MESSAGES } from "./roadmap.constants.js";


class RoadmapAdaptiveWorkflowService {

    async generateAdaptiveRoadmap(
        userId: string,
        careerJourneyId: string
    ) {

        const readiness =
            await readinessService
                .getReadinessState(
                    userId,
                    careerJourneyId
                );

        if (
            readiness.status !==
            ReadinessStatus.NOT_READY
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Adaptive roadmap can only be generated when the user is not interview ready."
            );
        }


        const context =
            await this.loadAdaptiveContext(
                userId,
                careerJourneyId,
                readiness
            );


        const input =
            this.buildAdaptiveInput(
                context
            );


        const output =
            await this.generateAdaptiveOutput(
                input
            );

        return this.saveAdaptiveRoadmap(
            context,
            output
        );
    }

    private async loadAdaptiveContext(
        userId: string,
        careerJourneyId: string,
        readiness: ReadinessEvaluation
    ): Promise<AdaptiveRoadmapWorkflowContext> {

        const userObjectId =
            new Types.ObjectId(
                userId
            );

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );


        /*
         * Career Journey
         */

        const careerJourney =
            await careerJourneyRepository
                .findByIdAndUserId(
                    careerJourneyObjectId,
                    userObjectId
                );

        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }


        /*
         * Previous / Latest Roadmap
         */

        const previousRoadmap =
            await roadmapRepository
                .findLatestByCareerJourneyId(
                    careerJourneyObjectId
                );

        if (!previousRoadmap) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                ROADMAP_MESSAGES.PREVIOUS_ROADMAP_NOT_FOUND
            );
        }


        /*
         * Adaptive Roadmap Must Follow
         * A Completed Roadmap
         */

        if (
            previousRoadmap.status !==
            RoadmapStatus.COMPLETED
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Adaptive roadmap can only be generated after the current roadmap is completed."
            );
        }


        /*
         * Career Role
         */

        const role =
            await CareerRoleModel
                .findById(
                    careerJourney.roleId
                );

        if (!role) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career role not found."
            );
        }


        /*
         * Career Domain
         */

        const domain =
            await CareerDomainModel
                .findById(
                    careerJourney.domainId
                );

        if (!domain) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career domain not found."
            );
        }


        /*
         * Current User Skills
         */

        const userSkills =
            await userSkillRepository
                .findMany({
                    careerJourneyId:
                        careerJourneyObjectId,

                    isActive:
                        true,
                });

        if (
            userSkills.length === 0
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "No active skills are available for adaptive roadmap generation."
            );
        }


        /*
         * Skill Catalog
         */

        const skillCatalogIds =
            userSkills.map(
                skill =>
                    skill.skillCatalogId
            );

        const skillCatalog =
            await SkillCatalogModel
                .find({
                    _id: {
                        $in:
                            skillCatalogIds,
                    },

                    isActive:
                        true,
                });


        /*
         * Recent Mock Interviews
         */

        const mockInterviews =
            await mockInterviewRepository
                .findRecentCompletedByCareerJourney(
                    careerJourneyObjectId,
                    READINESS_RECENT_INTERVIEW_LIMIT
                );


        return {

            careerJourney,

            role,

            domain,

            previousRoadmap,

            userSkills,

            skillCatalog,

            mockInterviews,

            readiness,
        };
    }

    private buildAdaptiveInput(
        context:
            AdaptiveRoadmapWorkflowContext
    ): AdaptiveRoadmapGenerationInput {

        /*
         * Readiness Breakdown Must Exist
         */

        if (
            !context.readiness.breakdown ||
            context.readiness.readinessScore ===
            null
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Readiness data is insufficient for adaptive roadmap generation."
            );
        }


        /*
         * Skill Catalog Lookup
         */

        const skillCatalogMap =
            new Map(
                context.skillCatalog.map(
                    skill => [
                        skill._id.toString(),
                        skill,
                    ]
                )
            );


        /*
         * Current Skills
         */

        const currentSkills =
            context.userSkills.map(
                userSkill => {

                    const catalogSkill =
                        skillCatalogMap.get(
                            userSkill
                                .skillCatalogId
                                .toString()
                        );

                    if (!catalogSkill) {

                        throw new AppError(
                            HTTP_STATUS.INTERNAL_SERVER_ERROR,
                            `Skill catalog not found for user skill ${userSkill.skillCatalogId.toString()}.`
                        );
                    }

                    return {

                        skillId:
                            catalogSkill
                                ._id
                                .toString(),

                        skillName:
                            catalogSkill.name,

                        currentScore:
                            userSkill.currentScore,

                        currentLevel:
                            userSkill.currentLevel,
                    };
                }
            );


        /*
         * Recent Mock Interviews
         */

        const recentMockInterviews =
            context.mockInterviews.map(
                interview => ({

                    interviewNumber:
                        interview.interviewNumber,

                    interviewType:
                        interview.interviewType,

                    overallScore:
                        interview.overallScore,

                    technicalScore:
                        interview.technicalScore,

                    problemSolvingScore:
                        interview.problemSolvingScore,

                    communicationScore:
                        interview.communicationScore,

                    feedback:
                        interview.feedback,
                })
            );


        /*
         * Build Adaptive Input
         */

        return {

            target: {

                role:
                    context.role.name,

                domain:
                    context.domain.name,

                targetCompany:
                    context.careerJourney
                        .targetCompany,

                durationMonths:
                    context.careerJourney
                        .targetDurationMonths,

                dailyStudyHours:
                    context.careerJourney
                        .dailyStudyHours,
            },


            previousRoadmap: {

                roadmapId:
                    context.previousRoadmap
                        ._id
                        .toString(),

                version:
                    context.previousRoadmap
                        .version,

                title:
                    context.previousRoadmap
                        .title,
            },


            currentSkills,

            recentMockInterviews,


            readiness: {

                readinessScore:
                    context.readiness
                        .readinessScore,

                skillScore:
                    context.readiness
                        .breakdown
                        .skillScore,

                technicalInterviewScore:
                    context.readiness
                        .breakdown
                        .technicalInterviewScore,

                problemSolvingScore:
                    context.readiness
                        .breakdown
                        .problemSolvingScore,

                communicationScore:
                    context.readiness
                        .breakdown
                        .communicationScore,

                weakAreas:
                    context.readiness
                        .weakAreas,
            },
        };
    }

    private async generateAdaptiveOutput(
        input:
            AdaptiveRoadmapGenerationInput
    ): Promise<RoadmapGenerationOutput> {

        const prompt =
            roadmapAdaptivePromptBuilder
                .build(
                    input
                );

        const aiResponse =
            await aiService.generate({
                prompt,
            });

        const parsedResponse =
            aiParser.parse<
                RoadmapGenerationOutput
            >(
                aiResponse.text
            );

        return aiValidator
            .validateRoadmap(
                parsedResponse
            ) as RoadmapGenerationOutput;
    }

    private async saveAdaptiveRoadmap(
        context:
            AdaptiveRoadmapWorkflowContext,

        output:
            RoadmapGenerationOutput
    ) {

        return executeTransaction(
            async (
                session
            ) => {

                return this.persistAdaptiveRoadmap(
                    context,
                    output,
                    session
                );
            }
        );
    }

    private async persistAdaptiveRoadmap(
        context:
            AdaptiveRoadmapWorkflowContext,

        output:
            RoadmapGenerationOutput,

        session:
            ClientSession
    ) {

        /*
         * Calculate Estimated Duration
         */

        const totalEstimatedHours =
            output.roadmapItems.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    item.estimatedHours,
                0
            );

        const availableHoursPerWeek =
            context.careerJourney
                .dailyStudyHours * 7;

        const estimatedWeeks =
            Math.max(
                1,
                Math.ceil(
                    totalEstimatedHours /
                    availableHoursPerWeek
                )
            );


        /*
         * Build Adaptive Roadmap
         */

        const roadmapData =
            roadmapResponseMapper
                .buildAdaptiveRoadmap(
                    context,
                    output,
                    estimatedWeeks
                );


        /*
         * Create Roadmap
         */

        const roadmap =
            await roadmapRepository
                .create(
                    roadmapData,
                    session
                );


        /*
         * Build Roadmap Items
         */

        const roadmapItems =
            roadmapMapper
                .buildRoadmapItems(
                    roadmap._id,
                    output.roadmapItems
                );

        await roadmapItemRepository
            .createMany(
                roadmapItems,
                session
            );


        const updatedCareerJourney =
            await careerJourneyRepository
                .updateStatusById(
                    context.careerJourney._id,
                    CareerJourneyStatus.ACTIVE,
                    session
                );

        if (!updatedCareerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }

        return roadmap;
    }
}


export const roadmapAdaptiveWorkflowService =
    new RoadmapAdaptiveWorkflowService();