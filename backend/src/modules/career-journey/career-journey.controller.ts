import { Request, Response } from "express";

import { careerJourneyService } from "./career-journey.service.js";

import {
    CareerJourneyIdParamDto,
    CreateCareerJourneyDto,
    UpdateCareerJourneyDto,
    UpdateCareerJourneyStatusDto,
} from "./career-journey.types.js";

import { getAuthUser } from "../../shared/utils/get-auth-user.js";
import { asyncHandler } from "../../core/middleware/async-handler.js";

export class CareerJourneyController {

    createCareerJourney = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const body =
                req.body as CreateCareerJourneyDto;

            console.log("create journey hit with body:", body)

            const careerJourney =
                await careerJourneyService.createCareerJourney(
                    user.userId,
                    body
                );

            return res.status(201).json({
                success: true,
                message: "Career journey created successfully.",
                data: careerJourney,
            });
        }
    );

    getCareerJourneyById = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const { careerJourneyId } =
                req.params as {
                    careerJourneyId: string
                };

            const careerJourney =
                await careerJourneyService.getCareerJourneyById(
                    user.userId,
                    careerJourneyId
                );

            return res.status(200).json({
                success: true,
                data: careerJourney,
            });
        }
    );

    getActiveCareerJourney = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const careerJourney =
                await careerJourneyService.getActiveCareerJourney(
                    user.userId
                );

            return res.status(200).json({
                success: true,
                data: careerJourney,
            });
        }
    );

    updateCareerJourney = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const { careerJourneyId } =
                req.params as {
                    careerJourneyId: string
                };;

            const body =
                req.body as UpdateCareerJourneyDto;

            const careerJourney =
                await careerJourneyService.updateCareerJourney(
                    user.userId,
                    careerJourneyId,
                    body
                );

            return res.status(200).json({
                success: true,
                message: "Career journey updated successfully.",
                data: careerJourney,
            });
        }
    );

    updateCareerJourneyStatus = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const { careerJourneyId } =
                req.params as {
                    careerJourneyId: string
                };;

            const body =
                req.body as UpdateCareerJourneyStatusDto;

            const careerJourney =
                await careerJourneyService.updateCareerJourneyStatus(
                    user.userId,
                    careerJourneyId,
                    body.status
                );

            return res.status(200).json({
                success: true,
                message: "Career journey status updated successfully.",
                data: careerJourney,
            });
        }
    );

    deleteCareerJourney = asyncHandler(
        async (req: Request, res: Response) => {

            const user = getAuthUser(req);

            const { careerJourneyId } =
                req.params as {
                    careerJourneyId: string
                };;

            await careerJourneyService.deleteCareerJourney(
                user.userId,
                careerJourneyId
            );

            return res.status(200).json({
                success: true,
                message: "Career journey deleted successfully.",
            });
        }
    );
}

export const careerJourneyController =
    new CareerJourneyController();