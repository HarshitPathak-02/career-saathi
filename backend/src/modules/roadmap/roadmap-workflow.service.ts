import {
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
import { RoadmapItemStatus, RoadmapItemType, RoadmapType } from "./roadmap.enums.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { missionRepository } from "../mission/mission.repository.js";
import { SkillDifficulty } from "../../master-data/skill-catalog/skill-catalog.enums.js";
import { SkillLevel } from "../user-skill/user-skill.enums.js";

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

    private async loadWorkflowContext(
        careerJourneyId: Types.ObjectId
    ): Promise<RoadmapWorkflowContext> {

        const careerJourney =
            await careerJourneyRepository.findOne({
                _id: careerJourneyId,
            });

        if (!careerJourney) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }


        const initialRoadmapExists =
            await roadmapRepository.exists({
                careerJourneyId,

                type:
                    RoadmapType.INITIAL,
            });

        if (initialRoadmapExists) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Initial roadmap already exists for this career journey."
            );
        }

        const role =
            await CareerRoleModel.findById(
                careerJourney.roleId
            );

        if (!role) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career role not found."
            );
        }

        const domain =
            await CareerDomainModel.findById(
                careerJourney.domainId
            );

        if (!domain) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career domain not found."
            );
        }

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
                HTTP_STATUS.BAD_REQUEST,
                "No skills are configured for this career role."
            );
        }

        const roleSkillIds =
            careerRoleSkills.map(
                roleSkill =>
                    roleSkill.skillId
            );

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
                HTTP_STATUS.BAD_REQUEST,
                "No active skills are available for this career role."
            );
        }

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
                HTTP_STATUS.BAD_REQUEST,
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

        const currentSkills =
            context.userSkills.map(
                userSkill => {

                    const catalogSkill =
                        skillCatalogMap.get(
                            userSkill.skillCatalogId.toString()
                        );

                    if (!catalogSkill) {
                        throw new AppError(
                            HTTP_STATUS.INTERNAL_SERVER_ERROR,
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

    async syncPendingRoadmapSkills(
        careerJourneyId: Types.ObjectId | string,
        skillCatalogIds: (Types.ObjectId | string)[],
        sourceReason?: string,
        session?: ClientSession
    ): Promise<void> {
        if (!skillCatalogIds || skillCatalogIds.length === 0) {
            return;
        }

        const journeyObjectId =
            typeof careerJourneyId === "string"
                ? new Types.ObjectId(careerJourneyId)
                : careerJourneyId;

        const objectIdSkills = skillCatalogIds
            .filter((id) => Boolean(id))
            .map((id) => (typeof id === "string" ? new Types.ObjectId(id) : id));

        if (session) {
            await this.executeSyncPendingRoadmapSkills(
                journeyObjectId,
                objectIdSkills,
                sourceReason,
                session
            );
        } else {
            await executeTransaction(async (s) => {
                await this.executeSyncPendingRoadmapSkills(
                    journeyObjectId,
                    objectIdSkills,
                    sourceReason,
                    s
                );
            });
        }
    }

    private async executeSyncPendingRoadmapSkills(
        careerJourneyId: Types.ObjectId,
        skillCatalogIds: Types.ObjectId[],
        sourceReason?: string,
        session?: ClientSession
    ): Promise<void> {
        // 1. If any mission exists for this journey, the active mission cycle has begun.
        // Pre-mission roadmap item appending is not permitted; changes follow adaptive workflows.
        const hasMissions = await missionRepository.exists(
            { careerJourneyId },
            session
        );
        if (hasMissions) {
            return;
        }

        // 2. Journey must already have an initial roadmap. If not, roadmap generation will include UserSkills.
        const roadmap = await roadmapRepository.findLatestByCareerJourneyId(
            careerJourneyId,
            session
        );
        if (!roadmap) {
            return;
        }

        // 3. Check existing skills already assigned to this roadmap
        const existingItems = await roadmapItemRepository.findByRoadmapId(
            roadmap._id,
            session
        );
        const existingSkillIdSet = new Set(
            existingItems
                .filter((item) => item.skillId)
                .map((item) => item.skillId!.toString())
        );

        // 4. Identify delta skill IDs that are not yet in the roadmap
        const missingSkillIds = [
            ...new Set(skillCatalogIds.map((id) => id.toString())),
        ]
            .filter((idStr) => !existingSkillIdSet.has(idStr))
            .map((idStr) => new Types.ObjectId(idStr));

        if (missingSkillIds.length === 0) {
            return;
        }

        // 5. Retrieve skill catalog details for the delta skills
        const catalogSkills = await SkillCatalogModel.find({
            _id: { $in: missingSkillIds },
            isActive: true,
        }).session(session ?? null);

        if (catalogSkills.length === 0) {
            return;
        }

        // 6. Ensure newly discovered/selected skills are upserted into UserSkill for this journey
        await userSkillRepository.bulkWrite(
            catalogSkills.map((skill) => ({
                updateOne: {
                    filter: {
                        careerJourneyId,
                        skillCatalogId: skill._id,
                    },
                    update: {
                        $set: {
                            selectedByUser: true,
                            isActive: true,
                        },
                        $setOnInsert: {
                            currentScore: 0,
                            currentLevel: SkillLevel.NOT_STARTED,
                        },
                    },
                    upsert: true,
                },
            })),
            session
        );

        // 7. Calculate next order and build pending RoadmapItem records
        let currentMaxOrder = existingItems.reduce(
            (max, item) => Math.max(max, item.order ?? 0),
            0
        );

        const newRoadmapItems = catalogSkills.map((skill) => {
            currentMaxOrder += 1;
            const estimatedHours =
                skill.difficulty === SkillDifficulty.ADVANCED
                    ? 16
                    : skill.difficulty === SkillDifficulty.INTERMEDIATE
                    ? 12
                    : 8;

            return {
                roadmapId: roadmap._id,
                order: currentMaxOrder,
                type: RoadmapItemType.TOPIC,
                skillId: skill._id,
                title: skill.name,
                description:
                    skill.description && skill.description.trim().length > 0
                        ? skill.description
                        : `Master core concepts and practical implementation of ${skill.name}.`,
                estimatedHours,
                status: RoadmapItemStatus.PENDING,
                aiReason:
                    sourceReason ||
                    "Added to pending roadmap prior to journey start",
                metadata: {
                    addedPreJourney: true,
                    category: skill.category,
                    difficulty: skill.difficulty,
                },
            };
        });

        await roadmapItemRepository.createMany(newRoadmapItems, session);

        // 8. Recalculate roadmap totals (totalItems, estimatedWeeks)
        const totalItems = existingItems.length + newRoadmapItems.length;
        const totalEstimatedHours =
            existingItems.reduce(
                (sum, item) => sum + (item.estimatedHours || 0),
                0
            ) +
            newRoadmapItems.reduce(
                (sum, item) => sum + item.estimatedHours,
                0
            );

        const journey = await careerJourneyRepository.findOne(
            { _id: careerJourneyId },
            session
        );
        const dailyStudyHours = journey?.dailyStudyHours || 2;
        const availableHoursPerWeek = Math.max(1, dailyStudyHours * 7);
        const estimatedWeeks = Math.max(
            1,
            Math.ceil(totalEstimatedHours / availableHoursPerWeek)
        );

        await roadmapRepository.updateById(
            roadmap._id,
            {
                totalItems,
                estimatedWeeks,
            },
            session
        );
    }
}

export const roadmapWorkflowService =
    new RoadmapWorkflowService();