import type {
  ClientSession,
  Types,
} from "mongoose";

import {
  SkillEvidenceSource,
} from "./assessment-engine.enums.js";
import {
  SkillEvidenceModel,
} from "./skill-evidence.model.js";
import type {
  SkillEvidence,
  SkillEvidenceDocument,
} from "./skill-evidence.model.js";

class SkillEvidenceRepository {
  async create(
    data: Partial<SkillEvidence>,
    session?: ClientSession
  ): Promise<SkillEvidenceDocument> {
    const [evidence] = await SkillEvidenceModel.create(
      [data],
      {
        session,
      }
    );

    return evidence;
  }

  async createMany(
    data: Partial<SkillEvidence>[],
    session?: ClientSession
  ): Promise<SkillEvidenceDocument[]> {
    if (data.length === 0) {
      return [];
    }

    return SkillEvidenceModel.insertMany(data, {
      session,
    });
  }

  async findScoringByJourney(
    careerJourneyId: Types.ObjectId,
    session?: ClientSession
  ): Promise<SkillEvidenceDocument[]> {
    return SkillEvidenceModel.find({
      careerJourneyId,
      scoringEligible: true,
    })
      .sort({
        observedAt: -1,
      })
      .session(session ?? null);
  }

  async findResumeEvidenceBySkill(
    userId: Types.ObjectId,
    skillCatalogId: Types.ObjectId,
    session?: ClientSession
  ): Promise<SkillEvidenceDocument[]> {
    return SkillEvidenceModel.find({
      userId,
      skillCatalogId,
      source: SkillEvidenceSource.RESUME,
    })
      .sort({
        observedAt: -1,
      })
      .session(session ?? null);
  }
}

export const skillEvidenceRepository =
  new SkillEvidenceRepository();
