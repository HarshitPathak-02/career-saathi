import {
  SkillCategory,
  SkillDifficulty,
} from "./skill-catalog.enums.js";

export const SKILL_CATALOG_SEED = [
  {
    name: "JavaScript",
    slug: "javascript",
    category: SkillCategory.PROGRAMMING_LANGUAGE,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "TypeScript",
    slug: "typescript",
    category: SkillCategory.PROGRAMMING_LANGUAGE,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Node.js",
    slug: "nodejs",
    category: SkillCategory.RUNTIME,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Express.js",
    slug: "expressjs",
    category: SkillCategory.FRAMEWORK,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "MongoDB",
    slug: "mongodb",
    category: SkillCategory.DATABASE,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Mongoose",
    slug: "mongoose",
    category: SkillCategory.ODM,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "REST API",
    slug: "rest-api",
    category: SkillCategory.API,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "JWT Authentication",
    slug: "jwt-authentication",
    category: SkillCategory.AUTHENTICATION,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Git",
    slug: "git",
    category: SkillCategory.VERSION_CONTROL,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Docker",
    slug: "docker",
    category: SkillCategory.CONTAINERIZATION,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Redis",
    slug: "redis",
    category: SkillCategory.CACHING,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Error Handling",
    slug: "error-handling",
    category: SkillCategory.CONCEPT,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "API Security",
    slug: "api-security",
    category: SkillCategory.SECURITY,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Deployment",
    slug: "deployment",
    category: SkillCategory.DEPLOYMENT,
    difficulty: SkillDifficulty.ADVANCED,
  },

  {
    name: "Postman",
    slug: "postman",
    category: SkillCategory.TESTING,
    difficulty: SkillDifficulty.BEGINNER,
  },
];