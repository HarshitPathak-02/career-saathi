import { AppError } from "../../core/errors/app-error.js";
import { AssessmentStatus, AssessmentType } from "../assessment/assessment.enums.js";
import { assessmentService } from "../assessment/assessment.service.js";
import { careerJourneyService } from "../career-journey/career-journey.service.js";
import { missionService } from "../mission/mission.service.js";
import { WeeklyReflectionMessages } from "./weekly-reflection.messages.js";
import { weeklyReflectionService } from "./weekly-reflection.service.js";
import { SubmitWeeklyReflectionDTO } from "./weekly-reflection.types.js";

class WeeklyReflectionWorkflow {

    async submitReflection(
        userId: string,
        careerJourneyId: string,
        dto: SubmitWeeklyReflectionDTO,
    ) {

        // Validate career journey ownership
        const careerJourney =
            await careerJourneyService.getCareerJourneyById(
                userId,
                careerJourneyId,
            );

        // Validate assessment
        const assessment =
            await assessmentService.getAssessmentById(
                dto.assessmentId,
            );

        if (
            assessment.careerJourneyId.toString() !==
            careerJourney._id.toString()
        ) {
            throw new AppError(
                400,
                WeeklyReflectionMessages.INVALID_ASSESSMENT,
            );
        }

        if (
            assessment.type !== AssessmentType.WEEKLY
        ) {
            throw new AppError(
                400,
                WeeklyReflectionMessages.INVALID_ASSESSMENT_TYPE,
            );
        }

        if (
            assessment.status !== AssessmentStatus.COMPLETED
        ) {
            throw new AppError(
                400,
                WeeklyReflectionMessages.ASSESSMENT_NOT_COMPLETED,
            );
        }

        // TODO: Replace this with your MissionService implementation
        const mission =
            await missionService.getActiveMission(
                careerJourney._id.toString()
            );

        if (!mission) {
            throw new AppError(
                404,
                WeeklyReflectionMessages.INVALID_MISSION,
            );
        }

        const exists =
            await weeklyReflectionService.exists({

                careerJourneyId:
                    careerJourney._id,

                weekNumber:
                    assessment.weekNumber,

            });

        if (exists) {
            throw new AppError(
                409,
                WeeklyReflectionMessages.ALREADY_SUBMITTED,
            );
        }

        return weeklyReflectionService.createReflection({

            careerJourneyId:
                careerJourney._id,

            missionId:
                mission._id,

            assessmentId:
                assessment._id,

            weekNumber:
                assessment.weekNumber,

            learningReflection:
                dto.learningReflection,

            mentorCheckIn:
                dto.mentorCheckIn,

            additionalComments:
                dto.additionalComments,

        });

    }

}

export const weeklyReflectionWorkflow = new WeeklyReflectionWorkflow();