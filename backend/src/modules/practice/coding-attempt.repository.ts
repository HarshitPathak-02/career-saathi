import type {
  ClientSession,
  Types,
} from "mongoose";

import {
  CodingAttemptModel,
} from "./coding-attempt.model.js";
import type {
  CodingAttempt,
  CodingAttemptDocument,
} from "./coding-attempt.model.js";
import type { CodingEvaluation } from "./practice.types.js";
import { CodingAttemptStatus } from "./practice.enums.js";

class CodingAttemptRepository {
  async create(
    data: Partial<CodingAttempt>,
    session?: ClientSession
  ): Promise<CodingAttemptDocument> {
    const [attempt] = await CodingAttemptModel.create([data], {
      session,
    });
    return attempt;
  }

  async findById(
    id: Types.ObjectId,
    session?: ClientSession
  ): Promise<CodingAttemptDocument | null> {
    return CodingAttemptModel.findById(id).session(session ?? null);
  }

  async findLatestByUserAndChallenge(
    userId: Types.ObjectId,
    challengeId: Types.ObjectId,
    session?: ClientSession
  ): Promise<CodingAttemptDocument | null> {
    return CodingAttemptModel.findOne({
      userId,
      challengeId,
    })
      .sort({ createdAt: -1 })
      .session(session ?? null);
  }

  async findRecentByUser(
    userId: Types.ObjectId,
    limit = 10,
    session?: ClientSession
  ): Promise<CodingAttemptDocument[]> {
    return CodingAttemptModel.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .session(session ?? null);
  }

  async findOptedInByJourneyAndDateRange(
    careerJourneyId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    session?: ClientSession
  ): Promise<CodingAttemptDocument[]> {
    return CodingAttemptModel.find({
      careerJourneyId,
      optedInToJourney: true,
      status: CodingAttemptStatus.EVALUATED,
      evaluatedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({ evaluatedAt: 1 })
      .session(session ?? null);
  }

  async setOptIn(
    id: Types.ObjectId,
    optedInToJourney: boolean,
    session?: ClientSession
  ): Promise<CodingAttemptDocument | null> {
    return CodingAttemptModel.findByIdAndUpdate(
      id,
      {
        $set: {
          optedInToJourney,
        },
      },
      {
        returnDocument: "after",
        session,
      }
    );
  }

  async updateEvaluation(
    id: Types.ObjectId,
    evaluation: CodingEvaluation,
    evaluatedAt: Date,
    session?: ClientSession
  ): Promise<CodingAttemptDocument | null> {
    return CodingAttemptModel.findByIdAndUpdate(
      id,
      {
        $set: {
          evaluation,
          status: CodingAttemptStatus.EVALUATED,
          evaluatedAt,
        },
      },
      {
        returnDocument: "after",
        session,
      }
    );
  }
}

export const codingAttemptRepository = new CodingAttemptRepository();
