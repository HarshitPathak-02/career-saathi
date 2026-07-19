import {
  ClientSession,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
} from "mongoose";

import {
  UserSkill,
  UserSkillDocument,
  UserSkillModel,
} from "./user-skill.schema.js";
import { SkillLevel } from "./user-skill.enums.js";

class UserSkillRepository {
  async create(
    data: Partial<UserSkill>,
    session?: ClientSession
  ): Promise<UserSkillDocument> {
    return UserSkillModel.create([data], { session }).then(
      ([document]) => document
    );
  }

  async createMany(
    data: Partial<UserSkill>[],
    session?: ClientSession
  ): Promise<UserSkillDocument[]> {
    return UserSkillModel.insertMany(data, { session });
  }

  async findOne(
    filter: Record<string, unknown>,
    projection?: ProjectionType<UserSkill>,
    options?: QueryOptions
  ): Promise<UserSkillDocument | null> {
    return UserSkillModel.findOne(filter, projection, options);
  }

  async findMany(
    filter: Record<string, unknown>,
    projection?: ProjectionType<UserSkill>,
    options?: QueryOptions
  ): Promise<UserSkillDocument[]> {
    return UserSkillModel.find(filter, projection, options);
  }

  async exists(
    filter: Record<string, unknown>
  ): Promise<boolean> {
    const document = await UserSkillModel.exists(filter);

    return !!document;
  }

  async count(
    filter: Record<string, unknown>
  ): Promise<number> {
    return UserSkillModel.countDocuments(filter);
  }

  async updateOne(
    filter: Record<string, unknown>,
    update: UpdateQuery<UserSkill>,
    session?: ClientSession
  ): Promise<void> {
    await UserSkillModel.updateOne(filter, update, { session });
  }

  async updateMany(
    filter: Record<string, unknown>,
    update: UpdateQuery<UserSkill>,
    session?: ClientSession
  ): Promise<void> {
    await UserSkillModel.updateMany(filter, update, { session });
  }

  async bulkWrite(
    operations: any[],
    session?: ClientSession
  ): Promise<void> {
    await UserSkillModel.bulkWrite(operations, {
      session,
    });
  }

  async deleteOne(
    filter: Record<string, unknown>,
    session?: ClientSession
  ): Promise<void> {
    await UserSkillModel.deleteOne(filter, {
      session,
    });
  }

  async deleteMany(
    filter: Record<string, unknown>,
    session?: ClientSession
  ): Promise<void> {
    await UserSkillModel.deleteMany(filter, {
      session,
    });
  }

  async softDelete(
    filter: Record<string, unknown>,
    session?: ClientSession
  ): Promise<void> {
    await UserSkillModel.updateMany(
      filter,
      {
        $set: {
          isActive: false,
        },
      },
      {
        session,
      }
    );
  }

  async updateProgress(
    id: Types.ObjectId,
    currentScore: number,
    currentLevel: SkillLevel,
    lastAssessmentAt: Date,
    session?: ClientSession
  ): Promise<UserSkillDocument | null> {

    return UserSkillModel.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
      },
      {
        $set: {
          currentScore,
          currentLevel,
          lastAssessmentAt,
        },
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

  }
}

export const userSkillRepository =
  new UserSkillRepository();