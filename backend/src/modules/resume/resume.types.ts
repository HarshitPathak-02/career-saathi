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

    status: ResumeStatus;

    uploadedAt: Date;
}

export interface UpdateResumeInput {
    careerJourneyId?: Types.ObjectId;
    status?: ResumeStatus;
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