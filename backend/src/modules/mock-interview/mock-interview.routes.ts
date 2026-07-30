import {
    Router,
} from "express";

import {
    mockInterviewController,
} from "./mock-interview.controller.js";

import {
    createMockInterviewSchema,
    mockInterviewHistoryParamSchema,
} from "./mock-interview.validation.js";

import {
    authenticate,
} from "../../core/middleware/authenticate.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";


const router =
    Router();


/*
|--------------------------------------------------------------------------
| Create Mock Interview
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    validateRequest(
        { body: createMockInterviewSchema }
    ),
    mockInterviewController
        .createMockInterview
);


/*
|--------------------------------------------------------------------------
| Get Mock Interview History
|--------------------------------------------------------------------------
*/

router.get(
    "/career-journeys/:careerJourneyId",
    authenticate,
    validateRequest(
        { params: mockInterviewHistoryParamSchema }
    ),
    mockInterviewController
        .getMockInterviewHistory
);


export default router;