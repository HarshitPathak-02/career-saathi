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
    getAuthUser,
} from "../../shared/utils/get-auth-user.js";

import {
    mockInterviewService,
} from "./mock-interview.service.js";

import {
    mockInterviewResponseMapper,
} from "./mock-interview-response.mapper.js";

import {
    CreateMockInterviewDTO,
} from "./mock-interview.types.js";


class MockInterviewController {

    /*
    |--------------------------------------------------------------------------
    | Create Mock Interview
    |--------------------------------------------------------------------------
    */

    createMockInterview =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(req);

                const body =
                    req.body as
                    CreateMockInterviewDTO;

                const mockInterview =
                    await mockInterviewService
                        .createMockInterview(
                            user.userId,
                            body
                        );

                const data =
                    mockInterviewResponseMapper
                        .toResponse(
                            mockInterview
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.CREATED,

                    message:
                        "Mock interview recorded successfully.",

                    data,
                });
            }
        );


    /*
    |--------------------------------------------------------------------------
    | Get Mock Interview History
    |--------------------------------------------------------------------------
    */

    getMockInterviewHistory =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(req);

                const careerJourneyId =
                    req.params
                        .careerJourneyId

                const mockInterviews =
                    await mockInterviewService
                        .getMockInterviewHistory(
                            user.userId,
                            careerJourneyId as string
                        );

                const data =
                    mockInterviewResponseMapper
                        .toResponseList(
                            mockInterviews
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.OK,

                    message:
                        "Mock interview history fetched successfully.",

                    data,
                });
            }
        );

    getReadinessBattery = asyncHandler(async (req: Request, res: Response) => {
        const user = getAuthUser(req);
        const careerJourneyId = req.query.careerJourneyId as string;

        const data = await mockInterviewService.getReadinessBattery(
            user.userId,
            careerJourneyId
        );

        return successResponse({
            res,
            statusCode: HTTP_STATUS.OK,
            message: "Readiness interview battery fetched successfully.",
            data,
        });
    });

    startOfficialMockInterview = asyncHandler(async (req: Request, res: Response) => {
        const user = getAuthUser(req);
        const { careerJourneyId, interviewNumber } = req.body;

        const data = await mockInterviewService.startOfficialMockInterview(
            user.userId,
            careerJourneyId,
            Number(interviewNumber)
        );

        return successResponse({
            res,
            statusCode: HTTP_STATUS.CREATED,
            message: `Official Mock Interview ${interviewNumber} session started successfully.`,
            data,
        });
    });
}


export const mockInterviewController =
    new MockInterviewController();