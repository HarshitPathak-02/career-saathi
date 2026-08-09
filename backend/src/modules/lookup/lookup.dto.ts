import {
    SkillCategory,
    SkillDifficulty,
} from "../../master-data/skill-catalog/skill-catalog.enums.js";

import { SkillPriority } from "../../master-data/career-role-skill/career-role-skill.enums.js";

export interface CareerDomainResponseDto {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export interface CareerRoleResponseDto {
    id: string;
    domainId: string;
    name: string;
    slug: string;
    description: string;
}

export interface CareerRoleSkillResponseDto {
    skillId: string;
    name: string;
    slug: string;
    category: SkillCategory;
    difficulty: SkillDifficulty;
    displayOrder: number;
    priority: SkillPriority;
    isMandatory: boolean;
}