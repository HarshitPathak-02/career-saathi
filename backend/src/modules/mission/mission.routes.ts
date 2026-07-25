import {
    Router,
} from "express";

import {
    missionController,
} from "./mission.controller.js";

import {
    nextMissionController,
} from "./next-mission.controller.js";

import {
    authenticate,
} from "../../core/middleware/authenticate.middleware.js";

import {
    validateRequest,
} from "../../core/middleware/validate.middleware.js";

import {
    missionCareerJourneyIdParamSchema,
    missionIdParamSchema,
} from "./mission.validator.js";

const missionRouter =
    Router();

/*
|--------------------------------------------------------------------------
| Create Initial Mission
|--------------------------------------------------------------------------
*/

missionRouter.post(
    "/:careerJourneyId",

    authenticate,

    validateRequest({
        params:
            missionCareerJourneyIdParamSchema,
    }),

    missionController
        .createInitialMission
);

/*
|--------------------------------------------------------------------------
| Next Mission
|--------------------------------------------------------------------------
*/

missionRouter.post(
    "/:careerJourneyId/next",

    authenticate,

    validateRequest({
        params:
            missionCareerJourneyIdParamSchema,
    }),

    nextMissionController
        .generateNextMission
);

/*
|--------------------------------------------------------------------------
| Current Mission
|--------------------------------------------------------------------------
*/

missionRouter.get(
    "/career-journey/:careerJourneyId/current",

    authenticate,

    validateRequest({
        params:
            missionCareerJourneyIdParamSchema,
    }),

    missionController
        .getCurrentMission
);

/*
|--------------------------------------------------------------------------
| Latest Mission
|--------------------------------------------------------------------------
*/

missionRouter.get(
    "/career-journey/:careerJourneyId/latest",

    authenticate,

    validateRequest({
        params:
            missionCareerJourneyIdParamSchema,
    }),

    missionController
        .getLatestMission
);

/*
|--------------------------------------------------------------------------
| Mission History
|--------------------------------------------------------------------------
*/

missionRouter.get(
    "/career-journey/:careerJourneyId/history",

    authenticate,

    validateRequest({
        params:
            missionCareerJourneyIdParamSchema,
    }),

    missionController
        .getMissionHistory
);

/*
|--------------------------------------------------------------------------
| Mission By Id
|--------------------------------------------------------------------------
*/

missionRouter.get(
    "/:missionId",

    authenticate,

    validateRequest({
        params:
            missionIdParamSchema,
    }),

    missionController
        .getMission
);

export default missionRouter;