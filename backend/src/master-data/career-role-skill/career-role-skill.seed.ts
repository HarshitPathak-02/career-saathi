import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { AppError } from "../../core/errors/app-error.js";
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

  // ==================================================
  // React Frontend Developer
  // ==================================================

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "javascript",
    displayOrder: 1,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "typescript",
    displayOrder: 2,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "html",
    displayOrder: 3,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "css",
    displayOrder: 4,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "react",
    displayOrder: 5,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "tailwind-css",
    displayOrder: 6,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "responsive-web-design",
    displayOrder: 7,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "web-accessibility",
    displayOrder: 8,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "rest-api",
    displayOrder: 9,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "git",
    displayOrder: 10,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "github-profile",
    displayOrder: 11,
    priority: SkillPriority.MEDIUM,
    isMandatory: true,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "frontend-testing",
    displayOrder: 12,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "data-structures",
    displayOrder: 13,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "algorithms",
    displayOrder: 14,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "quantitative-aptitude",
    displayOrder: 15,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "logical-reasoning",
    displayOrder: 16,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "verbal-ability",
    displayOrder: 17,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "english-communication",
    displayOrder: 18,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "hr-interview-skills",
    displayOrder: 19,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "resume-writing",
    displayOrder: 20,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  {
    roleSlug: "react-frontend-developer",
    skillSlug: "linkedin-profile",
    displayOrder: 21,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  // ==================================================
  // Data Analyst
  // ==================================================

  {
    roleSlug: "data-analyst",
    skillSlug: "excel",
    displayOrder: 1,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "sql",
    displayOrder: 2,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "python",
    displayOrder: 3,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "pandas",
    displayOrder: 4,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "numpy",
    displayOrder: 5,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "statistics",
    displayOrder: 6,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "data-visualization",
    displayOrder: 7,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "jupyter-notebook",
    displayOrder: 8,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "machine-learning",
    displayOrder: 9,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "dbms",
    displayOrder: 10,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "data-structures",
    displayOrder: 11,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "git",
    displayOrder: 12,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "github-profile",
    displayOrder: 13,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "quantitative-aptitude",
    displayOrder: 14,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "logical-reasoning",
    displayOrder: 15,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "verbal-ability",
    displayOrder: 16,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "english-communication",
    displayOrder: 17,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "hr-interview-skills",
    displayOrder: 18,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "resume-writing",
    displayOrder: 19,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  {
    roleSlug: "data-analyst",
    skillSlug: "linkedin-profile",
    displayOrder: 20,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  // ==================================================
  // UI/UX Designer
  // ==================================================

  {
    roleSlug: "ui-ux-designer",
    skillSlug: "figma",
    displayOrder: 1,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "ui-ux-designer",
    skillSlug: "ui-design",
    displayOrder: 2,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "ui-ux-designer",
    skillSlug: "ux-research",
    displayOrder: 3,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "ui-ux-designer",
    skillSlug: "wireframing",
    displayOrder: 4,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "ui-ux-designer",
    skillSlug: "prototyping",
    displayOrder: 5,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "ui-ux-designer",
    skillSlug: "interaction-design",
    displayOrder: 6,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "ui-ux-designer",
    skillSlug: "design-systems",
    displayOrder: 7,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "ui-ux-designer",
    skillSlug: "web-accessibility",
    displayOrder: 8,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "ui-ux-designer",
    skillSlug: "html",
    displayOrder: 9,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  {
    roleSlug: "ui-ux-designer",
    skillSlug: "css",
    displayOrder: 10,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  {
    roleSlug: "ui-ux-designer",
    skillSlug: "english-communication",
    displayOrder: 11,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "ui-ux-designer",
    skillSlug: "hr-interview-skills",
    displayOrder: 12,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "ui-ux-designer",
    skillSlug: "resume-writing",
    displayOrder: 13,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  {
    roleSlug: "ui-ux-designer",
    skillSlug: "linkedin-profile",
    displayOrder: 14,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  // ==================================================
  // Digital Marketing Specialist
  // ==================================================

  {
    roleSlug: "digital-marketing-specialist",
    skillSlug: "seo",
    displayOrder: 1,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "digital-marketing-specialist",
    skillSlug: "content-marketing",
    displayOrder: 2,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "digital-marketing-specialist",
    skillSlug: "google-analytics",
    displayOrder: 3,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "digital-marketing-specialist",
    skillSlug: "social-media-marketing",
    displayOrder: 4,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "digital-marketing-specialist",
    skillSlug: "email-marketing",
    displayOrder: 5,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "digital-marketing-specialist",
    skillSlug: "copywriting",
    displayOrder: 6,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "digital-marketing-specialist",
    skillSlug: "digital-advertising",
    displayOrder: 7,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "digital-marketing-specialist",
    skillSlug: "excel",
    displayOrder: 8,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "digital-marketing-specialist",
    skillSlug: "quantitative-aptitude",
    displayOrder: 9,
    priority: SkillPriority.MEDIUM,
    isMandatory: false,
  },

  {
    roleSlug: "digital-marketing-specialist",
    skillSlug: "logical-reasoning",
    displayOrder: 10,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  {
    roleSlug: "digital-marketing-specialist",
    skillSlug: "english-communication",
    displayOrder: 11,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "digital-marketing-specialist",
    skillSlug: "hr-interview-skills",
    displayOrder: 12,
    priority: SkillPriority.HIGH,
    isMandatory: true,
  },

  {
    roleSlug: "digital-marketing-specialist",
    skillSlug: "resume-writing",
    displayOrder: 13,
    priority: SkillPriority.LOW,
    isMandatory: false,
  },

  {
    roleSlug: "digital-marketing-specialist",
    skillSlug: "linkedin-profile",
    displayOrder: 14,
    priority: SkillPriority.LOW,
    isMandatory: false,
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
      throw new AppError(HTTP_STATUS.NOT_FOUND, `Career Role '${item.roleSlug}' not found.`);
    }

    const skill = await SkillCatalogModel.findOne({
      slug: item.skillSlug,
      isActive: true,
    });

    if (!skill) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, `Skill '${item.skillSlug}' not found.`);
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