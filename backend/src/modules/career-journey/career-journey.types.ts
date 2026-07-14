import { Types, HydratedDocument } from 'mongoose';

import {
    CareerJourneyStatus,
    CurrentLevel,
    DurationUnit,
} from './career-journey.enums.js';
import { CareerRoleCode } from '../career-role/career-role.enums.js';

export interface TargetDuration {
    value: number;
    unit: DurationUnit;
}

export interface CareerContext {
    domain: string;

    goal: string;

    careerRoleCode: CareerRoleCode;

    currentLevel: CurrentLevel;

    targetDuration: TargetDuration;

    dailyAvailability: number;
}

export interface ICareerJourney {
    userId: Types.ObjectId;

    title: string;

    careerContext: CareerContext;

    status: CareerJourneyStatus;

    createdAt: Date,

    updatedAt: Date
}

export type CareerJourneyDocument =
    HydratedDocument<ICareerJourney>;


export interface CareerJourneyResponse {
    id: string;

    title: string;

    careerContext: CareerContext;

    status: CareerJourneyStatus;
    createdAt: Date;

    updatedAt: Date;
}

export interface CreateCareerJourneyData {
    userId: Types.ObjectId;

    title: string;

    careerContext: CareerContext;

    status: CareerJourneyStatus;
}

export interface UpdateCareerJourneyData
    extends Partial<
        Omit<CreateCareerJourneyData, 'userId'>
    > { }