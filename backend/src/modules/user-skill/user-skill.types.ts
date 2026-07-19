import { Types } from "mongoose";

export interface InitializeUserSkillsDto {
    careerJourneyId: Types.ObjectId;

    selectedSkillCatalogIds: Types.ObjectId[];
}

export interface UpdateUserSkillProgressDTO {

    userSkillId: Types.ObjectId;

    currentScore: number;

    lastAssessmentAt: Date;

}