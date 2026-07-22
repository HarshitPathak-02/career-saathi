import { Types } from "mongoose";

import { RoadmapItemType } from "../../modules/roadmap/roadmap.enums.js";
import {
    RoadmapGenerationOutput,
    RoadmapItemOutput,
} from "../../modules/roadmap/roadmap.types.js";
import { DailyTaskGenerationOutput, DailyTaskOutput } from "../../modules/daily-task/daily-task.types.js";
import { MentorFeedbackOutput, MissionRecommendationOutput, WeeklyReportGenerationOutput, WeeklySummaryOutput } from "../../modules/weekly-report/weekly-report.types.js";
import { MissionDifficulty } from "../../modules/mission/mission.enums.js";

class AIValidator {

    validateRoadmap(
        response: unknown
    ): RoadmapGenerationOutput {

        if (
            !response ||
            typeof response !== "object"
        ) {
            throw new Error(
                "AI response must be an object."
            );
        }

        const roadmap =
            response as RoadmapGenerationOutput;

        if (
            typeof roadmap.version !== "number"
        ) {
            throw new Error(
                "Invalid roadmap version."
            );
        }

        if (
            typeof roadmap.title !== "string" ||
            roadmap.title.trim().length === 0
        ) {
            throw new Error(
                "Roadmap title is required."
            );
        }

        if (
            !Array.isArray(roadmap.roadmapItems) ||
            roadmap.roadmapItems.length === 0
        ) {
            throw new Error(
                "Roadmap must contain at least one roadmap item."
            );
        }

        roadmap.roadmapItems.forEach(
            (item, index) =>
                this.validateRoadmapItem(
                    item,
                    index
                )
        );

        const orders =
            roadmap.roadmapItems.map(
                item => item.order
            );

        const uniqueOrders =
            new Set(orders);

        if (
            orders.length !== uniqueOrders.size
        ) {
            throw new Error(
                "Roadmap contains duplicate item orders."
            );
        }

        const sortedOrders =
            [...orders].sort(
                (a, b) => a - b
            );

        sortedOrders.forEach(
            (order, index) => {

                if (order !== index + 1) {
                    throw new Error(
                        "Roadmap item orders must start at 1 and be sequential."
                    );
                }

            }
        );

        return roadmap;
    }

    private validateRoadmapItem(
        item: RoadmapItemOutput,
        index: number
    ): void {

        if (
            !Number.isInteger(item.order) ||
            item.order < 1
        ) {
            throw new Error(
                `Roadmap item ${index} has an invalid order.`
            );
        }

        if (
            !Object.values(
                RoadmapItemType
            ).includes(item.type)
        ) {
            throw new Error(
                `Roadmap item ${index} has an invalid type.`
            );
        }

        // Validate skillId
        if (
            item.type === RoadmapItemType.TOPIC
        ) {

            if (
                typeof item.skillId !== "string" ||
                !Types.ObjectId.isValid(
                    item.skillId
                )
            ) {
                throw new Error(
                    `Roadmap item ${index} must contain a valid skillId.`
                );
            }

        } else {

            if (
                item.skillId !== undefined &&
                item.skillId !== null
            ) {
                throw new Error(
                    `Roadmap item ${index} must not contain skillId because only TOPIC items can have it.`
                );
            }

        }

        if (
            typeof item.title !== "string" ||
            item.title.trim().length === 0
        ) {
            throw new Error(
                `Roadmap item ${index} must have a valid title.`
            );
        }

        if (
            typeof item.description !== "string" ||
            item.description.trim().length === 0
        ) {
            throw new Error(
                `Roadmap item ${index} must have a valid description.`
            );
        }

        if (
            !Number.isFinite(
                item.estimatedHours
            ) ||
            item.estimatedHours <= 0
        ) {
            throw new Error(
                `Roadmap item ${index} has invalid estimated hours.`
            );
        }

        if (
            typeof item.aiReason !== "string" ||
            item.aiReason.trim().length === 0
        ) {
            throw new Error(
                `Roadmap item ${index} must contain an AI reason.`
            );
        }

        if (
            item.metadata !== undefined &&
            (
                typeof item.metadata !== "object" ||
                item.metadata === null
            )
        ) {
            throw new Error(
                `Roadmap item ${index} has invalid metadata.`
            );
        }

    }

    validateDailyTasks(
        response: unknown
    ): DailyTaskGenerationOutput {

        if (!Array.isArray(response)) {
            throw new Error(
                "AI response must be an array."
            );
        }

        if (response.length !== 6) {
            throw new Error(
                "AI must generate exactly 6 daily tasks."
            );
        }

        const tasks =
            response as DailyTaskGenerationOutput;

        tasks.forEach((task, index) =>
            this.validateDailyTask(
                task,
                index
            )
        );

        const dayNumbers =
            tasks.map(task => task.dayNumber);

        const uniqueDays =
            new Set(dayNumbers);

        if (
            uniqueDays.size !== 6
        ) {
            throw new Error(
                "Duplicate day numbers found."
            );
        }

        const sortedDays =
            [...dayNumbers].sort(
                (a, b) => a - b
            );

        sortedDays.forEach(
            (day, index) => {

                if (
                    day !== index + 1
                ) {
                    throw new Error(
                        "Day numbers must be sequential from 1 to 6."
                    );
                }

            }
        );

        return tasks;
    }

