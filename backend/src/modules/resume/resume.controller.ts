import type {
    Request,
    Response,
} from "express";

import { Types } from "mongoose";

import { resumeService } from "./resume.service.js";
import { resumeAnalysisService } from "./resume-analysis.service.js";
import { resumeConfirmationService } from "./resume-confirmation.service.js";
import { ResumeMapper } from "./resume.mapper.js";

import type {
    ConfirmResumeSkillsDto,
    CreateResumeDto,
} from "./resume.types.js";

import { asyncHandler } from "../../core/middleware/async-handler.js";
import { successResponse } from "../../core/responses/successResponse.js";
import { getAuthUser } from "../../shared/utils/get-auth-user.js";
import { AppError } from "../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";

export class ResumeController {

    uploadResume = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const body =
                req.body as CreateResumeDto;

            if (!req.file) {
                throw new AppError(HTTP_STATUS.BAD_REQUEST, "Resume file is required.");
            }

            const resume =
                await resumeService.uploadResume(
                    user.userId,
                    body,
                    req.file
                );

            return successResponse({
                res,

                statusCode:
                    HTTP_STATUS.CREATED,

                message:
                    "Resume uploaded successfully.",

                data:
                    ResumeMapper.toResponse(
                        resume
                    ),
            });
        }
    );

    analyzeResume = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const { resumeId } =
                req.params as {
                    resumeId: string
                };

            const resume =
                await resumeAnalysisService
                    .analyzeResume(
                        user.userId,
                        resumeId
                    );

            return successResponse({
                res,

                statusCode:
                    HTTP_STATUS.OK,

                message:
                    "Resume analyzed successfully.",

                data:
                    resume,
            });
        }
    );

    confirmSkills = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const { resumeId } =
                req.params as {
                    resumeId: string
                };

            const { skillCatalogIds } =
                req.body as ConfirmResumeSkillsDto;

            const resume =
                await resumeConfirmationService
                    .confirmSkills(
                        user.userId,
                        resumeId,

                        skillCatalogIds.map(
                            (skillCatalogId) =>
                                new Types.ObjectId(
                                    skillCatalogId
                                )
                        )
                    );

            return successResponse({
                res,

                statusCode:
                    HTTP_STATUS.OK,

                message:
                    "Resume skills confirmed successfully.",

                data:
                    resume,
            });
        }
    );

    getResumeById = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const { resumeId } =
                req.params as {
                    resumeId: string
                };

            const resume =
                await resumeService.getResumeById(
                    user.userId,
                    resumeId
                );

            return successResponse({
                res,

                statusCode:
                    HTTP_STATUS.OK,

                message:
                    "Resume fetched successfully.",

                data:
                    ResumeMapper.toResponse(
                        resume
                    ),
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

            return successResponse({
                res,

                statusCode:
                    HTTP_STATUS.OK,

                message:
                    "Resume fetched successfully.",

                data:
                    ResumeMapper.toResponse(
                        resume
                    ),
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

            return successResponse({
                res,

                statusCode:
                    HTTP_STATUS.OK,

                message:
                    "Resumes fetched successfully.",

                data:
                    ResumeMapper.toResponseList(
                        resumes
                    ),
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

            return successResponse({
                res,

                statusCode:
                    HTTP_STATUS.OK,

                message:
                    "Resume deleted successfully.",
            });
        }
    );
}

export const resumeController =
    new ResumeController();
