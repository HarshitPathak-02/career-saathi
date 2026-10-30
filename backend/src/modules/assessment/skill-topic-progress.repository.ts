import type {
  ClientSession,
  Types,
} from "mongoose";

import {
  SkillTopicProgressModel,
} from "./skill-topic-progress.model.js";
import type {
  SkillTopicProgress,
  SkillTopicProgressDocument,
} from "./skill-topic-progress.model.js";

class SkillTopicProgressRepository {
  async upsert(
    careerJourneyId: Types.ObjectId,
    skillCatalogId: Types.ObjectId,
    topicId: Types.ObjectId,
    data: Partial<SkillTopicProgress>,
    session?: ClientSession
  ): Promise<SkillTopicProgressDocument | null> {
    return SkillTopicProgressModel.findOneAndUpdate(
      {
        careerJourneyId,
        skillCatalogId,
        topicId,
      },
      {
        $set: {
          ...data,
          careerJourneyId,
          skillCatalogId,
          topicId,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        session,
      }
    );
  }

  async findOneByTopic(
    careerJourneyId: Types.ObjectId,
    skillCatalogId: Types.ObjectId,
    topicId: Types.ObjectId,
    session?: ClientSession
  ): Promise<SkillTopicProgressDocument | null> {
    return SkillTopicProgressModel.findOne({
      careerJourneyId,
      skillCatalogId,
      topicId,
    }).session(session ?? null);
  }

  async findByJourney(
    careerJourneyId: Types.ObjectId,
    session?: ClientSession
  ): Promise<SkillTopicProgressDocument[]> {
    return SkillTopicProgressModel.find({
      careerJourneyId,
    })
      .sort({
        skillCatalogId: 1,
        masteryScore: 1,
      })
      .session(session ?? null);
  }

  async findWeakTopics(
    careerJourneyId: Types.ObjectId,
    threshold: number,
    minimumQuestions: number,
    session?: ClientSession
  ): Promise<SkillTopicProgressDocument[]> {
    return SkillTopicProgressModel.find({
      careerJourneyId,
      masteryScore: {
        $lt: threshold,
      },
      questionsAnswered: {
        $gte: minimumQuestions,
      },
    })
      .sort({
        masteryScore: 1,
      })
      .session(session ?? null);
  }
}

export const skillTopicProgressRepository =
  new SkillTopicProgressRepository();
