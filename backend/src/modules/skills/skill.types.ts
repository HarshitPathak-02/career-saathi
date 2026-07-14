import { HydratedDocument, Types } from 'mongoose';

import {
  UserSkillLevel,
  UserSkillSource,
} from './skill.enums.js';
import { ProficiencyLevel } from '../../shared/enums/proficiency-level.enum.js';

export interface IUserSkill {
  userId: Types.ObjectId;

  careerJourneyId: Types.ObjectId;

  skillCode: string;

  declaredLevel: ProficiencyLevel;

  assessmentLevel?: ProficiencyLevel;

  source: UserSkillSource;

  verified: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export type UserSkillDocument =
  HydratedDocument<IUserSkill>;

export interface CreateUserSkillData {
  userId: Types.ObjectId;

  careerJourneyId: Types.ObjectId;

  skillCode: string;

  declaredLevel: ProficiencyLevel;

  source: UserSkillSource;

  verified: boolean;
}

export interface UpdateUserSkillData
  extends Partial<
    Omit<
      CreateUserSkillData,
      'userId' | 'careerJourneyId'
    >
  > {
  assessmentLevel?: ProficiencyLevel;
}

export interface UserSkillResponse {
  id: string;

  skill: {
    code: string;

    name: string;

    category: string;

    description: string;
  };

  declaredLevel: ProficiencyLevel;

  assessmentLevel?: ProficiencyLevel;

  source: UserSkillSource;

  verified: boolean;

  createdAt: Date;

  updatedAt: Date;
}