import mongoose, { ClientSession, Types } from "mongoose";

import { careerJourneyRepository } from "../career-journey/career-journey.repository.js";
import { roadmapRepository } from "./roadmap.repository.js";
import { roadmapItemRepository } from "./roadmap-item.repository.js";
import { userSkillRepository } from "../user-skill/user-skill.repository.js";

import { CareerRoleModel } from "../../master-data/career-role/career-role.schema.js";
import { CareerDomainModel } from "../../master-data/career-domain/career-domain.schema.js";
import { SkillCatalogModel } from "../../master-data/skill-catalog/skill-catalog.schema.js";

import { roadmapMapper } from "./roadmap.mapper.js";
import { roadmapPromptBuilder } from "./roadmap-prompt.builder.js";

import { aiService } from "../../shared/ai/ai.service.js";
import { aiParser } from "../../shared/ai/ai.parser.js";
import { aiValidator } from "../../shared/ai/ai.validator.js";

import {
    RoadmapDocument,
} from "./roadmap.schema.js";

import {
    RoadmapWorkflowContext,
    RoadmapGenerationInput,
    RoadmapGenerationOutput,
} from "./roadmap.types.js";
import { AppError } from "../../core/errors/app-error.js";


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
                404, "Career journey not found."
            );
        }

        const roadmapExists =
            await roadmapRepository.exists({
                careerJourneyId,
            });

        if (roadmapExists) {
            throw new AppError(409,
                "Roadmap already exists for this career journey."
            );
        }

        const role =
            await CareerRoleModel.findById(
                careerJourney.roleId
            );

        if (!role) {
            throw new AppError(404,
                "Career role not found."
            );
        }

        const domain =
            await CareerDomainModel.findById(
                careerJourney.domainId
            );

        if (!domain) {
            throw new AppError(404,
                "Career domain not found."
            );
        }

        const skillCatalog =
            await SkillCatalogModel.find({
                isActive: true,
            }).lean(false);

        if (skillCatalog.length === 0) {
            throw new AppError(400,
                "Skill catalog is empty."
            );
        }

        const userSkills =
            await userSkillRepository.findMany({
                careerJourneyId,
                isActive: true,
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

    private buildGenerationInput(
        context: RoadmapWorkflowContext
    ): RoadmapGenerationInput {

        const skillCatalogMap = new Map(
            context.skillCatalog.map(skill => [
                skill._id.toString(),
                skill,
            ])
        );

        const requiredSkills =
            context.skillCatalog.map(skill => ({
                skillId: skill._id.toString(),
                skillName: skill.name,
                category: skill.category,
                difficulty: skill.difficulty,
                description: skill.description,
            }));

        const currentSkills =
            context.userSkills.map(userSkill => {

                const catalogSkill =
                    skillCatalogMap.get(
                        userSkill.skillCatalogId.toString()
                    );

                if (!catalogSkill) {
                    throw new Error(
                        `Skill catalog not found for ${userSkill.skillCatalogId}`
                    );
                }

                return {
                    skillId: catalogSkill._id.toString(),
                    skillName: catalogSkill.name,
                    currentScore: userSkill.currentScore,
                    currentLevel: userSkill.currentLevel,
                    selectedByUser: userSkill.selectedByUser,
                    lastAssessmentAt: userSkill.lastAssessmentAt,
                };

            });

        const availableSkills =
            context.skillCatalog.map(skill => ({
                skillId: skill._id.toString(),
                title: skill.name,
                description:skill.description,
                difficulty:skill.difficulty,
                category: skill.category
            }));

        return {

            target: {

                role: context.role.name,

                domain: context.domain.name,

                targetCompany:
                    context.careerJourney.targetCompany,

                durationMonths:
                    context.careerJourney.targetDurationMonths,

                dailyStudyHours:
                    context.careerJourney.dailyStudyHours,

            },

            requiredSkills,

            currentSkills,
            availableSkills

        };

    }

    private async generateRoadmapOutput(
        input: RoadmapGenerationInput
    ): Promise<RoadmapGenerationOutput> {

        const prompt =
            roadmapPromptBuilder.build(input);

        const aiResponse =
            await aiService.generate({
                prompt,
            });
        console.log("===== RAW AI RESPONSE =====");
        console.log(aiResponse.text);
        console.log(aiResponse.text.length);
        

        const parsedResponse =
            aiParser.parse<RoadmapGenerationOutput>(
                aiResponse.text
            );

        console.log("===== PARSED OUTPUT =====");
        console.dir(parsedResponse, { depth: null });

        return aiValidator.validateRoadmap(
            parsedResponse
        ) as RoadmapGenerationOutput;

    }

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
                (sum, item) => sum + item.estimatedHours,
                0
            );

        const estimatedWeeks = Math.ceil(
            totalEstimatedHours /
            (context.careerJourney.dailyStudyHours * 7)
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

export const roadmapWorkflowService = new RoadmapWorkflowService();