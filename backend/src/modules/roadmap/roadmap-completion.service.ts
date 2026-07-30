import {
    ClientSession,
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";

import {
    careerJourneyRepository,
    CareerJourneyStatus,
} from "../career-journey/index.js";

import {
    roadmapItemRepository,
} from "./roadmap-item.repository.js";

import {
    roadmapRepository,
} from "./roadmap.repository.js";

import {
    RoadmapStatus,
} from "./roadmap.enums.js";


class RoadmapCompletionService {

    async syncRoadmapCompletion(
        roadmapId: Types.ObjectId,
        session?: ClientSession
    ): Promise<void> {

        /*
        |--------------------------------------------------------------------------
        | Fetch Roadmap
        |--------------------------------------------------------------------------
        */

        const roadmap =
            await roadmapRepository
                .findById(
                    roadmapId,
                    session
                );

        if (!roadmap) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Roadmap not found."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Count Completed Items
        |--------------------------------------------------------------------------
        */

        const completedItems =
            await roadmapItemRepository
                .countCompleted(
                    roadmapId,
                    session
                );

        /*
        |--------------------------------------------------------------------------
        | Sync Roadmap Progress
        |--------------------------------------------------------------------------
        */

        await roadmapRepository
            .updateCompletedItems(
                roadmapId,
                completedItems,
                session
            );

        /*
        |--------------------------------------------------------------------------
        | Roadmap Is Not Finished Yet
        |--------------------------------------------------------------------------
        */

        if (
            roadmap.totalItems === 0 ||
            completedItems !==
            roadmap.totalItems
        ) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Prevent Reprocessing
        |--------------------------------------------------------------------------
        */

        if (
            roadmap.status ===
            RoadmapStatus.COMPLETED
        ) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Complete Roadmap
        |--------------------------------------------------------------------------
        */

        const completedRoadmap =
            await roadmapRepository
                .updateStatus(
                    roadmapId,
                    RoadmapStatus.COMPLETED,
                    session
                );

        if (!completedRoadmap) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Roadmap not found."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Move Career Journey To Readiness
        |--------------------------------------------------------------------------
        */

        const careerJourney =
            await careerJourneyRepository
                .updateStatusById(
                    roadmap.careerJourneyId,
                    CareerJourneyStatus.READINESS,
                    session
                );

        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }
    }
}


export const roadmapCompletionService =
    new RoadmapCompletionService();