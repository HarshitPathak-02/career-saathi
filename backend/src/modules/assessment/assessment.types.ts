import {
    HydratedDocument,
    Types,
} from 'mongoose';

import {
    AssessmentContextType,
    AssessmentStatus,
} from './assessment.enums.js';

import {
    ProficiencyLevel,
} from '../../shared/enums/proficiency-level.enum.js';

export interface IAssessment {

    userId:
        Types.ObjectId;

    careerJourneyId:
        Types.ObjectId;

    contextType:
        AssessmentContextType;

    contextId?:
        Types.ObjectId;

    questionIds:
        Types.ObjectId[];

    status:
        AssessmentStatus;

    passingScore:
        number;

    passed:
        boolean;

    overallScore:
        number;

    overallLevel:
        ProficiencyLevel;

    startedAt:
        Date;

    completedAt?:
        Date;

    createdAt:
        Date;

    updatedAt:
        Date;
}

export type AssessmentDocument =
    HydratedDocument<IAssessment>;

export interface CreateAssessmentData {

    userId:
        Types.ObjectId;

    careerJourneyId:
        Types.ObjectId;

    contextType:
        AssessmentContextType;

    contextId?:
        Types.ObjectId;

    questionIds:
        Types.ObjectId[];

    status:
        AssessmentStatus;

    passingScore:
        number;

    passed:
        boolean;

    overallScore:
        number;

    overallLevel:
        ProficiencyLevel;

    startedAt:
        Date;

    completedAt?:
        Date;
}

export interface UpdateAssessmentData
    extends Partial<
        Omit<
            CreateAssessmentData,
            | 'userId'
            | 'careerJourneyId'
            | 'contextType'
            | 'contextId'
        >
    > {}

export interface AssessmentResponse {

    id:
        string;

    contextType:
        AssessmentContextType;

    contextId?:
        string;

    status:
        AssessmentStatus;

    passingScore:
        number;

    passed:
        boolean;

    overallScore:
        number;

    overallLevel:
        ProficiencyLevel;

    startedAt:
        Date;

    completedAt?:
        Date;

    createdAt:
        Date;

    updatedAt:
        Date;
}