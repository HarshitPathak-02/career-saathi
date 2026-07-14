import { careerRoles } from '../data/career-role.js';

export function getCareerRoleByCode(
    careerRoleCode: string
) {
    return careerRoles.find(
        role =>
            role.code === careerRoleCode
    );
}

export function isSkillAllowedForCareerRole(
    careerRoleCode: string,
    skillCode: string
): boolean {

    const role =
        getCareerRoleByCode(
            careerRoleCode
        );

    if (!role) {
        return false;
    }

    return role.skills.some(
        skill =>
            skill.skillCode === skillCode
    );
}