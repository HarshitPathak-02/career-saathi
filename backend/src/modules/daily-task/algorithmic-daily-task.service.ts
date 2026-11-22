import { Types } from "mongoose";
import { DailyTaskOutput } from "./daily-task.types.js";
import { DailyTaskType } from "./daily-task.enums.js";
import { RoadmapItemDocument } from "../roadmap/roadmap-item.model.js";
import { MissionRevisionPlan } from "../mission/mission.types.js";

interface AlgorithmicPlanInput {
    roadmapItems: RoadmapItemDocument[];
    revisionPlans: MissionRevisionPlan[];
    dailyStudyHours: number;
}

export class AlgorithmicDailyTaskService {

    /**
     * Deterministically generates a 6-day study plan without any AI API call.
     * Complies 100% with CareerSaathi database reference and schema validation rules:
     * 1. Exactly 6 objects (Days 1 to 6).
     * 2. Every supplied roadmapItemId is present on at least one day.
     * 3. Every supplied revisionSkillId is present on at least one day.
     * 4. Exactly 3 topics per day.
     * 5. Valid estimated minutes based on student's study hours.
     * 6. Zero empty days.
     */
    planSixDaySchedule(input: AlgorithmicPlanInput): DailyTaskOutput[] {
        const { roadmapItems, revisionPlans, dailyStudyHours } = input;
        const estimatedMinutes = Math.max(30, Math.round(dailyStudyHours * 60));

        const tasks: DailyTaskOutput[] = [];
        const totalRoadmapItems = roadmapItems.length;
        const totalRevisionPlans = revisionPlans.length;

        for (let day = 1; day <= 6; day++) {
            const dayRoadmapItemIds: string[] = [];
            const dayRevisionSkillIds: string[] = [];
            let primaryItemTitle = "";
            let primaryItemDesc = "";

            // 1. Distribute roadmap items sequentially across the 6 days
            if (totalRoadmapItems > 0) {
                if (totalRoadmapItems <= 6) {
                    // Map item index by day
                    const itemIndex = Math.min(
                        Math.floor(((day - 1) * totalRoadmapItems) / 6),
                        totalRoadmapItems - 1
                    );
                    const item = roadmapItems[itemIndex];
                    dayRoadmapItemIds.push(item._id.toString());
                    primaryItemTitle = item.title;
                    primaryItemDesc = item.description || `Practical application and study of ${item.title}.`;
                } else {
                    // Multiple items per day
                    const startIndex = Math.floor(((day - 1) * totalRoadmapItems) / 6);
                    const endIndex = Math.min(
                        Math.floor((day * totalRoadmapItems) / 6),
                        totalRoadmapItems
                    );
                    for (let i = startIndex; i < endIndex; i++) {
                        dayRoadmapItemIds.push(roadmapItems[i]._id.toString());
                    }
                    if (dayRoadmapItemIds.length === 0) {
                        dayRoadmapItemIds.push(roadmapItems[roadmapItems.length - 1]._id.toString());
                    }
                    const leadItem = roadmapItems[startIndex] || roadmapItems[0];
                    primaryItemTitle = leadItem.title;
                    primaryItemDesc = leadItem.description || `Deep dive into ${leadItem.title}.`;
                }
            }

            // 2. Distribute revision skills (place on Days 3, 5 or spread out)
            if (totalRevisionPlans > 0) {
                // Assign revision skills evenly
                const revIndex = (day - 1) % totalRevisionPlans;
                const rev = revisionPlans[revIndex];
                if (day === 3 || day === 5 || totalRoadmapItems === 0) {
                    dayRevisionSkillIds.push(rev.skillCatalogId.toString());
                    if (!primaryItemTitle) {
                        primaryItemTitle = `Revision: ${rev.skillName}`;
                        primaryItemDesc = `Reinforce core concepts and resolve weak areas in ${rev.skillName}.`;
                    }
                }
            }

            // 3. Fallback: Ensure no day is empty
            if (dayRoadmapItemIds.length === 0 && dayRevisionSkillIds.length === 0) {
                if (totalRoadmapItems > 0) {
                    dayRoadmapItemIds.push(roadmapItems[0]._id.toString());
                    primaryItemTitle = roadmapItems[0].title;
                    primaryItemDesc = `Consolidation and practice of ${roadmapItems[0].title}.`;
                } else if (totalRevisionPlans > 0) {
                    dayRevisionSkillIds.push(revisionPlans[0].skillCatalogId.toString());
                    primaryItemTitle = `Revision: ${revisionPlans[0].skillName}`;
                    primaryItemDesc = `Continuous reinforcement of ${revisionPlans[0].skillName}.`;
                }
            }

            // 4. Build 3 distinct, concise topics
            const topicPrefix = primaryItemTitle || `Milestone Phase ${day}`;
            const topics: string[] = [
                `${topicPrefix} Core Concepts`,
                `${topicPrefix} Implementation`,
                `${topicPrefix} Practical Drills`,
            ];

            tasks.push({
                dayNumber: day,
                type: DailyTaskType.STUDY,
                title: `Day ${day}: ${primaryItemTitle || "Core Module Study"}`,
                description: primaryItemDesc.length > 120
                    ? primaryItemDesc.slice(0, 117) + "..."
                    : primaryItemDesc,
                topics,
                roadmapItemIds: dayRoadmapItemIds,
                revisionSkillIds: dayRevisionSkillIds,
                estimatedMinutes,
            });
        }

        // 5. Verification: Ensure every allowed roadmap item and revision skill is represented
        for (const item of roadmapItems) {
            const idStr = item._id.toString();
            const exists = tasks.some(t => (t.roadmapItemIds || []).includes(idStr));
            if (!exists) {
                tasks[0].roadmapItemIds!.push(idStr);
            }
        }

        for (const rev of revisionPlans) {
            const idStr = rev.skillCatalogId.toString();
            const exists = tasks.some(t => (t.revisionSkillIds || []).includes(idStr));
            if (!exists) {
                tasks[tasks.length - 1].revisionSkillIds!.push(idStr);
            }
        }

        return tasks;
    }
}

export const algorithmicDailyTaskService = new AlgorithmicDailyTaskService();
