import type {
  ClientSession,
  Types,
  UpdateQuery,
} from "mongoose";

import {
  QuestionStatus,
} from "./assessment-engine.enums.js";
import {
  QuestionModel,
} from "./question.model.js";
import type {
  Question,
  QuestionDocument,
} from "./question.model.js";

const SERVABLE_STATUSES = [
  QuestionStatus.AI_VALIDATED,
  QuestionStatus.ADMIN_APPROVED,
];

class QuestionRepository {
  async create(
    data: Partial<Question>,
    session?: ClientSession
  ): Promise<QuestionDocument> {
    const [question] = await QuestionModel.create(
      [data],
      {
        session,
      }
    );

    return question;
  }

  async createMany(
    data: Partial<Question>[],
    session?: ClientSession
  ): Promise<QuestionDocument[]> {
    if (data.length === 0) {
      return [];
    }

    return QuestionModel.insertMany(data, {
      session,
    });
  }

  async findById(
    id: Types.ObjectId,
    session?: ClientSession
  ): Promise<QuestionDocument | null> {
    return QuestionModel.findOne({
      _id: id,
      isDeleted: false,
    }).session(session ?? null);
  }

  async findByIds(
    ids: Types.ObjectId[],
    session?: ClientSession
  ): Promise<QuestionDocument[]> {
    if (ids.length === 0) {
      return [];
    }

    return QuestionModel.find({
      _id: {
        $in: ids,
      },
      isDeleted: false,
    }).session(session ?? null);
  }

  async findByContentHash(
    contentHash: string,
    session?: ClientSession
  ): Promise<QuestionDocument | null> {
    return QuestionModel.findOne({
      contentHash,
      isDeleted: false,
    }).session(session ?? null);
  }

  async findServableBySkill(
    skillCatalogId: Types.ObjectId,
    limit: number,
    session?: ClientSession
  ): Promise<QuestionDocument[]> {
    return QuestionModel.find({
      skillCatalogId,
      status: {
        $in: SERVABLE_STATUSES,
      },
      isDeleted: false,
    })
      .sort({
        usageCount: 1,
        lastServedAt: 1,
        createdAt: 1,
      })
      .limit(limit)
      .session(session ?? null);
  }

  async findBySkillAndStatus(
    skillCatalogId: Types.ObjectId,
    status: QuestionStatus,
    session?: ClientSession
  ): Promise<QuestionDocument[]> {
    return QuestionModel.find({
      skillCatalogId,
      status,
      isDeleted: false,
    })
      .sort({
        createdAt: 1,
      })
      .session(session ?? null);
  }

  async countBySkillAndStatus(
    skillCatalogId: Types.ObjectId,
    status: QuestionStatus,
    session?: ClientSession
  ): Promise<number> {
    return QuestionModel.countDocuments({
      skillCatalogId,
      status,
      isDeleted: false,
    }).session(session ?? null);
  }

  async updateById(
    id: Types.ObjectId,
    update: UpdateQuery<QuestionDocument>,
    session?: ClientSession
  ): Promise<QuestionDocument | null> {
    return QuestionModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      update,
      {
        new: true,
        runValidators: true,
        session,
      }
    );
  }

  async updateStatus(
    id: Types.ObjectId,
    status: QuestionStatus,
    reviewedBy: Types.ObjectId | null,
    reviewNotes: string | null,
    session?: ClientSession
  ): Promise<QuestionDocument | null> {
    return this.updateById(
      id,
      {
        $set: {
          status,
          reviewedBy,
          reviewedAt: new Date(),
          reviewNotes,
        },
      },
      session
    );
  }

  async markServed(
    ids: Types.ObjectId[],
    session?: ClientSession
  ): Promise<void> {
    if (ids.length === 0) {
      return;
    }

    await QuestionModel.updateMany(
      {
        _id: {
          $in: ids,
        },
      },
      {
        $inc: {
          usageCount: 1,
        },
        $set: {
          lastServedAt: new Date(),
        },
      },
      {
        session,
      }
    );
  }

  async findForAdminReview(
    filter: Record<string, unknown>,
    limit: number,
    offset: number,
    session?: ClientSession
  ): Promise<QuestionDocument[]> {
    return QuestionModel.find({
      ...filter,
      isDeleted: false,
    })
      .sort({
        createdAt: 1,
      })
      .skip(offset)
      .limit(limit)
      .session(session ?? null);
  }
}

export const questionRepository =
  new QuestionRepository();
