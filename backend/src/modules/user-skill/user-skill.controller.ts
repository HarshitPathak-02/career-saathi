import { Request, Response } from "express";

import { asyncHandler } from "../../core/middleware/async-handler.js";
import { userSkillService } from "./user-skill.service.js";
import { successResponse } from "../../core/responses/successResponse.js";

class UserSkillController {
    getAvailableSkills = asyncHandler(
        async (req: Request, res: Response) => {
            const { careerJourneyId } = req.params;

            const skills = await userSkillService.getAvailableSkills(
                careerJourneyId as any
            );

            return successResponse({ res, statusCode: 200, message: "Skills are fetched", data: skills })
        }
    );

    initializeUserSkills = asyncHandler(
        async (req: Request, res: Response) => {
            const { selectedSkillCatalogIds } = req.body;
            const { careerJourneyId } = req.params as {
                careerJourneyId: string
            }

            console.log("user-skill req params", req.params);

            await userSkillService.initializeUserSkills(
                careerJourneyId,
                selectedSkillCatalogIds
            );

            return successResponse({ res, statusCode: 201, message: "Skills are initialized", data: null })
        }
    );

    getUserSkills = asyncHandler(
        async (req: Request, res: Response) => {
            const { careerJourneyId } = req.params;

            const skills = await userSkillService.getUserSkills(
                careerJourneyId as any
            );

            return successResponse({ res, statusCode: 200, message: "Skills are fetched", data: skills })
        }
    );

    updateSelectedSkills = asyncHandler(
        async (req: Request, res: Response) => {
            const { careerJourneyId } = req.params;
            const { selectedSkillCatalogIds } = req.body;

            const skills =
                await userSkillService.updateSelectedSkills(
                    careerJourneyId as any,
                    selectedSkillCatalogIds
                );

            return successResponse({ res, statusCode: 200, message: "Skills are fetched", data: skills })
        }
    );
}

export const userSkillController = new UserSkillController();