import {
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    careerJourneyService,
} from "../career-journey/career-journey.service.js";

import {
    missionService,
} from "../mission/mission.service.js";

import {
    roadmapService,
} from "../roadmap/roadmap.service.js";

import {
    userSkillService,
} from "../user-skill/user-skill.service.js";

import {
    assessmentWorkflowService,
} from "../assessment/assessment-workflow.service.js";

import {
    AssessmentStatus,
} from "../assessment/assessment.enums.js";

import {
    weeklyReflectionService,
} from "../weekly-reflection/weekly-reflection.service.js";

import {
    weeklyReportWorkflow,
} from "../weekly-report/weekly-report.workflow.js";

import {
    weeklyReportService,
} from "../weekly-report/weekly-report.service.js";

import {
    dailyTaskService,
} from "../daily-task/daily-task.service.js";

import {
    DailyTaskStatus,
} from "../daily-task/daily-task.enums.js";

import type {
    SubmitWeeklyReviewDTO,
    WeeklyReviewPreparationDTO,
    WeeklyReviewSkillDTO,
} from "./weekly-review.types.js";

class WeeklyReviewWorkflow {

    /*
    |--------------------------------------------------------------------------
    | Get Current Weekly Review
    |--------------------------------------------------------------------------
    */

    async getCurrentWeeklyReview(
        userId: string
    ): Promise<WeeklyReviewPreparationDTO> {

        /*
        |--------------------------------------------------------------------------
        | Active Career Journey
        |--------------------------------------------------------------------------
        */

        const careerJourney =
            await careerJourneyService
                .getActiveCareerJourney(
                    userId
                );

        if (!careerJourney) {

            throw new AppError(
                404,
                "Active career journey not found."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Active Mission
        |--------------------------------------------------------------------------
        */

        const mission =
            await missionService.getActiveMission(
                careerJourney.id
            );

        if (!mission) {

            throw new AppError(
                404,
                "Active mission not found."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Weekly Review Availability
        |--------------------------------------------------------------------------
        */

        const currentMissionDay =
            await missionService.getCurrentMissionDay(
                mission._id
            );

        if (currentMissionDay < 7) {

            throw new AppError(
                409,
                "Weekly review is not available yet."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Roadmap Items Covered This Week
        |--------------------------------------------------------------------------
        */

        const roadmapItems =
            await roadmapService.getRoadmapItemsByIds(
                mission.plannedRoadmapItemIds
            );

        /*
        |--------------------------------------------------------------------------
        | Extract Unique Skill Catalog IDs
        |--------------------------------------------------------------------------
        */

        const skillCatalogIds =
            [
                ...new Map(
                    roadmapItems
                        .filter(
                            item =>
                                item.skillId
                        )
                        .map(
                            item => [
                                item.skillId!
                                    .toString(),

                                item.skillId!,
                            ]
                        )
                ).values(),
            ];

        if (skillCatalogIds.length === 0) {

            throw new AppError(
                409,
                "No assessable skills found for this mission."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | User Skills
        |--------------------------------------------------------------------------
        */

        const userSkills =
            await userSkillService
                .getUserSkillsByCatalogIds(
                    careerJourney._id,
                    skillCatalogIds
                );

        if (userSkills.length === 0) {

            throw new AppError(
                409,
                "No user skills found for this weekly assessment."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Weekly Assessment
        |--------------------------------------------------------------------------
        */

        const assessment =
            await assessmentWorkflowService
                .getOrCreateWeeklyAssessment(
                    careerJourney._id,
                    mission.missionNumber
                );

        /*
        |--------------------------------------------------------------------------
        | Build Skill Groups
        |--------------------------------------------------------------------------
        */

        const skills: WeeklyReviewSkillDTO[] =
            userSkills.map(
                userSkill => {

                    const populatedSkill =
                        userSkill.skillCatalogId as unknown as {
                            _id: Types.ObjectId;
                            name: string;
                        };

                    const matchingRoadmapItems =
                        roadmapItems.filter(
                            item =>
                                item.skillId &&
                                item.skillId.toString() ===
                                populatedSkill._id.toString()
                        );

                    return {

                        userSkillId:
                            userSkill._id.toString(),

                        skillCatalogId:
                            populatedSkill._id.toString(),

                        skillName:
                            populatedSkill.name,

                        currentScore:
                            userSkill.currentScore,

                        roadmapItems:
                            matchingRoadmapItems.map(
                                item => ({

                                    id:
                                        item._id.toString(),

                                    title:
                                        item.title,

                                    description:
                                        item.description,

                                })
                            ),

                    };

                }
            );

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return {

            missionId:
                mission._id.toString(),

            missionNumber:
                mission.missionNumber,

            weekNumber:
                assessment.weekNumber,

            assessmentId:
                assessment._id.toString(),

            skills,

        };

    }

    /*
|--------------------------------------------------------------------------
| Submit Weekly Review
|--------------------------------------------------------------------------
*/

    async submitWeeklyReview(
        userId: string,
        dto: SubmitWeeklyReviewDTO
    ) {

        /*
        |--------------------------------------------------------------------------
        | Active Career Journey
        |--------------------------------------------------------------------------
        */

        console.log("Submit weekly review workflow:", userId);
        console.log("Submit weekly review workflow:", dto);

        const careerJourney =
            await careerJourneyService
                .getActiveCareerJourney(
                    userId
                );

        if (!careerJourney) {

            throw new AppError(
                404,
                "Active career journey not found."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Active Mission
        |--------------------------------------------------------------------------
        */

        const mission =
            await missionService.getActiveMission(
                careerJourney._id.toString()
            );

        if (!mission) {

            throw new AppError(
                404,
                "Active mission not found."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Weekly Review Availability
        |--------------------------------------------------------------------------
        */

        const currentMissionDay =
            await missionService.getCurrentMissionDay(
                mission._id
            );

        if (currentMissionDay < 7) {

            throw new AppError(
                409,
                "Weekly review is not available yet."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Weekly Assessment
        |--------------------------------------------------------------------------
        */

        console.log("STEP 1: completing assessment");

        let assessment =
            await assessmentWorkflowService
                .getOrCreateWeeklyAssessment(
                    careerJourney._id,
                    mission.missionNumber
                );

        /*
        |--------------------------------------------------------------------------
        | Validate Assessment Ownership
        |--------------------------------------------------------------------------
        */

        if (
            assessment._id.toString() !==
            dto.assessment.assessmentId
        ) {

            throw new AppError(
                409,
                "Assessment does not belong to the current weekly review."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Validate Submitted Skills
        |--------------------------------------------------------------------------
        */

        await this.validateSubmittedSkills(
            careerJourney._id,
            mission,
            dto.assessment.skills
        );

        /*
        |--------------------------------------------------------------------------
        | Day 7 Task
        |--------------------------------------------------------------------------
        */

        const daySevenTask =
            await dailyTaskService
                .getTaskByMissionAndDay(
                    mission._id,
                    7
                );

        if (!daySevenTask) {

            throw new AppError(
                404,
                "Weekly review task not found."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Already Fully Completed
        |--------------------------------------------------------------------------
        */

        if (
            daySevenTask.status ===
            DailyTaskStatus.COMPLETED
        ) {

            throw new AppError(
                409,
                "Weekly review has already been completed."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Complete Assessment
        |
        | Retry Safe:
        | If assessment was completed during a previous request,
        | don't create SkillProgress again.
        |--------------------------------------------------------------------------
        */

        if (
            assessment.status !==
            AssessmentStatus.COMPLETED
        ) {

            assessment =
                await assessmentWorkflowService
                    .completeWeeklyAssessment(
                        dto.assessment
                    );

        }

        /*
        |--------------------------------------------------------------------------
        | Create / Reuse Weekly Reflection
        |--------------------------------------------------------------------------
        */

        console.log("STEP 1 DONE");


        console.log("STEP 2: creating reflection");


        let reflection =
            await weeklyReflectionService
                .getReflection({

                    missionId:
                        mission._id,

                });

        if (!reflection) {

            reflection =
                await weeklyReflectionService
                    .createReflection({

                        careerJourneyId:
                            careerJourney._id,

                        missionId:
                            mission._id,

                        assessmentId:
                            assessment._id,

                        weekNumber:
                            assessment.weekNumber,

                        learningReflection:
                            dto.reflection
                                .learningReflection,

                        mentorCheckIn:
                            dto.reflection
                                .mentorCheckIn,

                        additionalComments:
                            dto.reflection
                                .additionalComments,

                    });

        }

        /*
        |--------------------------------------------------------------------------
        | Create / Reuse Weekly Report
        |--------------------------------------------------------------------------
        */

        console.log("STEP 2 DONE");


        console.log("STEP 3: generating weekly report");

        let weeklyReport =
            await weeklyReportService
                .getByReflectionId(
                    reflection._id
                );

        if (!weeklyReport) {

            weeklyReport =
                await weeklyReportWorkflow
                    .generateWeeklyReport(
                        mission,
                        assessment,
                        reflection
                    );

        }

        /*
        |--------------------------------------------------------------------------
        | Complete Day 7
        |--------------------------------------------------------------------------
        */


        console.log("STEP 3 DONE");


        console.log(
            "STEP 4: completing weekly review task",
            {
                missionId: mission._id.toString(),
                daySevenTaskId: daySevenTask._id.toString(),
            }
        );

        await dailyTaskService.completeWeeklyReviewTask(
            mission._id
        );

        /*
        |--------------------------------------------------------------------------
        | Complete Mission
        |--------------------------------------------------------------------------
        */

        console.log("STEP 4 DONE");


        console.log("STEP 5: completinsg mission");

        await missionService.markAsCompleted(
            mission._id.toString()
        );

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return {

            missionId:
                mission._id.toString(),

            missionNumber:
                mission.missionNumber,

            assessment,

            reflection,

            weeklyReport,

        };

    }

    private async validateSubmittedSkills(
        careerJourneyId: Types.ObjectId,
        mission: {
            plannedRoadmapItemIds: Types.ObjectId[];
        },
        submittedSkills: {
            userSkillId: Types.ObjectId;
            obtainedMarks: number;
            totalMarks: number;
        }[]
    ): Promise<void> {

        /*
        |--------------------------------------------------------------------------
        | Roadmap Items For Current Mission
        |--------------------------------------------------------------------------
        */

        const roadmapItems =
            await roadmapService.getRoadmapItemsByIds(
                mission.plannedRoadmapItemIds
            );

        /*
        |--------------------------------------------------------------------------
        | Extract Skills Actually Covered This Week
        |--------------------------------------------------------------------------
        */

        const skillCatalogIds =
            [
                ...new Map(
                    roadmapItems
                        .filter(
                            item =>
                                item.skillId
                        )
                        .map(
                            item => [
                                item.skillId!
                                    .toString(),

                                item.skillId!,
                            ]
                        )
                ).values(),
            ];

        if (skillCatalogIds.length === 0) {

            throw new AppError(
                409,
                "No assessable skills found for this mission."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Resolve Valid User Skills
        |--------------------------------------------------------------------------
        */

        const userSkills =
            await userSkillService
                .getUserSkillsByCatalogIds(
                    careerJourneyId,
                    skillCatalogIds
                );

        const allowedUserSkillIds =
            new Set(
                userSkills.map(
                    skill =>
                        skill._id.toString()
                )
            );

        /*
        |--------------------------------------------------------------------------
        | Submitted IDs
        |--------------------------------------------------------------------------
        */

        const submittedUserSkillIds =
            submittedSkills.map(
                skill =>
                    skill.userSkillId.toString()
            );

        /*
        |--------------------------------------------------------------------------
        | Reject Duplicate Skills
        |--------------------------------------------------------------------------
        */

        const uniqueSubmittedIds =
            new Set(
                submittedUserSkillIds
            );

        if (
            uniqueSubmittedIds.size !==
            submittedUserSkillIds.length
        ) {

            throw new AppError(
                400,
                "Duplicate skills are not allowed in weekly assessment."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Reject Skills Outside Current Mission
        |--------------------------------------------------------------------------
        */

        const containsInvalidSkill =
            submittedUserSkillIds.some(
                id =>
                    !allowedUserSkillIds.has(
                        id
                    )
            );

        if (containsInvalidSkill) {

            throw new AppError(
                400,
                "Assessment contains a skill that does not belong to the current weekly review."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Ensure Every Required Skill Was Submitted
        |--------------------------------------------------------------------------
        */

        if (
            uniqueSubmittedIds.size !==
            allowedUserSkillIds.size
        ) {

            throw new AppError(
                400,
                "Assessment scores must be submitted for every skill in the current weekly review."
            );

        }

    }

}

export const weeklyReviewWorkflow =
    new WeeklyReviewWorkflow();