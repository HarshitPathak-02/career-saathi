import { Types } from "mongoose";

import type {
    CreateResumeDto,
} from "./resume.types.js";

import { ResumeMapper } from "./resume.mapper.js";
import { resumeRepository } from "./resume.repository.js";
import { extractResumeText } from "./resume-text.extractor.js";

import { careerJourneyRepository } from "../career-journey/career-journey.repository.js";

import {
    storageService,
} from "../../shared/storage/index.js";

import type {
    UploadFileInput,
} from "../../shared/storage/index.js";

import { appClock } from "../../shared/time/app-clock.js";
import { executeTransaction } from "../../shared/utils/transaction.util.js";

import logger from "../../config/logger.js";

import { AppError } from "../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";

export class ResumeService {

    async uploadResume(
        userId: string,
        data: CreateResumeDto,
        file: Express.Multer.File
    ) {

        const userObjectId =
            new Types.ObjectId(userId);

        const careerJourneyObjectId =
            new Types.ObjectId(data.careerJourneyId);

        const careerJourney =
            await careerJourneyRepository.findByIdAndUserId(
                careerJourneyObjectId,
                userObjectId
            );

        if (!careerJourney) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }

        const existingResume =
            await resumeRepository.findByCareerJourneyIdAndUserId(
                userObjectId,
                careerJourneyObjectId
            );

        const extractedText =
            await extractResumeText(
                file.buffer,
                file.mimetype
            );

        const uploadInput: UploadFileInput = {
            buffer: file.buffer,
            fileName: file.originalname,
            mimeType: file.mimetype,
        };

        const uploadResult =
            await storageService.uploadFile(
                uploadInput,
                {
                    folder: "career-saathi/resumes",
                    resourceType: "raw",
                }
            );

        try {

            const createInput =
                ResumeMapper.toCreateInput(
                    userObjectId,
                    data,
                    file,
                    uploadResult,
                    extractedText,
                    appClock.now()
                );

            const resume = await executeTransaction(
                async (session) => {

                    const createdResume =
                        await resumeRepository.create(
                            createInput,
                            session
                        );

                    if (existingResume) {

                        const deletedResume =
                            await resumeRepository.softDelete(
                                existingResume._id,
                                session
                            );

                        if (!deletedResume) {
                            throw new AppError(
                                HTTP_STATUS.CONFLICT,
                                "Resume was updated by another request. Please try again."
                            );
                        }
                    }

                    return createdResume;
                }
            );

            if (existingResume) {
                try {
                    await storageService.deleteFile(
                        existingResume.cloudinaryPublicId
                    );
                } catch (error) {
                    logger.warn(
                        {
                            error,
                            resumeId:
                                existingResume._id.toString(),
                        },
                        "Failed to delete replaced resume file."
                    );
                }
            }

            return resume;

        } catch (error) {

            await this.cleanupUploadedFile(
                uploadResult.publicId
            );

            throw error;
        }
    }

    async getResumeById(
        userId: string,
        resumeId: string
    ) {

        const userObjectId =
            new Types.ObjectId(userId);

        const resumeObjectId =
            new Types.ObjectId(resumeId);

        const resume =
            await resumeRepository.findByIdAndUserId(
                userObjectId,
                resumeObjectId
            );

        if (!resume) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Resume not found."
            );
        }

        return resume;
    }

    async getResumeByCareerJourney(
        userId: string,
        careerJourneyId: string
    ) {

        const userObjectId =
            new Types.ObjectId(userId);

        const careerJourneyObjectId =
            new Types.ObjectId(careerJourneyId);

        const resume =
            await resumeRepository.findByCareerJourneyIdAndUserId(
                userObjectId,
                careerJourneyObjectId
            );

        if (!resume) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Resume not found."
            );
        }

        return resume;
    }

    async getUserResumes(
        userId: string
    ) {

        const userObjectId =
            new Types.ObjectId(userId);

        return resumeRepository.findAllByUserId(
            userObjectId
        );
    }

    async deleteResume(
        userId: string,
        resumeId: string
    ) {

        const userObjectId =
            new Types.ObjectId(userId);

        const resumeObjectId =
            new Types.ObjectId(resumeId);

        const resume =
            await resumeRepository.findByIdAndUserId(
                userObjectId,
                resumeObjectId
            );

        if (!resume) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Resume not found."
            );
        }

        await storageService.deleteFile(
            resume.cloudinaryPublicId
        );

        await resumeRepository.softDelete(
            resumeObjectId
        );
    }

    private async cleanupUploadedFile(
        publicId: string
    ) {

        try {

            await storageService.deleteFile(
                publicId
            );

        } catch {

            // Ignore cleanup failures.

        }
    }
}

export const resumeService =
    new ResumeService();