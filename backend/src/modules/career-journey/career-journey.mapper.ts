import { Types } from "mongoose";

import {
  CreateCareerJourneyDto,
  UpdateCareerJourneyDto,
} from "./career-journey.types.js";

import {
  CareerJourneyStatus,
} from "./career-journey.enums.js";

import {
  CreateCareerJourneyInput,
  UpdateCareerJourneyInput,
} from "./career-journey.types.js";

export class CareerJourneyMapper {
  static toCreateInput(
    userId: Types.ObjectId,
    dto: CreateCareerJourneyDto
  ): CreateCareerJourneyInput {
    return {
      userId,

      domainId: new Types.ObjectId(dto.domainId),

      roleId: new Types.ObjectId(dto.roleId),

      targetCompany: dto.targetCompany,

      targetDurationMonths: dto.targetDurationMonths,

      dailyStudyHours: dto.dailyStudyHours,

      preferredLanguage: dto.preferredLanguage,

      resumeId: dto.resumeId
        ? new Types.ObjectId(dto.resumeId)
        : null,

      skills: dto.skills.map((skill) => ({
        skillId: new Types.ObjectId(skill.skillId),
        source: skill.source,
        confidence: skill.confidence,
        verified: skill.verified ?? false,
      })),

      customSkills: dto.customSkills,

      status: CareerJourneyStatus.DRAFT,
    };
  }

  static toUpdateInput(
    dto: UpdateCareerJourneyDto
  ): UpdateCareerJourneyInput {
    const updateData: UpdateCareerJourneyInput = {};

    if (dto.domainId !== undefined) {
      updateData.domainId = new Types.ObjectId(dto.domainId);
    }

    if (dto.roleId !== undefined) {
      updateData.roleId = new Types.ObjectId(dto.roleId);
    }

    if (dto.targetCompany !== undefined) {
      updateData.targetCompany = dto.targetCompany;
    }

    if (dto.targetDurationMonths !== undefined) {
      updateData.targetDurationMonths = dto.targetDurationMonths;
    }

    if (dto.dailyStudyHours !== undefined) {
      updateData.dailyStudyHours = dto.dailyStudyHours;
    }

    if (dto.preferredLanguage !== undefined) {
      updateData.preferredLanguage = dto.preferredLanguage;
    }

    if (dto.resumeId !== undefined) {
      updateData.resumeId = dto.resumeId
        ? new Types.ObjectId(dto.resumeId)
        : null;
    }

    if (dto.skills !== undefined) {
      updateData.skills = dto.skills.map((skill) => ({
        skillId: new Types.ObjectId(skill.skillId),
        source: skill.source,
        confidence: skill.confidence,
        verified: skill.verified ?? false,
      }));
    }

    if (dto.customSkills !== undefined) {
      updateData.customSkills = dto.customSkills;
    }
    return updateData;
  }
}