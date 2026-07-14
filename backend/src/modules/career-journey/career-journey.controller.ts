import { Request, Response } from 'express';

import { careerJourneyService } from './career-journey.service.js';
import { CAREER_JOURNEY_MESSAGES } from './career-journey.constants.js';
import { CreateCareerJourneyInput } from './career-journey.validation.js';

import { asyncHandler } from '../../core/middleware/async-handler.js';
import { successResponse } from '../../core/responses/successResponse.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';
import { getAuthUser } from '../../shared/utils/get-auth-user.js';

class CareerJourneyController {
    create = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {
            const user = getAuthUser(req);
            const journey =
                await careerJourneyService.create(
                    user.userId,
                    req.body as CreateCareerJourneyInput
                );

            return successResponse({
                res,
                statusCode: HTTP_STATUS.CREATED,
                message:
                    CAREER_JOURNEY_MESSAGES.CREATED,
                data: journey,
            });
        }
    );

    findAll = asyncHandler(
        async (req, res) => {
            const user = getAuthUser(req);

            const journeys =
                await careerJourneyService.findAll(
                    user.userId
                );

            return successResponse({
                res,
                message:
                    CAREER_JOURNEY_MESSAGES.FETCHED,
                data: journeys,
            });
        }
    );

    findById = asyncHandler(
        async (req, res) => {
            const user = getAuthUser(req);

            const journey =
                await careerJourneyService.findById(
                    req.params.id as string,
                    user.userId
                );

            return successResponse({
                res,
                message:
                    CAREER_JOURNEY_MESSAGES.FETCHED_ONE,
                data: journey,
            });
        }
    );

    update = asyncHandler(
        async (req, res) => {
            const user = getAuthUser(req);

            const updatedJourney =
                await careerJourneyService.update(
                    req.params.id as string,
                    user.userId,
                    req.body
                );

            return successResponse({
                res,
                message:
                    CAREER_JOURNEY_MESSAGES.UPDATED,
                data: updatedJourney,
            });
        }
    );

    delete = asyncHandler(
        async (req, res) => {

            const user = getAuthUser(req);

            await careerJourneyService.delete(
                req.params.id as string,
                user.userId
            );

            return successResponse({
                res,
                message:
                    CAREER_JOURNEY_MESSAGES.DELETED,
            });
        }
    );

    activate = asyncHandler(
        async (req, res) => {
            const user = getAuthUser(req);

            const journey =
                await careerJourneyService.activate(
                    req.params.id as string,
                    user.userId
                );

            return successResponse({
                res,
                message:
                    CAREER_JOURNEY_MESSAGES.ACTIVATED,
                data: journey,
            });
        }
    );
}

export const careerJourneyController =
    new CareerJourneyController();