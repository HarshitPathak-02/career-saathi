import { skills } from '../data/skills.js';

export function getSkillByCode(
    skillCode: string
) {
    return skills.find(
        skill => skill.code === skillCode
    );
}