import {
    Types,
} from "mongoose";

import {
    UserSkillDocument,
} from "./user-skill.model.js";

import {
    SkillCatalogDocument,
} from "../../master-data/skill-catalog/skill-catalog.schema.js";

export interface InitializeUserSkillsDto {

    careerJourneyId:
    Types.ObjectId;

    selectedSkillCatalogIds:
    Types.ObjectId[];
}

export interface UpdateUserSkillProgressDTO {

    userSkillId:
    Types.ObjectId;

    currentScore:
    number;

    lastAssessmentAt:
    Date;
}

export type PopulatedUserSkill =
    Omit<
        UserSkillDocument,
        "skillCatalogId"
    > & {

        skillCatalogId:
        SkillCatalogDocument;
    };