import { CareerRoleModel } from "../career-role/career-role.schema.js";
import { SkillCatalogModel } from "../skill-catalog/skill-catalog.schema.js";
import { SkillPriority } from "./career-role-skill.enums.js";
import { CareerRoleSkillModel } from "./career-role-skill.schema.js";

export const CAREER_ROLE_SKILL_SEED = [
  // ==================================================
  // Programming
  // ==================================================

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "javascript",
    displayOrder: 1,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "typescript",
    displayOrder: 2,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  // ==================================================
  // Backend
  // ==================================================

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "nodejs",
    displayOrder: 3,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "expressjs",
    displayOrder: 4,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "rest-api",
    displayOrder: 5,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "jwt-authentication",
    displayOrder: 6,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "error-handling",
    displayOrder: 7,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "api-security",
    displayOrder: 8,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  // ==================================================
  // Database
  // ==================================================

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "mongodb",
    displayOrder: 9,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "mongoose",
    displayOrder: 10,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  // ==================================================
  // Development Tools
  // ==================================================

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "git",
    displayOrder: 11,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "postman",
    displayOrder: 12,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "docker",
    displayOrder: 13,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "redis",
    displayOrder: 14,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "deployment",
    displayOrder: 15,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  // ==================================================
  // Computer Science Fundamentals
  // ==================================================

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "data-structures",
    displayOrder: 16,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "algorithms",
    displayOrder: 17,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "object-oriented-programming",
    displayOrder: 18,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "dbms",
    displayOrder: 19,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "operating-systems",
    displayOrder: 20,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "computer-networks",
    displayOrder: 21,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  // ==================================================
  // Placement Preparation
  // ==================================================

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "quantitative-aptitude",
    displayOrder: 22,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "logical-reasoning",
    displayOrder: 23,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "verbal-ability",
    displayOrder: 24,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  // ==================================================
  // Communication
  // ==================================================

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "english-communication",
    displayOrder: 25,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "hr-interview-skills",
    displayOrder: 26,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  // ==================================================
  // Professional Skills
  // ==================================================

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "resume-writing",
    displayOrder: 27,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "linkedin-profile",
    displayOrder: 28,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  {
    roleSlug: "nodejs-backend-developer",
    skillSlug: "github-profile",
    displayOrder: 29,
    priority: SkillPriority.MEDIUM,
    isMandatory: true,
  },
];

export const seedCareerRoleSkills = async (): Promise<void> => {
  console.log("🌱 Seeding Career Role Skills...");

  for (const item of CAREER_ROLE_SKILL_SEED) {
    const role = await CareerRoleModel.findOne({
      slug: item.roleSlug,
      isActive: true,
    });

    if (!role) {
      throw new Error(`Career Role '${item.roleSlug}' not found.`);
    }

    const skill = await SkillCatalogModel.findOne({
      slug: item.skillSlug,
      isActive: true,
    });

    if (!skill) {
      throw new Error(`Skill '${item.skillSlug}' not found.`);
    }

    const { roleSlug, skillSlug, ...seedData } = item;

    await CareerRoleSkillModel.updateOne(
      {
        roleId: role._id,
        skillId: skill._id,
      },
      {
        $set: {
          roleId: role._id,
          skillId: skill._id,
          ...seedData,
        },
      },
      {
        upsert: true,
      }
    );
  }

  console.log("✅ Career Role Skills seeded successfully.");
};