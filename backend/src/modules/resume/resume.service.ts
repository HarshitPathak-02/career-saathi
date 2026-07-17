import { Types } from "mongoose";

import {
    CreateResumeDto,
} from "./resume.types.js";

import { ResumeMapper } from "./resume.mapper.js";
import { resumeRepository } from "./resume.repository.js";

import { careerJourneyRepository } from "../career-journey/career-journey.repository.js";

import {
    storageService,
    UploadFileInput,
} from "../../shared/storage/index.js";

import { AppError } from "../../core/errors/app-error.js";

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
                userObjectId,
                careerJourneyObjectId
            );

        if (!careerJourney) {
            throw new AppError(
                404,
                "Career journey not found."
            );
        }

        const existingResume =
            await resumeRepository.findByCareerJourneyIdAndUserId(
                userObjectId,
                careerJourneyObjectId
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
                    uploadResult
                );

            const resume =
                await resumeRepository.create(
                    createInput
                );

            if (existingResume) {



                await resumeRepository.softDelete(
                    existingResume._id
                );

                await storageService.deleteFile(
                    existingResume.cloudinaryPublicId
                );
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
                404,
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
                404,
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
                404,
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