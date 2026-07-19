import {
    Request,
    Response,
    NextFunction,
} from "express";

import { Types } from "mongoose";

import { roadmapService } from "./roadmap.service.js";
import { roadmapWorkflowService } from "./roadmap-workflow.service.js";
import { roadmapResponseMapper } from "./roadmap-response.mapper.js";
import { AppError } from "../../core/errors/app-error.js";

class RoadmapController {

    async generateRoadmap(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const {
                careerJourneyId,
            } = req.body;

            const roadmap =
                await roadmapWorkflowService.generateRoadmap(
                    new Types.ObjectId(
                        careerJourneyId
                    )
                );

            res.status(201).json(
                roadmapResponseMapper.toGenerateRoadmapResponse(
                    roadmap
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async getRoadmap(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const roadmap =
                await roadmapService.getRoadmapByCareerJourney(
                    req.params.careerJourneyId as string
                );

            if (!roadmap) {
                throw new AppError(404, "Roadmap not found.");
            }

            res.json(
                roadmapResponseMapper.toRoadmapResponse(
                    roadmap
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async getRoadmapItems(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const roadmapItems =
                await roadmapService.getRoadmapItems(
                    req.params.roadmapId as string
                );

            res.json(
                roadmapResponseMapper.toRoadmapItemsResponse(
                    roadmapItems
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async getNextPendingItems(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const limit =
                Number(req.query.limit) || 5;

            const roadmapItems =
                await roadmapService.getNextPendingItems(
                    new Types.ObjectId(
                        req.params.roadmapId as string
                    ),
                    limit
                );

            res.json(
                roadmapResponseMapper.toRoadmapItemsResponse(
                    roadmapItems
                )
            );

        } catch (error) {

            next(error);

        }

    }

}

export const roadmapController =
    new RoadmapController();