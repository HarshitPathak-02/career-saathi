import { Request, Response } from "express";

import { resumeService } from "./resume.service.js";

import {
    CreateResumeDto,
    ResumeIdParamDto,
    CareerJourneyResumeParamDto,
} from "./resume.types.js";

import { asyncHandler } from "../../core/middleware/async-handler.js";
import { getAuthUser } from "../../shared/utils/get-auth-user.js";

export class ResumeController {

    uploadResume = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const body =
                req.body as CreateResumeDto;

            if (!req.file) {
                throw new Error("Resume file is required.");
            }

            const resume =
                await resumeService.uploadResume(
                    user.userId,
                    body,
                    req.file
                );

            return res.status(201).json({
                success: true,
                message: "Resume uploaded successfully.",
                data: resume,
            });
        }
    );

    getResumeById = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const { resumeId } =
                req.params as {
                    resumeId: string
                }

            const resume =
                await resumeService.getResumeById(
                    user.userId,
                    resumeId
                );

            return res.status(200).json({
                success: true,
                data: resume,
            });
        }
    );

    getResumeByCareerJourney = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const { careerJourneyId } =
                req.params as {
                    careerJourneyId: string
                };

            const resume =
                await resumeService.getResumeByCareerJourney(
                    user.userId,
                    careerJourneyId
                );

            return res.status(200).json({
                success: true,
                data: resume,
            });
        }
    );

    getUserResumes = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const resumes =
                await resumeService.getUserResumes(
                    user.userId
                );

            return res.status(200).json({
                success: true,
                data: resumes,
            });
        }
    );

    deleteResume = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const { resumeId } =
                req.params as {
                    resumeId: string
                };

            await resumeService.deleteResume(
                user.userId,
                resumeId
            );

            return res.status(200).json({
                success: true,
                message: "Resume deleted successfully.",
            });
        }
    );
}

export const resumeController =
    new ResumeController();