import {
    CareerDomainDocument,
} from "../../master-data/career-domain/career-domain.schema.js";

import {
    CareerRoleDocument,
} from "../../master-data/career-role/career-role.schema.js";

import {
    CareerDomainResponseDto,
    CareerRoleResponseDto,
    CareerRoleSkillResponseDto,
} from "./lookup.dto.js";

import {
    CareerRoleSkillLookup,
} from "./lookup.types.js";

export const toCareerDomainDto = (
    domain: CareerDomainDocument
): CareerDomainResponseDto => ({
    id: domain._id.toString(),
    name: domain.name,
    slug: domain.slug,
    description: domain.description,
});

export const toCareerRoleDto = (
    role: CareerRoleDocument
): CareerRoleResponseDto => ({
    id: role._id.toString(),
    domainId: role.domainId.toString(),
    name: role.name,
    slug: role.slug,
    description: role.description,
});

export const toCareerRoleSkillDto = (
    skill: CareerRoleSkillLookup
): CareerRoleSkillResponseDto => ({
    skillId: skill.skillId,
    name: skill.name,
    slug: skill.slug,
    category: skill.category,
    difficulty: skill.difficulty,
    displayOrder: skill.displayOrder,
    priority: skill.priority,
    isMandatory: skill.isMandatory,
});