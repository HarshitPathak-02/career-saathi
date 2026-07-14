import { HydratedDocument, Types } from 'mongoose';

import {
    AssessmentStatus,
} from './assessment.enums.js';
import { ProficiencyLevel } from '../../shared/enums/proficiency-level.enum.js';

export interface IAssessment {
    userId: Types.ObjectId;

    careerJourneyId: Types.ObjectId;

    status: AssessmentStatus;

    overallScore: number;

    overallLevel: ProficiencyLevel;

    startedAt: Date;

    completedAt?: Date;

    createdAt: Date;

    updatedAt: Date;
}

export type AssessmentDocument =
    HydratedDocument<IAssessment>;

export interface CreateAssessmentData {
    userId: Types.ObjectId;

    careerJourneyId: Types.ObjectId;

    status: AssessmentStatus;

    overallScore: number;

    overallLevel: ProficiencyLevel;

    startedAt: Date;

    completedAt?: Date;
}

export interface UpdateAssessmentData
    extends Partial<
        Omit<
            CreateAssessmentData,
            'userId' | 'careerJourneyId'
        >
    > {}

export interface AssessmentResponse {
    id: string;

    status: AssessmentStatus;

    overallScore: number;

    overallLevel: ProficiencyLevel;

    startedAt: Date;

    completedAt?: Date;

    createdAt: Date;

    updatedAt: Date;
}