import { Types } from "mongoose";

import {
    CreateResumeDto,
    CreateResumeInput,
    UpdateResumeDto,
    UpdateResumeInput,
} from "./resume.types.js";

import { ResumeStatus } from "./resume.enums.js";

import { UploadFileResult } from "../../shared/storage/index.js";

export class ResumeMapper {
    static toCreateInput(
        userId: Types.ObjectId,
        dto: CreateResumeDto,
        file: Express.Multer.File,
        uploadResult: UploadFileResult
    ): CreateResumeInput {
        return {
            userId,

            careerJourneyId: new Types.ObjectId(dto.careerJourneyId),

            originalFileName: file.originalname,

            cloudinaryPublicId: uploadResult.publicId,

            cloudinarySecureUrl: uploadResult.secureUrl,

            mimeType: file.mimetype,

            fileSize: file.size,

            status: ResumeStatus.UPLOADED,

            uploadedAt: new Date(),
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
}