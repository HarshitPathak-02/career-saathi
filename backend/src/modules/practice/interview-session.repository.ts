import type { ClientSession, Types } from "mongoose";

import {
  InterviewSessionModel,
  type InterviewSession,
  type InterviewSessionDocument,
} from "./interview-session.model.js";
import { InterviewSessionStatus } from "./practice.enums.js";

class InterviewSessionRepository {
  async create(
    data: Partial<InterviewSession>,
    session?: ClientSession
  ): Promise<InterviewSessionDocument> {
    const [created] = await InterviewSessionModel.create([data], { session });
    return created;
  }

  async findById(
    id: Types.ObjectId,
    session?: ClientSession
  ): Promise<InterviewSessionDocument | null> {
    return InterviewSessionModel.findById(id).session(session ?? null);
  }

  async findOne(
    filter: Record<string, unknown>,
    session?: ClientSession
  ): Promise<InterviewSessionDocument | null> {
    return InterviewSessionModel.findOne(filter).session(session ?? null);
  }

  async findActiveByUserId(
    userId: Types.ObjectId,
    session?: ClientSession
  ): Promise<InterviewSessionDocument | null> {
    return InterviewSessionModel.findOne({
      userId,
      status: InterviewSessionStatus.IN_PROGRESS,
    })
      .sort({ createdAt: -1 })
      .session(session ?? null);
  }

  async findRecentByUser(
    userId: Types.ObjectId,
    limit = 10,
    session?: ClientSession
  ): Promise<InterviewSessionDocument[]> {
    return InterviewSessionModel.find({
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
  ): Promise<InterviewSessionDocument[]> {
    return InterviewSessionModel.find({
      careerJourneyId,
      optedInToJourney: true,
      status: InterviewSessionStatus.COMPLETED,
      completedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({ completedAt: 1 })
      .session(session ?? null);
  }

  async findOfficialMockSession(
    careerJourneyId: Types.ObjectId,
    mockInterviewNumber: number,
    session?: ClientSession
  ): Promise<InterviewSessionDocument | null> {
    return InterviewSessionModel.findOne({
      careerJourneyId,
      isOfficialReadinessMock: true,
      mockInterviewNumber,
    })
      .sort({ createdAt: -1 })
      .session(session ?? null);
  }

  async findOfficialMockSessions(
    careerJourneyId: Types.ObjectId,
    session?: ClientSession
  ): Promise<InterviewSessionDocument[]> {
    return InterviewSessionModel.find({
      careerJourneyId,
      isOfficialReadinessMock: true,
    })
      .sort({ mockInterviewNumber: 1, createdAt: -1 })
      .session(session ?? null);
  }

  async setOptIn(
    id: Types.ObjectId,
    optedInToJourney: boolean,
    session?: ClientSession
  ): Promise<InterviewSessionDocument | null> {
    return InterviewSessionModel.findByIdAndUpdate(
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
}

export const interviewSessionRepository = new InterviewSessionRepository();
