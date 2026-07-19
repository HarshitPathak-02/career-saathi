import {
    Router,
} from "express";

import {
    missionController,
} from "./mission.controller.js";

const missionRouter =
    Router();

missionRouter.post(
    "/",
    missionController.createInitialMission
);

missionRouter.get(
    "/:missionId",
    missionController.getMission
);

missionRouter.get(
    "/career-journey/:careerJourneyId/current",
    missionController.getCurrentMission
);

missionRouter.get(
    "/career-journey/:careerJourneyId/latest",
    missionController.getLatestMission
);

missionRouter.get(
    "/career-journey/:careerJourneyId/history",
    missionController.getMissionHistory
);

// missionRouter.patch(
//     "/:missionId/start",
//     missionController.startMission
// );

// missionRouter.patch(
//     "/:missionId/complete",
//     missionController.completeMission
// );

// missionRouter.patch(
//     "/:missionId/skip",
//     missionController.skipMission
// );

export default missionRouter;