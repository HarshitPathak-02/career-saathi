import type {
  ClientSession,
  Types,
} from "mongoose";

import {
  AssessmentQuestionModel,
} from "./assessment-question.model.js";
import type {
  AssessmentQuestion,
  AssessmentQuestionDocument,
} from "./assessment-question.model.js";

class AssessmentQuestionRepository {
  async createMany(
    data: Partial<AssessmentQuestion>[],
    session?: ClientSession
  ): Promise<AssessmentQuestionDocument[]> {
    if (data.length === 0) {
      return [];
    }

    return AssessmentQuestionModel.insertMany(
      data,
      {
        session,
      }
    );
  }

  async findByAttempt(
    attemptId: Types.ObjectId,
    session?: ClientSession
  ): Promise<AssessmentQuestionDocument[]> {
    return AssessmentQuestionModel.find({
      attemptId,
    })
      .sort({
        order: 1,
      })
      .session(session ?? null);
  }

  async findByAttemptWithAnswerKey(
    attemptId: Types.ObjectId,
    session?: ClientSession
  ): Promise<AssessmentQuestionDocument[]> {
    return AssessmentQuestionModel.find({
      attemptId,
    })
      .select("+answerKeySnapshot +explanationSnapshot")
      .sort({
        order: 1,
      })
      .session(session ?? null);
  }

  async findById(
    id: Types.ObjectId,
    session?: ClientSession
  ): Promise<AssessmentQuestionDocument | null> {
    return AssessmentQuestionModel.findById(id).session(
      session ?? null
    );
  }
}

export const assessmentQuestionRepository =
  new AssessmentQuestionRepository();
