import {
    Request,
    Response,
} from "express";

import { Types } from "mongoose";

import {
    missionService,
} from "./mission.service.js";

import {
    missionWorkflowService,
} from "./mission.workflow.js";
import { getAuthUser } from "../../shared/utils/get-auth-user.js";

class MissionController {

    async createInitialMission(
        req: Request,
        res: Response
    ) {

        const user = getAuthUser(req)

        const mission =
            await missionWorkflowService.createInitialMission(

                user.userId,

                new Types.ObjectId(
                    req.params.careerJourneyId as string
                )

            );

        res.status(201).json(mission);

    }

    async getMission(
        req: Request,
        res: Response
    ) {

        const mission =
            await missionService.getMission(
                req.params.missionId as string
            );

        res.status(200).json(mission);

    }

    async getCurrentMission(
        req: Request,
        res: Response
    ) {

        const mission =
            await missionService.getActiveMission(
                req.params.careerJourneyId as string
            );

        res.status(200).json(mission);

    }

    async getLatestMission(
        req: Request,
        res: Response
    ) {

        const mission =
            await missionService.getLatestMission(
                req.params.careerJourneyId as string
            );

        res.status(200).json(mission);

    }

    async getMissionHistory(
        req: Request,
        res: Response
    ) {

        const missions =
            await missionService.getMissionHistory(
                req.params.careerJourneyId as string
            );

        res.status(200).json(missions);

    }

}

export const missionController =
    new MissionController();