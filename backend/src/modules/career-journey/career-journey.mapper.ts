import { Types } from "mongoose";
import { CareerJourneyStatus, CreateCareerJourneyDto, CreateCareerJourneyInput, UpdateCareerJourneyDto, UpdateCareerJourneyInput } from "./index.js";



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

    return updateData;
  }
}