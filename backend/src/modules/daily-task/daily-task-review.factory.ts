import { DailyTaskOutput } from "./daily-task.types.js";
import { DailyTaskType } from "./daily-task.enums.js";

export function createReviewDay(): DailyTaskOutput {

    return {

        dayNumber: 7,

        type: DailyTaskType.REVIEW,

        title: "Weekly Review Day",

        description:
            "Revise this week's learning, complete the weekly assessment, and submit your student reflection.",

        topics: [
            "Weekly Revision",
            "Weekly Assessment",
            "Student Reflection"
        ],

        estimatedMinutes: 180

    };

}