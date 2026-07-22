import { WeeklyReflectionDocument } from "./weekly-reflection.schema.js";

export class WeeklyReflectionMapper {

    static toResponse(
        reflection: WeeklyReflectionDocument,
    ) {

        return {

            id: reflection._id.toString(),

            careerJourneyId:
                reflection.careerJourneyId.toString(),

            missionId:
                reflection.missionId.toString(),

            assessmentId:
                reflection.assessmentId.toString(),

            weekNumber:
                reflection.weekNumber,

            learningReflection:
                reflection.learningReflection,

            mentorCheckIn:
                reflection.mentorCheckIn,

            additionalComments:
                reflection.additionalComments,

        };

    }

}