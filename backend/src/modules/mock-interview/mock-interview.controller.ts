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
}


export const mockInterviewController =
    new MockInterviewController();