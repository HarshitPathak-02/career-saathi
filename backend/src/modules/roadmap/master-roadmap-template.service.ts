import { Types } from "mongoose";
import logger from "../../config/logger.js";
import {
    RoadmapGenerationOutput,
    RoadmapItemOutput,
    RoadmapWorkflowContext,
} from "./roadmap.types.js";
import { RoadmapItemType } from "./roadmap.enums.js";
import { MasterRoadmapTemplateModel } from "./master-roadmap-template.model.js";

export class MasterRoadmapTemplateService {

    /**
     * Builds a verified, deterministic roadmap output without calling external AI APIs.
     * 1. Checks if a pre-curated template exists in `master_roadmap_templates`.
     * 2. If found, adapts it with the career journey skills.
     * 3. If no pre-curated template is seeded yet, dynamically builds a curriculum
     *    directly from the configured role skills in master data.
     */
    async buildDeterministicRoadmap(
        context: RoadmapWorkflowContext
    ): Promise<RoadmapGenerationOutput> {
        const roleSlug = context.role.slug || context.role.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

        // 1. Attempt to find pre-curated master template in DB
        try {
            const template = await MasterRoadmapTemplateModel.findOne({
                $or: [
                    { roleId: context.role._id },
                    { roleSlug },
                ],
                isActive: true,
            }).lean();

            if (template && template.roadmapItems && template.roadmapItems.length > 0) {
                logger.info(
                    { roleSlug, templateTitle: template.title },
                    "Using seeded Master Roadmap Template from database"
                );

                const skillMapBySlug = new Map<string, string>();
                context.skillCatalog.forEach(skill => {
                    skillMapBySlug.set(skill.slug.toLowerCase(), skill._id.toString());
                    skillMapBySlug.set(skill.name.toLowerCase(), skill._id.toString());
                });

                const roadmapItems: RoadmapItemOutput[] = template.roadmapItems.map((item, index) => {
                    const skillId = item.skillSlug
                        ? skillMapBySlug.get(item.skillSlug.toLowerCase()) || context.skillCatalog[0]?._id.toString()
                        : undefined;

                    return {
                        order: index + 1,
                        type: item.type as RoadmapItemType,
                        skillId: item.type === RoadmapItemType.TOPIC ? skillId : undefined,
                        title: item.title,
                        description: item.description,
                        estimatedHours: item.estimatedHours,
                        aiReason: item.aiReason || "Curated milestone by CareerSaathi Academic Team.",
                    };
                });

                return {
                    title: `${context.role.name} Professional Track`,
                    roadmapItems,
                };
            }
        } catch (dbError) {
            logger.warn(
                { error: dbError, roleSlug },
                "Database lookup for master roadmap template failed; falling back to dynamic curriculum builder"
            );
        }

        // 2. Fallback: Synthesize deterministic curriculum directly from master-data skills
        logger.info(
            { role: context.role.name, skillsCount: context.skillCatalog.length },
            "Synthesizing deterministic curriculum from configured role skills"
        );

        const roadmapItems: RoadmapItemOutput[] = [];
        let order = 1;
        const skills = context.skillCatalog;

        skills.forEach((skill, index) => {
            // Core Topic
            roadmapItems.push({
                order: order++,
                type: RoadmapItemType.TOPIC,
                skillId: skill._id.toString(),
                skillName: skill.name,
                title: `${skill.name} Core Fundamentals`,
                description: `Master the essential architecture, syntax, and foundational patterns of ${skill.name}.`,
                estimatedHours: 15,
                aiReason: `Fundamental prerequisite skill for ${context.role.name}.`,
            });

            // Hands-on Milestone Project every 3 skills
            if ((index + 1) % 3 === 0 && index < skills.length - 1) {
                roadmapItems.push({
                    order: order++,
                    type: RoadmapItemType.PROJECT,
                    title: `Applied Portfolio Project: ${skill.name} Integration`,
                    description: `Build an end-to-end practical project consolidating recent milestone skills.`,
                    estimatedHours: 20,
                    aiReason: "Hands-on project reinforcement to demonstrate portfolio readiness.",
                });
            }

            // Milestone Assessment checkpoint every 4 skills
            if ((index + 1) % 4 === 0 && index < skills.length - 1) {
                roadmapItems.push({
                    order: order++,
                    type: RoadmapItemType.PROJECT,
                    title: `${skill.name} Milestone Practical Challenge`,
                    description: `Practical code challenge evaluating conceptual understanding and implementation.`,
                    estimatedHours: 10,
                    aiReason: "Milestone evaluation to verify competency before proceeding to advanced tracks.",
                });
            }
        });

        // Capstone Project at the end
        roadmapItems.push({
            order: order++,
            type: RoadmapItemType.PROJECT,
            title: `${context.role.name} Production Capstone Project`,
            description: `Full-lifecycle capstone project demonstrating end-to-end mastery of ${context.role.name} competencies.`,
            estimatedHours: 30,
            aiReason: "Comprehensive capstone project ready for industry hiring evaluation.",
        });

        return {
            title: `${context.role.name} Mastery Curriculum`,
            roadmapItems,
        };
    }
}

export const masterRoadmapTemplateService = new MasterRoadmapTemplateService();
