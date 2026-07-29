import {
    Request,
    Response,
} from "express";

import {
    asyncHandler,
} from "../../core/middleware/async-handler.js";

import {
    successResponse,
} from "../../core/responses/successResponse.js";

import {
    HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";

import {
    userSkillService,
} from "./user-skill.service.js";
import { CareerJourneyIdParamDto } from "../career-journey/career-journey.types.js";

class UserSkillController {

    getAvailableSkills =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const {
                    careerJourneyId,
                } = req.params as unknown as CareerJourneyIdParamDto;

                const skills =
                    await userSkillService
                        .getAvailableSkills(
                            careerJourneyId
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.OK,

                    message:
                        "Available skills fetched successfully.",

                    data:
                        skills,
                });
            }
        );

    initializeUserSkills =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const {
                    careerJourneyId,
                } = req.params as {
                    careerJourneyId: string;
                };

                const {
                    selectedSkillCatalogIds,
                } = req.body;

                await userSkillService
                    .initializeUserSkills(
                        careerJourneyId,
                        selectedSkillCatalogIds
                    );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.CREATED,

                    message:
                        "User skills initialized successfully.",
                });
            }
        );

    getUserSkills =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const {
                    careerJourneyId,
                } = req.params as unknown as CareerJourneyIdParamDto

                const skills =
                    await userSkillService
                        .getUserSkills(
                            careerJourneyId
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.OK,

                    message:
                        "User skills fetched successfully.",

                    data:
                        skills,
                });
            }
        );

    updateSelectedSkills =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const {
                    careerJourneyId,
                } = req.params as unknown as CareerJourneyIdParamDto

                const {
                    selectedSkillCatalogIds,
                } = req.body;

                const skills =
                    await userSkillService
                        .updateSelectedSkills(
                            careerJourneyId,
                            selectedSkillCatalogIds
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.OK,

                    message:
                        "Selected skills updated successfully.",

                    data:
                        skills,
                });
            }
        );
}

export const userSkillController =
    new UserSkillController();