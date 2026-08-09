import { SkillCategory, SkillDifficulty } from "../../master-data/skill-catalog/skill-catalog.enums.js";
import { SkillPriority } from "../../master-data/career-role-skill/career-role-skill.enums.js";

export interface DomainIdParamDto {
    domainId: string;
}

export interface RoleIdParamDto {
    roleId: string;
}

export interface CareerDomainLookup {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export interface CareerRoleLookup {
    id: string;
    domainId: string;
    name: string;
    slug: string;
    description: string;
}

export interface CareerRoleSkillLookup {
    skillId: string;
    name: string;
    slug: string;
    category: SkillCategory;
    difficulty: SkillDifficulty;
    displayOrder: number;
    priority: SkillPriority;
    isMandatory: boolean;
}