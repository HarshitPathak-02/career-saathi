import { ClientSession } from 'mongoose';

import {
    CreateRoadmapData,
    RoadmapDocument,
    UpdateRoadmapData,
} from './roadmap.types.js';

import { RoadmapModel } from './roadmap.model.js';

import {
    RoadmapStatus,
} from './roadmap.enums.js';

class RoadmapRepository {

    async create(
        data: CreateRoadmapData,
        session?: ClientSession
    ): Promise<RoadmapDocument> {

        if (session) {

            const [roadmap] =
                await RoadmapModel.create(
                    [data],
                    { session }
                );

            return roadmap;
        }

        return RoadmapModel.create(data);
    }

    async findById(
        id: string,
        session?: ClientSession
    ): Promise<RoadmapDocument | null> {

        const query =
            RoadmapModel.findById(id);

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findLatestByJourneyId(
        careerJourneyId: string,
        session?: ClientSession
    ): Promise<RoadmapDocument | null> {

        const query =
            RoadmapModel.findOne({

                careerJourneyId,

            }).sort({

                version: -1,

            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findActiveByJourneyId(
        careerJourneyId: string,
        session?: ClientSession
    ): Promise<RoadmapDocument | null> {

        const query =
            RoadmapModel.findOne({

                careerJourneyId,

                status:
                    RoadmapStatus.ACTIVE,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findByJourneyId(
        careerJourneyId: string,
        session?: ClientSession
    ): Promise<RoadmapDocument[]> {

        const query =
            RoadmapModel.find({

                careerJourneyId,

            }).sort({

                version: -1,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async updateById(
        id: string,
        data: UpdateRoadmapData,
        session?: ClientSession
    ): Promise<RoadmapDocument | null> {

        return RoadmapModel.findByIdAndUpdate(

            id,

            data,

            {

                new: true,

                runValidators: true,

                session,
            }
        );
    }

    async archiveActiveRoadmaps(
        careerJourneyId: string,
        session?: ClientSession
    ) {

        return RoadmapModel.updateMany(

            {

                careerJourneyId,

                status:
                    RoadmapStatus.ACTIVE,
            },

            {

                status:
                    RoadmapStatus.ARCHIVED,
            },

            {

                session,
            }
        );
    }

    async deleteById(
        id: string,
        session?: ClientSession
    ) {

        return RoadmapModel.findByIdAndDelete(
            id,
            {
                session,
            }
        );
    }
}

export const roadmapRepository =
    new RoadmapRepository();