import { Types } from "mongoose";

import type {
    CreateResumeDto,
    CreateResumeInput,
    ResumeAnalysisResponse,
    ResumeConfirmationResponse,
    ResumeResponse,
    UpdateResumeDto,
    UpdateResumeInput,
} from "./resume.types.js";

import { ResumeStatus } from "./resume.enums.js";

import type { ResumeDocument } from "./resume.model.js";

import type { UploadFileResult } from "../../shared/storage/index.js";

import type { ExtractedResumeText } from "./resume-text.extractor.js";

export class ResumeMapper {
    static toCreateInput(
        userId: Types.ObjectId,
        dto: CreateResumeDto,
        file: Express.Multer.File,
        uploadResult: UploadFileResult,
        extractedText: ExtractedResumeText,
        uploadedAt: Date
    ): CreateResumeInput {
        return {
            userId,

            careerJourneyId: new Types.ObjectId(dto.careerJourneyId),

            originalFileName: file.originalname,

            cloudinaryPublicId: uploadResult.publicId,

            cloudinarySecureUrl: uploadResult.secureUrl,

            mimeType: file.mimetype,

            fileSize: file.size,

            extractedText: extractedText.text,

            extractedTextLength: extractedText.text.length,

            pageCount: extractedText.pageCount,

            status: ResumeStatus.UPLOADED,

            uploadedAt,
        };
    }

    static toUpdateInput(
        dto: UpdateResumeDto
    ): UpdateResumeInput {
        const updateData: UpdateResumeInput = {};

        if (dto.careerJourneyId) {
            updateData.careerJourneyId = new Types.ObjectId(
                dto.careerJourneyId
            );
        }

        return updateData;
    }

    static toResponse(
        resume: ResumeDocument
    ): ResumeResponse {
        return {
            id: resume._id.toString(),

            careerJourneyId: resume.careerJourneyId.toString(),

            originalFileName: resume.originalFileName,

            mimeType: resume.mimeType,

            fileSize: resume.fileSize,

            pageCount: resume.pageCount ?? null,

            status: resume.status,

            analysis: this.toAnalysisResponse(resume),

            analysisError: resume.analysisError ?? null,

            confirmation: this.toConfirmationResponse(resume),

            uploadedAt: resume.uploadedAt,

            createdAt: resume.createdAt,

            updatedAt: resume.updatedAt,
        };
    }

    static toResponseList(
        resumes: ResumeDocument[]
    ): ResumeResponse[] {
        return resumes.map((resume) => this.toResponse(resume));
    }

    private static toConfirmationResponse(
        resume: ResumeDocument
    ): ResumeConfirmationResponse | null {
        if (!resume.confirmation) {
            return null;
        }

        return {
            skillCatalogIds:
                resume.confirmation.skillCatalogIds.map(
                    (skillCatalogId) =>
                        skillCatalogId.toString()
                ),

            newSkillCatalogIds: [],

            confirmedAt:
                resume.confirmation.confirmedAt,
        };
    }

    private static toAnalysisResponse(
        resume: ResumeDocument
    ): ResumeAnalysisResponse | null {
        if (!resume.analysis) {
            return null;
        }

        return {
            skills: resume.analysis.skills.map((skill) => ({
                skillCatalogId: skill.skillCatalogId
                    ? skill.skillCatalogId.toString()
                    : null,

                name: skill.name,

                slug: skill.slug ?? null,

                evidence: skill.evidence,

                confidence: skill.confidence,

                matched: skill.matched,
            })),

            provider: resume.analysis.provider,

            model: resume.analysis.model,

            analyzedAt: resume.analysis.analyzedAt,

            textLength: resume.analysis.textLength,
        };
    }
}
