import mongoose, {
    ClientSession,
    Types,
} from "mongoose";

import {
    careerJourneyRepository,
} from "../career-journey/career-journey.repository.js";

import {
    roadmapRepository,
} from "./roadmap.repository.js";

import {
    roadmapItemRepository,
} from "./roadmap-item.repository.js";

import {
    userSkillRepository,
} from "../user-skill/user-skill.repository.js";

import {
    CareerRoleModel,
} from "../../master-data/career-role/career-role.schema.js";

import {
    CareerDomainModel,
} from "../../master-data/career-domain/career-domain.schema.js";

import {
    SkillCatalogModel,
} from "../../master-data/skill-catalog/skill-catalog.schema.js";

import {
    CareerRoleSkillModel,
} from "../../master-data/career-role-skill/career-role-skill.schema.js";

import {
    roadmapMapper,
} from "./roadmap.mapper.js";

import {
    roadmapPromptBuilder,
} from "./roadmap-prompt.builder.js";

import {
    aiService,
} from "../../shared/ai/ai.service.js";

import {
    aiParser,
} from "../../shared/ai/ai.parser.js";

import {
    aiValidator,
} from "../../shared/ai/ai.validator.js";

import {
    RoadmapDocument,
} from "./roadmap.schema.js";

import {
    RoadmapGenerationInput,
    RoadmapGenerationOutput,
    RoadmapWorkflowContext,
} from "./roadmap.types.js";

import {
    AppError,
} from "../../core/errors/app-error.js";


export class RoadmapWorkflowService {

    async generateRoadmap(
        careerJourneyId: Types.ObjectId
    ): Promise<RoadmapDocument> {

        const context =
            await this.loadWorkflowContext(
                careerJourneyId
            );

        const input =
            this.buildGenerationInput(
                context
            );

        const output =
            await this.generateRoadmapOutput(
                input
            );

        return this.saveRoadmap(
            context,
            output
        );
    }


    /*
     * ----------------------------------------------------------------------
     * Load everything required to generate
     * the personalized roadmap.
     * ----------------------------------------------------------------------
     */

    private async loadWorkflowContext(
        careerJourneyId: Types.ObjectId
    ): Promise<RoadmapWorkflowContext> {

        /*
         * 1. Career Journey
         */
        const careerJourney =
            await careerJourneyRepository.findOne({
                _id: careerJourneyId,
            });

        if (!careerJourney) {
            throw new AppError(
                404,
                "Career journey not found."
            );
        }


        /*
         * 2. Prevent duplicate roadmap
         */
        const roadmapExists =
            await roadmapRepository.exists({
                careerJourneyId,
            });

        if (roadmapExists) {
            throw new AppError(
                409,
                "Roadmap already exists for this career journey."
            );
        }


        /*
         * 3. Target role
         */
        const role =
            await CareerRoleModel.findById(
                careerJourney.roleId
            );

        if (!role) {
            throw new AppError(
                404,
                "Career role not found."
            );
        }


        /*
         * 4. Target domain
         */
        const domain =
            await CareerDomainModel.findById(
                careerJourney.domainId
            );

        if (!domain) {
            throw new AppError(
                404,
                "Career domain not found."
            );
        }


        /*
         * 5. Get ONLY skills required
         * for this career role.
         */
        const careerRoleSkills =
            await CareerRoleSkillModel.find({
                roleId: role._id,
            })
                .sort({
                    displayOrder: 1,
                })
                .lean();

        if (careerRoleSkills.length === 0) {
            throw new AppError(
                400,
                "No skills are configured for this career role."
            );
        }


        /*
         * Preserve role-defined ordering.
         */
        const roleSkillIds =
            careerRoleSkills.map(
                roleSkill =>
                    roleSkill.skillId
            );


        /*
         * 6. Fetch active catalog entries
         * belonging to the selected role.
         */
        const skillCatalogDocuments =
            await SkillCatalogModel.find({
                _id: {
                    $in: roleSkillIds,
                },

                isActive: true,
            });


        if (
            skillCatalogDocuments.length === 0
        ) {
            throw new AppError(
                400,
                "No active skills are available for this career role."
            );
        }


        /*
         * MongoDB $in does not preserve the
         * CareerRoleSkill displayOrder.
         *
         * Restore it manually.
         */
        const skillCatalogMap =
            new Map(
                skillCatalogDocuments.map(
                    skill => [
                        skill._id.toString(),
                        skill,
                    ]
                )
            );


        const skillCatalog =
            roleSkillIds
                .map(
                    skillId =>
                        skillCatalogMap.get(
                            skillId.toString()
                        )
                )
                .filter(
                    (
                        skill
                    ): skill is typeof skillCatalogDocuments[number] =>
                        Boolean(skill)
                );


        /*
         * 7. User skill state
         *
         * UserSkill already contains all
         * role skills initialized for this
         * career journey.
         */
        const userSkills =
            await userSkillRepository.findMany({
                careerJourneyId,

                isActive: true,

                skillCatalogId: {
                    $in: roleSkillIds,
                },
            });


        if (userSkills.length === 0) {
            throw new AppError(
                400,
                "User skills are not initialized."
            );
        }


        return {
            careerJourney,

            role,

            domain,

            skillCatalog,

            userSkills,
        };
    }


