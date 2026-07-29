import {
    Request,
    Response,
} from "express";

import {
    getAuthUser,
} from "../../shared/utils/get-auth-user.js";

import {
    asyncHandler,
} from "../../core/middleware/async-handler.js";

import {
    successResponse,
} from "../../core/responses/successResponse.js";

import {
    HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";
import { CAREER_JOURNEY_MESSAGES, CareerJourneyIdParamDto, careerJourneyService, CreateCareerJourneyDto, UpdateCareerJourneyDto } from "./index.js";


export class CareerJourneyController {

    createCareerJourney = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const user =
                getAuthUser(req);

            const body =
                req.body as CreateCareerJourneyDto;

            const careerJourney =
                await careerJourneyService
                    .createCareerJourney(
                        user.userId,
                        body
                    );

            return successResponse({
                res,
                statusCode:
                    HTTP_STATUS.CREATED,
                message:
                    CAREER_JOURNEY_MESSAGES.CREATED,
                data:
                    careerJourney,
            });
        }
    );


    getCareerJourneyById = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const user =
                getAuthUser(req);

            const {
                careerJourneyId,
            } =
                req.params as unknown as CareerJourneyIdParamDto;

            const careerJourney =
                await careerJourneyService
                    .getCareerJourneyById(
                        user.userId,
                        careerJourneyId
                    );

            return successResponse({
                res,
                statusCode:
                    HTTP_STATUS.OK,
                message:
                    CAREER_JOURNEY_MESSAGES.FETCHED,
                data:
                    careerJourney,
            });
        }
    );


    getActiveCareerJourney = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const user =
                getAuthUser(req);

            const careerJourney =
                await careerJourneyService
                    .getActiveCareerJourney(
                        user.userId
                    );

            return successResponse({
                res,
                statusCode:
                    HTTP_STATUS.OK,
                message:
                    CAREER_JOURNEY_MESSAGES.ACTIVE_FETCHED,
                data:
                    careerJourney,
            });
        }
    );


    updateCareerJourney = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const user =
                getAuthUser(req);

            const {
                careerJourneyId,
            } =
                req.params as unknown as CareerJourneyIdParamDto;

            const body =
                req.body as UpdateCareerJourneyDto;

            const careerJourney =
                await careerJourneyService
                    .updateCareerJourney(
                        user.userId,
                        careerJourneyId,
                        body
                    );

            return successResponse({
                res,
                statusCode:
                    HTTP_STATUS.OK,
                message:
                    CAREER_JOURNEY_MESSAGES.UPDATED,
                data:
                    careerJourney,
            });
        }
    );


    deleteCareerJourney = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const user =
                getAuthUser(req);

            const {
                careerJourneyId,
            } =
                req.params as unknown as CareerJourneyIdParamDto;

            await careerJourneyService
                .deleteCareerJourney(
                    user.userId,
                    careerJourneyId
                );

            return successResponse({
                res,
                statusCode:
                    HTTP_STATUS.OK,
                message:
                    CAREER_JOURNEY_MESSAGES.DELETED,
            });
        }
    );
}


export const careerJourneyController =
    new CareerJourneyController();