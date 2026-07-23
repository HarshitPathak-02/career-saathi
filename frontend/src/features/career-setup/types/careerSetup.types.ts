// features/career-setup/types/careerSetup.types.ts

import type { CareerJourneyStatus, PreferredLanguage } from "../constants/enums";

export interface CareerDomain {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface CareerRole {
  id: string;
  domainId: string;
  name: string;
  slug: string;
  description?: string;
}

export interface CareerRoleSkill {
  skillId: string;
  name: string;
  slug: string;
  category: string;
  difficulty: string;
  displayOrder: number;
  priority: number;
  isMandatory: boolean;
}

export interface CreateCareerJourneyRequest {
  domainId: string;
  roleId: string;
  targetCompany?: string;
  targetDurationMonths: number;
  dailyStudyHours: number;
  preferredLanguage: PreferredLanguage;
}

export interface CareerJourney {
  id: string;
  userId: string;
  domainId: string;
  roleId: string;
  targetCompany?: string;
  targetDurationMonths: number;
  dailyStudyHours: number;
  preferredLanguage: PreferredLanguage;
  status: CareerJourneyStatus;
  createdAt: string;
  updatedAt: string;
}