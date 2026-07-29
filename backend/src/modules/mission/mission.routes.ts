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

missionRouter.use(
    authenticate
);

missionRouter.post(
    "/:careerJourneyId",

    validateRequest({
        params:
            missionCareerJourneyIdParamSchema,
    }),

    missionController
        .createInitialMission
);

missionRouter.post(
    "/:careerJourneyId/next",

    validateRequest({
        params:
            missionCareerJourneyIdParamSchema,
    }),

    nextMissionController
        .generateNextMission
);

missionRouter.get(
    "/career-journey/:careerJourneyId/current",

    validateRequest({
        params:
            missionCareerJourneyIdParamSchema,
    }),

    missionController
        .getCurrentMission
);

missionRouter.get(
    "/career-journey/:careerJourneyId/latest",

    validateRequest({
        params:
            missionCareerJourneyIdParamSchema,
    }),

    missionController
        .getLatestMission
);

missionRouter.get(
    "/career-journey/:careerJourneyId/history",

    validateRequest({
        params:
            missionCareerJourneyIdParamSchema,
    }),

    missionController
        .getMissionHistory
);

missionRouter.get(
    "/:missionId",

    validateRequest({
        params:
            missionIdParamSchema,
    }),

    missionController
        .getMission
);

export default missionRouter;