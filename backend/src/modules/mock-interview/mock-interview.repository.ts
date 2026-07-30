import {
    ClientSession,
    Types,
} from "mongoose";

import {
    MockInterviewDocument,
    MockInterviewModel,
} from "./mock-interview.model.js";

import {
    CreateMockInterviewInput,
} from "./mock-interview.types.js";
import { MockInterviewStatus } from "./mock-interview.enums.js";


class MockInterviewRepository {

    /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

    async create(
        data:
            CreateMockInterviewInput,

        session?:
            ClientSession
    ): Promise<
        MockInterviewDocument
    > {

        const [mockInterview] =
            await MockInterviewModel
                .create(
                    [data],
                    {
                        session,
                    }
                );

        return mockInterview;
    }


    /*
    |--------------------------------------------------------------------------
    | Find By Id
    |--------------------------------------------------------------------------
    */

    async findById(
        id:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<
        MockInterviewDocument | null
    > {

        return MockInterviewModel
            .findById(id)
            .session(
                session ?? null
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Find By Career Journey
    |--------------------------------------------------------------------------
    */

    async findByCareerJourney(
        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<
        MockInterviewDocument[]
    > {

        return MockInterviewModel
            .find({
                careerJourneyId,
            })
            .sort({
                interviewNumber: 1,
            })
            .session(
                session ?? null
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Find Latest
    |--------------------------------------------------------------------------
    */

    async findLatest(
        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<
        MockInterviewDocument | null
    > {

        return MockInterviewModel
            .findOne({
                careerJourneyId,
            })
            .sort({
                interviewNumber: -1,
            })
            .session(
                session ?? null
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Count
    |--------------------------------------------------------------------------
    */

    async countByCareerJourney(
        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<number> {

        return MockInterviewModel
            .countDocuments({
                careerJourneyId,
            })
            .session(
                session ?? null
            );
    }

    async findByIdAndCareerJourney(
        id: Types.ObjectId,
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ): Promise<MockInterviewDocument | null> {

        return MockInterviewModel
            .findOne({
                _id: id,
                careerJourneyId,
            })
            .session(
                session ?? null
            );
    }

    async findRecentCompletedByCareerJourney(
        careerJourneyId:
            Types.ObjectId,

        limit:
            number,

        session?:
            ClientSession
    ): Promise<MockInterviewDocument[]> {

        return MockInterviewModel
            .find({
                careerJourneyId,

                status:
                    MockInterviewStatus.COMPLETED,
            })
            .sort({
                interviewedAt: -1,
            })
            .limit(limit)
            .session(
                session ?? null
            );
    }
}


export const mockInterviewRepository =
    new MockInterviewRepository();