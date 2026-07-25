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
import { missionMapper } from "./mission.mapper.js";
import { dailyTaskService } from "../daily-task/daily-task.service.js";

class MissionController {

    async createInitialMission(
        req: Request,
        res: Response
    ) {

        const user = getAuthUser(req)
        console.log(req.params.careerJourneyId);

        const mission =
            await missionWorkflowService.createInitialMission(
                user.userId,
                new Types.ObjectId(
                    req.params.careerJourneyId as string
                )
            );

        const progress =
            await dailyTaskService.getMissionProgress(
                mission._id
            );

        res.status(201).json(
            missionMapper.toMissionSummaryDto(
                mission,
                progress
            )
        );

    }

    async getMission(
        req: Request,
        res: Response
    ) {

        const mission =
            await missionService.getMission(
                req.params.missionId as string
            );

        if (!mission) {
            return res.status(404).json({
                message: "Mission not found",
            });
        }

        const progress =
            await dailyTaskService.getMissionProgress(
                mission._id
            );

        const currentMissionDay =
            await missionService.getCurrentMissionDay(
                mission._id
            );

        res.status(200).json(
            missionMapper.toMissionDetailsDto(
                mission,
                progress,
                currentMissionDay
            )
        );

    }

    async getCurrentMission(
        req: Request,
        res: Response
    ) {

        const mission =
            await missionService.getActiveMission(
                req.params.careerJourneyId as string
            );

        if (!mission) {
            return res.status(404).json(null);
        }

        const progress =
            await dailyTaskService.getMissionProgress(
                mission._id
            );

        res.status(200).json(
            missionMapper.toMissionSummaryDto(
                mission,
                progress
            )
        );

    }

    async getLatestMission(
        req: Request,
        res: Response
    ) {

        const mission =
            await missionService.getLatestMission(
                req.params.careerJourneyId as string
            );

        if (!mission) {
            return res.status(404).json(null);
        }

        const progress =
            await dailyTaskService.getMissionProgress(
                mission._id
            );

        res.status(200).json(
            missionMapper.toMissionSummaryDto(
                mission,
                progress
            )
        );

    }

    async getMissionHistory(
        req: Request,
        res: Response
    ) {

        const missions =
            await missionService.getMissionHistory(
                req.params.careerJourneyId as string
            );

        const response =
            await Promise.all(
                missions.map(async mission => {

                    const progress =
                        await dailyTaskService.getMissionProgress(
                            mission._id
                        );

                    return missionMapper.toMissionSummaryDto(
                        mission,
                        progress
                    );

                })
            );

        res.status(200).json(response);

    }

}

export const missionController =
    new MissionController();