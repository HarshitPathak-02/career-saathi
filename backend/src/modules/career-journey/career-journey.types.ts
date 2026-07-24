import { Types } from "mongoose";

import {
    CareerJourneyStatus,
    PreferredLanguage,
    SkillSource,
} from "./career-journey.enums.js";
import { CareerJourneyDocument } from "./career-journey.model.js";

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

    status: CareerJourneyStatus;
}

export interface UpdateCareerJourneyInput {
    domainId?: Types.ObjectId;

    roleId?: Types.ObjectId;

    targetCompany?: string;

    targetDurationMonths?: number;

    dailyStudyHours?: number;

    preferredLanguage?: PreferredLanguage;

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
}

export interface UpdateCareerJourneyDto
    extends Partial<CreateCareerJourneyDto> { }

export interface UpdateCareerJourneyStatusDto {
    status: CareerJourneyStatus;
}

export interface CareerJourneyIdParamDto {
    careerJourneyId: string;
}

export interface PopulatedCareerRole {
    _id: Types.ObjectId;

    name: string;

    slug: string;

    description?: string;

    domainId: Types.ObjectId;

    isActive: boolean;
}

export interface PopulatedCareerDomain {
    _id: Types.ObjectId;

    name: string;

    slug: string;

    description?: string;

    isActive: boolean;
}

export type PopulatedCareerJourneyDocument =
    Omit<
        CareerJourneyDocument,
        "roleId" | "domainId"
    > & {
        roleId: PopulatedCareerRole;

        domainId: PopulatedCareerDomain;
    };