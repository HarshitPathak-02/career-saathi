import type {
  ClientSession,
  Types,
} from "mongoose";

import {
  AssessmentAnswerModel,
} from "./assessment-answer.model.js";
import type {
  AssessmentAnswer,
  AssessmentAnswerDocument,
} from "./assessment-answer.model.js";

class AssessmentAnswerRepository {
  async upsert(
    attemptId: Types.ObjectId,
    assessmentQuestionId: Types.ObjectId,
    data: Partial<AssessmentAnswer>,
    session?: ClientSession
  ): Promise<AssessmentAnswerDocument | null> {
    return AssessmentAnswerModel.findOneAndUpdate(
      {
        attemptId,
        assessmentQuestionId,
      },
      {
        $set: {
          ...data,
          attemptId,
          assessmentQuestionId,
          answeredAt: new Date(),
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

  async findByAttempt(
    attemptId: Types.ObjectId,
    session?: ClientSession
  ): Promise<AssessmentAnswerDocument[]> {
    return AssessmentAnswerModel.find({
      attemptId,
    }).session(session ?? null);
  }

  async updateById(
    id: Types.ObjectId,
    data: Partial<AssessmentAnswer>,
    session?: ClientSession
  ): Promise<AssessmentAnswerDocument | null> {
    return AssessmentAnswerModel.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    );
  }

  async findByQuestion(
    attemptId: Types.ObjectId,
    assessmentQuestionId: Types.ObjectId,
    session?: ClientSession
  ): Promise<AssessmentAnswerDocument | null> {
    return AssessmentAnswerModel.findOne({
      attemptId,
      assessmentQuestionId,
    }).session(session ?? null);
  }
}

export const assessmentAnswerRepository =
  new AssessmentAnswerRepository();
