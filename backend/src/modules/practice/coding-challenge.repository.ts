import type {
  ClientSession,
  Types,
} from "mongoose";

import {
  CodingChallengeModel,
} from "./coding-challenge.model.js";
import type {
  CodingChallenge,
  CodingChallengeDocument,
} from "./coding-challenge.model.js";

class CodingChallengeRepository {
  async create(
    data: Partial<CodingChallenge>,
    session?: ClientSession
  ): Promise<CodingChallengeDocument> {
    const [challenge] = await CodingChallengeModel.create([data], {
      session,
    });
    return challenge;
  }

  async findBySlug(
    slug: string,
    session?: ClientSession
  ): Promise<CodingChallengeDocument | null> {
    return CodingChallengeModel.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
    }).session(session ?? null);
  }

  async findById(
    id: Types.ObjectId,
    session?: ClientSession
  ): Promise<CodingChallengeDocument | null> {
    return CodingChallengeModel.findOne({
      _id: id,
      isActive: true,
    }).session(session ?? null);
  }

  async findByIds(
    ids: Types.ObjectId[],
    session?: ClientSession
  ): Promise<CodingChallengeDocument[]> {
    if (ids.length === 0) {
      return [];
    }

    return CodingChallengeModel.find({
      _id: { $in: ids },
      isActive: true,
    }).session(session ?? null);
  }

  async findBySkillCatalogIds(
    skillCatalogIds: Types.ObjectId[],
    session?: ClientSession
  ): Promise<CodingChallengeDocument[]> {
    if (skillCatalogIds.length === 0) {
      return [];
    }

    return CodingChallengeModel.find({
      skillCatalogId: { $in: skillCatalogIds },
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .session(session ?? null);
  }

  async findByTopicId(
    topicId: Types.ObjectId,
    session?: ClientSession
  ): Promise<CodingChallengeDocument[]> {
    return CodingChallengeModel.find({
      topicId,
      isActive: true,
    })
      .sort({ difficulty: 1, createdAt: 1 })
      .session(session ?? null);
  }

  async countBySkillCatalogId(
    skillCatalogId: Types.ObjectId,
    session?: ClientSession
  ): Promise<number> {
    return CodingChallengeModel.countDocuments({
      skillCatalogId,
      isActive: true,
    }).session(session ?? null);
  }
}

export const codingChallengeRepository = new CodingChallengeRepository();
