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
} from "./roadmap.model.js";

import {
    RoadmapGenerationInput,
    RoadmapGenerationOutput,
    RoadmapWorkflowContext,
} from "./roadmap.types.js";

import {
    AppError,
} from "../../core/errors/app-error.js";
import { executeTransaction } from "../../shared/utils/transaction.util.js";
import { RoadmapType } from "./roadmap.enums.js";

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
    |-------------------------------------------------------------------------- 
    | Load Workflow Context
    |--------------------------------------------------------------------------
    */

    private async loadWorkflowContext(
        careerJourneyId: Types.ObjectId
    ): Promise<RoadmapWorkflowContext> {

        /*
         * Career Journey
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
         * Prevent Duplicate Roadmap
         */

        const initialRoadmapExists =
            await roadmapRepository.exists({
                careerJourneyId,

                type:
                    RoadmapType.INITIAL,
            });

        if (initialRoadmapExists) {

            throw new AppError(
                409,
                "Initial roadmap already exists for this career journey."
            );
        }

        /*
         * Target Role
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
         * Target Domain
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
         * Role Skills
         */

        const careerRoleSkills =
            await CareerRoleSkillModel.find({
                roleId: role._id,
            })
                .sort({
                    displayOrder: 1,
                })
                .lean();

        if (
            careerRoleSkills.length === 0
        ) {
            throw new AppError(
                400,
                "No skills are configured for this career role."
            );
        }

        const roleSkillIds =
            careerRoleSkills.map(
                roleSkill =>
                    roleSkill.skillId
            );

        /*
         * Skill Catalog
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
         * MongoDB $in does not preserve
         * CareerRoleSkill display order.
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
         * User Skills
         */

        const userSkills =
            await userSkillRepository.findMany({
                careerJourneyId,

                isActive: true,

                skillCatalogId: {
                    $in: roleSkillIds,
                },
            });

        if (
            userSkills.length === 0
        ) {
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
    |-------------------------------------------------------------------------- 
    | Build AI Generation Input
    |--------------------------------------------------------------------------
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
         * Required Skills
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
         * Current User Skills
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
         * Available Skills
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

                    category:
                        skill.category,

                    difficulty:
                        skill.difficulty,
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

            currentSkills,

            requiredSkills,

            availableSkills,
        };
    }

    /*
    |-------------------------------------------------------------------------- 
    | Generate Roadmap Using AI
    |--------------------------------------------------------------------------
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

        const parsedResponse =
            aiParser.parse<RoadmapGenerationOutput>(
                aiResponse.text
            );

        return aiValidator.validateRoadmap(
            parsedResponse
        ) as RoadmapGenerationOutput;
    }

    /*
    |-------------------------------------------------------------------------- 
    | Save Roadmap
    |--------------------------------------------------------------------------
    */

    private async saveRoadmap(
        context: RoadmapWorkflowContext,
        output: RoadmapGenerationOutput
    ): Promise<RoadmapDocument> {

        return executeTransaction(
            async (session) => {

                return this.persistRoadmap(
                    context,
                    output,
                    session
                );

            }
        );
    }

    /*
    |-------------------------------------------------------------------------- 
    | Persist Roadmap
    |--------------------------------------------------------------------------
    */

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
            Math.max(
                1,
                Math.ceil(
                    totalEstimatedHours /
                    availableHoursPerWeek
                )
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