import { Request, Response } from "express";

import { asyncHandler } from "../../core/middleware/async-handler.js";

import { weeklyReflectionWorkflow } from "./weekly-reflection.workflow.js";
import { getAuthUser } from "../../shared/utils/get-auth-user.js";

class WeeklyReflectionController {

    submitReflection = asyncHandler(

        async (req: Request, res: Response) => {

            const { careerJourneyId } = req.params;

            const user = getAuthUser(req);

            const reflection =
                await weeklyReflectionWorkflow.submitReflection(
                    user.userId,
                    careerJourneyId as string,
                    req.body,
                );

            return res.status(201).json(reflection);

        },

    );

}

export const weeklyReflectionController =
    new WeeklyReflectionController();