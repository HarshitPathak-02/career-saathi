import { Types } from "mongoose";
import { CareerJourneyDocument, CareerJourneyStatus, PreferredLanguage } from "./index.js";


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

export interface CareerJourneyResponse {

    id: string;

    domainId: string;

    roleId: string;

    targetCompany: string;

    targetDurationMonths: number;

    dailyStudyHours: number;

    preferredLanguage: PreferredLanguage;

    status: CareerJourneyStatus;

    createdAt: Date;

    updatedAt: Date;
}