    /*
     * ----------------------------------------------------------------------
     * Convert DB context into clean AI input.
     * ----------------------------------------------------------------------
     */

    private buildGenerationInput(
        context: RoadmapWorkflowContext
    ): RoadmapGenerationInput {

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
         * Skills required for the user's
         * selected career role.
         */
        const requiredSkills =
            context.skillCatalog.map(
                skill => ({
                    skillId:
                        skill._id.toString(),

                    skillName:
                        skill.name,

                    category:
                        skill.category,

                    difficulty:
                        skill.difficulty,

                    description:
                        skill.description,
                })
            );


        /*
         * Current user state against the
         * required role skills.
         */
        const currentSkills =
            context.userSkills.map(
                userSkill => {

                    const catalogSkill =
                        skillCatalogMap.get(
                            userSkill.skillCatalogId.toString()
                        );


                    if (!catalogSkill) {
                        throw new AppError(
                            500,
                            `Skill catalog not found for user skill ${userSkill.skillCatalogId.toString()}.`
                        );
                    }


                    return {
                        skillId:
                            catalogSkill._id.toString(),

                        skillName:
                            catalogSkill.name,

                        currentScore:
                            userSkill.currentScore,

                        currentLevel:
                            userSkill.currentLevel,

                        selectedByUser:
                            userSkill.selectedByUser,

                        lastAssessmentAt:
                            userSkill.lastAssessmentAt ??
                            null,
                    };
                }
            );


        /*
         * For now, availableSkills contains
         * the role-specific skill universe.
         *
         * AI must choose roadmap skills from
         * these IDs.
         */
        const availableSkills =
            context.skillCatalog.map(
                skill => ({
                    skillId:
                        skill._id.toString(),

                    title:
                        skill.name,

                    description:
                        skill.description,

                    difficulty:
                        skill.difficulty,

                    category:
                        skill.category,
                })
            );


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

            requiredSkills,

            currentSkills,

            availableSkills,
        };
    }


    /*
     * ----------------------------------------------------------------------
     * AI generation
     * ----------------------------------------------------------------------
     */

    private async generateRoadmapOutput(
        input: RoadmapGenerationInput
    ): Promise<RoadmapGenerationOutput> {

        const prompt =
            roadmapPromptBuilder.build(
                input
            );


        const aiResponse =
            await aiService.generate({
                prompt,
            });


        console.log(
            "===== RAW AI RESPONSE ====="
        );

        console.log(
            aiResponse.text
        );


        const parsedResponse =
            aiParser.parse<RoadmapGenerationOutput>(
                aiResponse.text
            );


        console.log(
            "===== PARSED ROADMAP OUTPUT ====="
        );

        console.dir(
            parsedResponse,
            {
                depth: null,
            }
        );


        return aiValidator.validateRoadmap(
            parsedResponse
        ) as RoadmapGenerationOutput;
    }


    /*
     * ----------------------------------------------------------------------
     * Persist generated roadmap
     * ----------------------------------------------------------------------
     */

    private async saveRoadmap(
        context: RoadmapWorkflowContext,
        output: RoadmapGenerationOutput
    ): Promise<RoadmapDocument> {

        const session =
            await mongoose.startSession();


        try {

            session.startTransaction();


            const roadmap =
                await this.persistRoadmap(
                    context,
                    output,
                    session
                );


            await session.commitTransaction();


            return roadmap;

        } catch (error) {

            await session.abortTransaction();

            throw error;

        } finally {

            await session.endSession();

        }
    }


    private async persistRoadmap(
        context: RoadmapWorkflowContext,
        output: RoadmapGenerationOutput,
        session: ClientSession
    ): Promise<RoadmapDocument> {

        const totalEstimatedHours =
            output.roadmapItems.reduce(
                (
                    sum,
                    item
                ) =>
                    sum +
                    item.estimatedHours,

                0
            );


        const availableHoursPerWeek =
            context.careerJourney
                .dailyStudyHours * 7;


        const estimatedWeeks =
            Math.ceil(
                totalEstimatedHours /
                availableHoursPerWeek
            );


        const roadmapData =
            roadmapMapper.buildRoadmap(
                context,
                output,
                estimatedWeeks
            );


        const roadmap =
            await roadmapRepository.create(
                roadmapData,
                session
            );


        const roadmapItems =
            roadmapMapper.buildRoadmapItems(
                roadmap._id,
                output.roadmapItems
            );


        await roadmapItemRepository.createMany(
            roadmapItems,
            session
        );


        return roadmap;
    }
}


export const roadmapWorkflowService =
    new RoadmapWorkflowService();