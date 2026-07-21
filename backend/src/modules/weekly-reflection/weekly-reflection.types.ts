import { Types } from "mongoose";

import {
    DifficultyType,
    MotivationLevel,
    OverallWeek,
    ReflectionReason,
} from "./weekly-reflection.enums.js";

export interface LearningReflection {

    completedAllTasks: boolean;

    reason?: ReflectionReason;

    difficultTopicId?: Types.ObjectId;

    difficultyType?: DifficultyType;

    confidenceRating: number;

}

export interface MentorCheckIn {

    overallWeek: OverallWeek;

    motivationLevel: MotivationLevel;

    externalFactors?: string;

    careerConcern?: string;

    helpNeeded?: string;

}

export interface CreateWeeklyReflectionDTO {

    careerJourneyId: Types.ObjectId;

    missionId: Types.ObjectId;

    assessmentId: Types.ObjectId;

    weekNumber: number;

    learningReflection: LearningReflection;

    mentorCheckIn: MentorCheckIn;

    additionalComments?: string;

}

export interface SubmitWeeklyReflectionDTO {

    careerJourneyId: string;

    missionId: string;

    assessmentId: string;

    learningReflection: LearningReflection;

    mentorCheckIn: MentorCheckIn;

    additionalComments?: string;

}

export interface WeeklyReflectionQuery {

    careerJourneyId?: Types.ObjectId;

    missionId?: Types.ObjectId;

    assessmentId?: Types.ObjectId;

    weekNumber?: number;

}

export interface WeeklyReflectionResponseDTO {

    id: string;

    careerJourneyId: string;

    missionId: string;

    assessmentId: string;

    weekNumber: number;

    submittedAt: Date;

}