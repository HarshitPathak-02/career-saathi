import { Types } from "mongoose";

import {
    CareerJourneyStatus,
    PreferredLanguage,
    SkillSource,
} from "./career-journey.enums.js";

export interface SkillInput {
    skillId: Types.ObjectId;
    source: SkillSource;
    confidence?: number | null;
    verified: boolean;
}

export interface CreateCareerJourneyInput {
    userId: Types.ObjectId;

    domainId: Types.ObjectId;

    roleId: Types.ObjectId;

    targetCompany?: string;

    targetDurationMonths: number;

    dailyStudyHours: number;

    preferredLanguage: PreferredLanguage;

    resumeId?: Types.ObjectId | null;

    status: CareerJourneyStatus;
}

export interface UpdateCareerJourneyInput {
    domainId?: Types.ObjectId;

    roleId?: Types.ObjectId;

    targetCompany?: string;

    targetDurationMonths?: number;

    dailyStudyHours?: number;

    preferredLanguage?: PreferredLanguage;

    resumeId?: Types.ObjectId | null;

}

export interface ExistingSkillDto {
    skillId: string;
    source: SkillSource;
    confidence?: number | null;
    verified?: boolean;
}

export interface CreateCareerJourneyDto {
    domainId: string;
    roleId: string;
    targetCompany?: string;
    targetDurationMonths: number;
    dailyStudyHours: number;
    preferredLanguage: PreferredLanguage;
    resumeId?: string;
}

export interface UpdateCareerJourneyDto
    extends Partial<CreateCareerJourneyDto> { }

export interface UpdateCareerJourneyStatusDto {
    status: CareerJourneyStatus;
}

export interface CareerJourneyIdParamDto {
    careerJourneyId: string;
}