    private validateDailyTask(
        task: DailyTaskOutput,
        index: number
    ): void {

        if (
            !Number.isInteger(task.dayNumber)
        ) {
            throw new Error(
                `Daily task ${index} has an invalid day number.`
            );
        }

        if (
            typeof task.title !== "string" ||
            task.title.trim().length === 0
        ) {
            throw new Error(
                `Daily task ${index} must contain a title.`
            );
        }

        if (
            typeof task.description !== "string" ||
            task.description.trim().length === 0
        ) {
            throw new Error(
                `Daily task ${index} must contain a description.`
            );
        }

        if (
            !Array.isArray(task.topics) ||
            task.topics.length === 0
        ) {
            throw new Error(
                `Daily task ${index} must contain topics.`
            );
        }

        task.topics.forEach(
            (topic, topicIndex) => {

                if (
                    typeof topic !== "string" ||
                    topic.trim().length === 0
                ) {
                    throw new Error(
                        `Daily task ${index} has an invalid topic at index ${topicIndex}.`
                    );
                }

            }
        );

        if (
            !Number.isInteger(
                task.estimatedMinutes
            ) ||
            task.estimatedMinutes <= 0
        ) {
            throw new Error(
                `Daily task ${index} has invalid estimated minutes.`
            );
        }

    }

    validateWeeklyReport(
        response: unknown
    ): WeeklyReportGenerationOutput {

        if (
            !response ||
            typeof response !== "object"
        ) {
            throw new Error(
                "AI response must be an object."
            );
        }

        const report =
            response as WeeklyReportGenerationOutput;

        this.validateWeeklySummary(
            report.summary
        );

        this.validateMentorFeedback(
            report.mentorFeedback
        );

        this.validateMissionRecommendation(
            report.recommendation
        );

        return report;

    }

    private validateWeeklySummary(
        summary: WeeklySummaryOutput
    ): void {

        if (
            !summary ||
            typeof summary !== "object"
        ) {
            throw new Error(
                "Weekly summary is required."
            );
        }

        if (
            typeof summary.summary !== "string" ||
            summary.summary.trim().length === 0
        ) {
            throw new Error(
                "Weekly summary is required."
            );
        }

        if (
            !Array.isArray(
                summary.achievements
            )
        ) {
            throw new Error(
                "Achievements must be an array."
            );
        }

        summary.achievements.forEach(
            (achievement, index) => {

                if (
                    typeof achievement !== "string" ||
                    achievement.trim().length === 0
                ) {
                    throw new Error(
                        `Achievement ${index} is invalid.`
                    );
                }

            }
        );

        if (
            !Array.isArray(
                summary.improvements
            )
        ) {
            throw new Error(
                "Improvements must be an array."
            );
        }

        summary.improvements.forEach(
            (improvement, index) => {

                if (
                    typeof improvement !== "string" ||
                    improvement.trim().length === 0
                ) {
                    throw new Error(
                        `Improvement ${index} is invalid.`
                    );
                }

            }
        );

    }

    private validateMentorFeedback(
        mentorFeedback: MentorFeedbackOutput
    ): void {

        if (
            !mentorFeedback ||
            typeof mentorFeedback !== "object"
        ) {
            throw new Error(
                "Mentor feedback is required."
            );
        }

        if (
            typeof mentorFeedback.advice !== "string" ||
            mentorFeedback.advice.trim().length === 0
        ) {
            throw new Error(
                "Mentor advice is required."
            );
        }

        if (
            typeof mentorFeedback.motivationMessage !== "string" ||
            mentorFeedback.motivationMessage.trim().length === 0
        ) {
            throw new Error(
                "Motivation message is required."
            );
        }

    }

    private validateMissionRecommendation(
        recommendation: MissionRecommendationOutput
    ): void {

        if (
            !recommendation ||
            typeof recommendation !== "object"
        ) {
            throw new Error(
                "Mission recommendation is required."
            );
        }

        if (
            !Array.isArray(
                recommendation.weakSkills
            )
        ) {
            throw new Error(
                "Weak skills must be an array."
            );
        }

        recommendation.weakSkills.forEach(
            (skill, index) => {

                if (
                    typeof skill !== "string" ||
                    skill.trim().length === 0
                ) {
                    throw new Error(
                        `Weak skill ${index} is invalid.`
                    );
                }

            }
        );

        if (
            !Array.isArray(
                recommendation.revisionTopics
            )
        ) {
            throw new Error(
                "Revision topics must be an array."
            );
        }

        recommendation.revisionTopics.forEach(
            (topic, index) => {

                if (
                    typeof topic !== "string" ||
                    topic.trim().length === 0
                ) {
                    throw new Error(
                        `Revision topic ${index} is invalid.`
                    );
                }

            }
        );

        if (
            !Object.values(
                MissionDifficulty
            ).includes(
                recommendation.recommendedDifficulty
            )
        ) {
            throw new Error(
                "Invalid recommended difficulty."
            );
        }

        if (
            !Number.isInteger(
                recommendation.recommendedStudyHours
            ) ||
            recommendation.recommendedStudyHours <= 0
        ) {
            throw new Error(
                "Recommended study hours must be a positive integer."
            );
        }

        if (
            typeof recommendation.prioritizeRevision !== "boolean"
        ) {
            throw new Error(
                "prioritizeRevision must be a boolean."
            );
        }

        if (
            typeof recommendation.skipCompletedTopics !== "boolean"
        ) {
            throw new Error(
                "skipCompletedTopics must be a boolean."
            );
        }

    }

}

export const aiValidator =
    new AIValidator();