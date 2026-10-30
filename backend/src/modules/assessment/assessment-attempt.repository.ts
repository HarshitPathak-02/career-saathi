import type {
  ClientSession,
  Types,
  UpdateQuery,
} from "mongoose";

import {
  AssessmentAttemptStatus,
} from "./assessment-engine.enums.js";
import {
  AssessmentAttemptModel,
} from "./assessment-attempt.model.js";
import type {
  AssessmentAttempt,
  AssessmentAttemptDocument,
} from "./assessment-attempt.model.js";

class AssessmentAttemptRepository {
  async create(
    data: Partial<AssessmentAttempt>,
    session?: ClientSession
  ): Promise<AssessmentAttemptDocument> {
    const [attempt] =
      await AssessmentAttemptModel.create(
        [data],
        {
          session,
        }
      );

    return attempt;
  }

  async findById(
    id: Types.ObjectId,
    session?: ClientSession
  ): Promise<AssessmentAttemptDocument | null> {
    return AssessmentAttemptModel.findById(id).session(
      session ?? null
    );
  }

  async findInProgressBySection(
    sectionId: Types.ObjectId,
    session?: ClientSession
  ): Promise<AssessmentAttemptDocument | null> {
    return AssessmentAttemptModel.findOne({
      sectionId,
      status:
        AssessmentAttemptStatus.IN_PROGRESS,
    }).session(session ?? null);
  }

  async findLatestBySection(
    sectionId: Types.ObjectId,
    session?: ClientSession
  ): Promise<AssessmentAttemptDocument | null> {
    return AssessmentAttemptModel.findOne({
      sectionId,
    })
      .sort({
        attemptNumber: -1,
      })
      .session(session ?? null);
  }

  async findBySection(
    sectionId: Types.ObjectId,
    session?: ClientSession
  ): Promise<AssessmentAttemptDocument[]> {
    return AssessmentAttemptModel.find({
      sectionId,
    })
      .sort({
        attemptNumber: 1,
      })
      .session(session ?? null);
  }

  async countBySection(
    sectionId: Types.ObjectId,
    session?: ClientSession
  ): Promise<number> {
    return AssessmentAttemptModel.countDocuments({
      sectionId,
    }).session(session ?? null);
  }

  async updateById(
    id: Types.ObjectId,
    update: UpdateQuery<AssessmentAttemptDocument>,
    session?: ClientSession
  ): Promise<AssessmentAttemptDocument | null> {
    return AssessmentAttemptModel.findByIdAndUpdate(
      id,
      update,
      {
        new: true,
        runValidators: true,
        session,
      }
    );
  }

  async expireInProgress(
    sectionId: Types.ObjectId,
    now: Date,
    session?: ClientSession
  ): Promise<void> {
    await AssessmentAttemptModel.updateMany(
      {
        sectionId,
        status:
          AssessmentAttemptStatus.IN_PROGRESS,
        expiresAt: {
          $lte: now,
        },
      },
      {
        $set: {
          status:
            AssessmentAttemptStatus.EXPIRED,
        },
      },
      {
        session,
      }
    );
  }
}

export const assessmentAttemptRepository =
  new AssessmentAttemptRepository();
