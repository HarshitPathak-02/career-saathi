import type {
  ClientSession,
  Types,
  UpdateQuery,
} from "mongoose";

import {
  AssessmentSectionStatus,
} from "./assessment-engine.enums.js";
import {
  AssessmentSectionModel,
} from "./assessment-section.model.js";
import type {
  AssessmentSection,
  AssessmentSectionDocument,
} from "./assessment-section.model.js";

class AssessmentSectionRepository {
  async createMany(
    data: Partial<AssessmentSection>[],
    session?: ClientSession
  ): Promise<AssessmentSectionDocument[]> {
    if (data.length === 0) {
      return [];
    }

    return AssessmentSectionModel.insertMany(
      data,
      {
        session,
      }
    );
  }

  async findById(
    id: Types.ObjectId,
    session?: ClientSession
  ): Promise<AssessmentSectionDocument | null> {
    return AssessmentSectionModel.findById(id).session(
      session ?? null
    );
  }

  async findByAssessment(
    assessmentId: Types.ObjectId,
    session?: ClientSession
  ): Promise<AssessmentSectionDocument[]> {
    return AssessmentSectionModel.find({
      assessmentId,
    })
      .sort({
        displayOrder: 1,
      })
      .session(session ?? null);
  }

  async findByAssessmentAndSkill(
    assessmentId: Types.ObjectId,
    skillCatalogId: Types.ObjectId,
    session?: ClientSession
  ): Promise<AssessmentSectionDocument | null> {
    return AssessmentSectionModel.findOne({
      assessmentId,
      skillCatalogId,
    }).session(session ?? null);
  }

  async updateById(
    id: Types.ObjectId,
    update: UpdateQuery<AssessmentSectionDocument>,
    session?: ClientSession
  ): Promise<AssessmentSectionDocument | null> {
    return AssessmentSectionModel.findByIdAndUpdate(
      id,
      update,
      {
        new: true,
        runValidators: true,
        session,
      }
    );
  }

  async countCompleted(
    assessmentId: Types.ObjectId,
    session?: ClientSession
  ): Promise<number> {
    return AssessmentSectionModel.countDocuments({
      assessmentId,
      status:
        AssessmentSectionStatus.COMPLETED,
    }).session(session ?? null);
  }
}

export const assessmentSectionRepository =
  new AssessmentSectionRepository();
