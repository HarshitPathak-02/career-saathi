import { getSkillByCode } from '../../shared/utils/skill.util.js';
import { UserSkillDocument, UserSkillResponse } from './skill.types.js';

export function toUserSkillResponse(
    skill: UserSkillDocument
): UserSkillResponse {

    const skillInfo =
        getSkillByCode(skill.skillCode);

    return {

        id: skill.id,

        skill: {

            code: skill.skillCode,

            name:
                skillInfo?.name ??
                skill.skillCode,

            category:
                skillInfo?.category ??
                'Unknown',

            description:
                skillInfo?.description ??
                '',
        },

        declaredLevel:
            skill.declaredLevel,

        assessmentLevel:
            skill.assessmentLevel,

        source:
            skill.source,

        verified:
            skill.verified,

        createdAt:
            skill.createdAt,

        updatedAt:
            skill.updatedAt,
    };
}