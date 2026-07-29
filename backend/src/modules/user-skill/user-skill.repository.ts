import {
  ClientSession,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
} from "mongoose";
import { SkillLevel, UserSkill, UserSkillDocument, UserSkillModel } from "./index.js";
import { SkillCatalogDocument } from "../../master-data/skill-catalog/index.js";



class UserSkillRepository {

  async create(
    data: Partial<UserSkill>,
    session?: ClientSession
  ): Promise<UserSkillDocument> {

    const [document] =
      await UserSkillModel.create(
        [data],
        {
          session,
        }
      );

    return document;
  }

  async createMany(
    data: Partial<UserSkill>[],
    session?: ClientSession
  ): Promise<UserSkillDocument[]> {

    return UserSkillModel.insertMany(
      data,
      {
        session,
      }
    );
  }

  async findOne(
    filter: Record<string, unknown>,
    projection?: ProjectionType<UserSkill>,
    options?: QueryOptions,
    session?: ClientSession
  ): Promise<UserSkillDocument | null> {

    return UserSkillModel
      .findOne(
        filter,
        projection,
        options
      )
      .session(
        session ?? null
      );
  }

  async findMany(
    filter: Record<string, unknown>,
    projection?: ProjectionType<UserSkill>,
    options?: QueryOptions,
    session?: ClientSession
  ): Promise<UserSkillDocument[]> {

    return UserSkillModel
      .find(
        filter,
        projection,
        options
      )
      .session(
        session ?? null
      );
  }

  async exists(
    filter: Record<string, unknown>,
    session?: ClientSession
  ): Promise<boolean> {

    const document =
      await UserSkillModel
        .exists(filter)
        .session(
          session ?? null
        );

    return Boolean(document);
  }

  async count(
    filter: Record<string, unknown>,
    session?: ClientSession
  ): Promise<number> {

    return UserSkillModel
      .countDocuments(filter)
      .session(
        session ?? null
      );
  }

  async updateOne(
    filter: Record<string, unknown>,
    update: UpdateQuery<UserSkill>,
    session?: ClientSession
  ): Promise<void> {

    await UserSkillModel.updateOne(
      filter,
      update,
      {
        runValidators: true,
        session,
      }
    );
  }

  async updateMany(
    filter: Record<string, unknown>,
    update: UpdateQuery<UserSkill>,
    session?: ClientSession
  ): Promise<void> {

    await UserSkillModel.updateMany(
      filter,
      update,
      {
        runValidators: true,
        session,
      }
    );
  }

  async bulkWrite(
    operations: Parameters<
      typeof UserSkillModel.bulkWrite
    >[0],
    session?: ClientSession
  ): Promise<void> {

    await UserSkillModel.bulkWrite(
      operations,
      {
        session,
      }
    );
  }

  async deleteOne(
    filter: Record<string, unknown>,
    session?: ClientSession
  ): Promise<void> {

    await UserSkillModel.deleteOne(
      filter,
      {
        session,
      }
    );
  }

  async deleteMany(
    filter: Record<string, unknown>,
    session?: ClientSession
  ): Promise<void> {

    await UserSkillModel.deleteMany(
      filter,
      {
        session,
      }
    );
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

  async findByCareerJourneyAndSkillCatalogIds(
    careerJourneyId: Types.ObjectId,
    skillCatalogIds: Types.ObjectId[],
    session?: ClientSession
  ) {

    return UserSkillModel
      .find({
        careerJourneyId,

        skillCatalogId: {
          $in: skillCatalogIds,
        },

        isActive: true,
      })
      .populate<{
        skillCatalogId:
        SkillCatalogDocument;
      }>(
        "skillCatalogId"
      )
      .session(
        session ?? null
      );
  }
}

export const userSkillRepository =
  new UserSkillRepository();