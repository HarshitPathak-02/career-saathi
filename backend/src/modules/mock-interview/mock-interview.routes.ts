import {
    Router,
} from "express";

import {
    mockInterviewController,
} from "./mock-interview.controller.js";

import {
    createMockInterviewSchema,
    mockInterviewHistoryParamSchema,
    getReadinessBatteryQuerySchema,
    startOfficialMockInterviewSchema,
} from "./mock-interview.validation.js";

import {
    authenticate,
} from "../../core/middleware/authenticate.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { interviewSessionStartLimiter } from "../../core/middleware/rate-limit.middleware.js";


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

router.get(
    "/readiness-battery",
    authenticate,
    validateRequest({
        query: getReadinessBatteryQuerySchema,
    }),
    mockInterviewController.getReadinessBattery
);

router.post(
    "/start-official",
    authenticate,
    interviewSessionStartLimiter,
    validateRequest({
        body: startOfficialMockInterviewSchema,
    }),
    mockInterviewController.startOfficialMockInterview
);

export default router;