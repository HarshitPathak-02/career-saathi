export interface CareerRoleSkill {
  skillCode: string;

  recommendedOrder: number;

  required: boolean;

  assessmentRequired: boolean;
}

export interface CareerRole {
  code: string;

  name: string;

  domain: string;

  description: string;

  skills: CareerRoleSkill[];
}