import { Types } from "mongoose";

import { ResumeStatus } from "./resume.enums.js";

//
// ===========================
// DTOs
// ===========================
//

export interface CreateResumeDto {
    careerJourneyId: string;
}

export interface UpdateResumeDto {
    careerJourneyId?: string;
}

export interface ResumeIdParamDto {
    resumeId: string;
}

export interface CareerJourneyResumeParamDto {
    careerJourneyId: string;
}

export interface ConfirmResumeSkillsDto {
    skillCatalogIds: string[];
}

//
// ===========================
// Repository Inputs
// ===========================
//

export interface CreateResumeInput {
    userId: Types.ObjectId;
    careerJourneyId: Types.ObjectId;

    originalFileName: string;

    cloudinaryPublicId: string;
    cloudinarySecureUrl: string;

    mimeType: string;
    fileSize: number;

    extractedText: string;
    extractedTextLength: number;
    pageCount: number | null;

    status: ResumeStatus;

    uploadedAt: Date;
}

export interface ResumeExtractedSkill {
    name: string;

    evidence: string;

    confidence: number;
}

export interface ResumeSkillExtractionOutput {
    skills: ResumeExtractedSkill[];
}

export interface ResumeSkillAnalysis {
    skillCatalogId: Types.ObjectId | null;

    name: string;

    slug: string | null;

    evidence: string;

    confidence: number;

    matched: boolean;
}

export interface ResumeAnalysis {
    skills: ResumeSkillAnalysis[];

    provider: string;

    model: string;

    analyzedAt: Date;

    textLength: number;
}

export interface ResumeConfirmation {
    skillCatalogIds: Types.ObjectId[];

    confirmedAt: Date;
}

export interface ResumeSkillResponse {
    skillCatalogId: string | null;

    name: string;

    slug: string | null;

    evidence: string;

    confidence: number;

    matched: boolean;
}

export interface ResumeAnalysisResponse {
    skills: ResumeSkillResponse[];

    provider: string;

    model: string;

    analyzedAt: Date;

    textLength: number;
}

export interface ResumeConfirmationResponse {
    skillCatalogIds: string[];

    newSkillCatalogIds: string[];

    confirmedAt: Date;
}

export interface ResumeResponse {
    id: string;

    careerJourneyId: string;

    originalFileName: string;

    mimeType: string;

    fileSize: number;

    pageCount: number | null;

    status: ResumeStatus;

    analysis: ResumeAnalysisResponse | null;

    analysisError: string | null;

    confirmation: ResumeConfirmationResponse | null;

    uploadedAt: Date;

    createdAt: Date;

    updatedAt: Date;
}

export interface UpdateResumeInput {
    careerJourneyId?: Types.ObjectId;
    status?: ResumeStatus;
}

export interface UpdateResumeAnalysisInput {
    status: ResumeStatus;

    analysis?: ResumeAnalysis | null;

    analysisError?: string | null;
}

export interface UpdateResumeConfirmationInput {
    confirmation: ResumeConfirmation | null;
}

//
// ===========================
// Query Inputs
// ===========================
//

export interface FindResumeInput {
    userId: Types.ObjectId;
}

export interface DeleteResumeInput {
    deletedAt: Date;
}