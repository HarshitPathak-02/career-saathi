import {
  SkillCategory,
  SkillDifficulty,
} from "./skill-catalog.enums.js";

import { SkillCatalogModel } from "./skill-catalog.schema.js";

export const SKILL_CATALOG_SEED = [
  // ==========================
  // Programming
  // ==========================

  {
    name: "JavaScript",
    slug: "javascript",
    category: SkillCategory.PROGRAMMING,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "TypeScript",
    slug: "typescript",
    category: SkillCategory.PROGRAMMING,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  // ==========================
  // Backend
  // ==========================

  {
    name: "Node.js",
    slug: "nodejs",
    category: SkillCategory.BACKEND,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Express.js",
    slug: "expressjs",
    category: SkillCategory.BACKEND,
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
    name: "Error Handling",
    slug: "error-handling",
    category: SkillCategory.BACKEND,
    difficulty: SkillDifficulty.BEGINNER,
  },

  // ==========================
  // Database
  // ==========================

  {
    name: "MongoDB",
    slug: "mongodb",
    category: SkillCategory.DATABASE,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Mongoose",
    slug: "mongoose",
    category: SkillCategory.DATABASE,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  // ==========================
  // Dev Tools
  // ==========================

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
    name: "Postman",
    slug: "postman",
    category: SkillCategory.TESTING,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Deployment",
    slug: "deployment",
    category: SkillCategory.DEPLOYMENT,
    difficulty: SkillDifficulty.ADVANCED,
  },

  {
    name: "API Security",
    slug: "api-security",
    category: SkillCategory.SECURITY,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  // ==========================
  // Computer Science
  // ==========================

  {
    name: "Data Structures",
    slug: "data-structures",
    category: SkillCategory.DATA_STRUCTURES,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Algorithms",
    slug: "algorithms",
    category: SkillCategory.ALGORITHMS,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Object-Oriented Programming",
    slug: "object-oriented-programming",
    category: SkillCategory.OBJECT_ORIENTED_PROGRAMMING,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "DBMS",
    slug: "dbms",
    category: SkillCategory.DBMS,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Operating Systems",
    slug: "operating-systems",
    category: SkillCategory.OPERATING_SYSTEM,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Computer Networks",
    slug: "computer-networks",
    category: SkillCategory.COMPUTER_NETWORKS,
    difficulty: SkillDifficulty.BEGINNER,
  },

  // ==========================
  // Placement Preparation
  // ==========================

  {
    name: "Quantitative Aptitude",
    slug: "quantitative-aptitude",
    category: SkillCategory.APTITUDE,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Logical Reasoning",
    slug: "logical-reasoning",
    category: SkillCategory.LOGICAL_REASONING,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Verbal Ability",
    slug: "verbal-ability",
    category: SkillCategory.VERBAL_ABILITY,
    difficulty: SkillDifficulty.BEGINNER,
  },

  // ==========================
  // Communication
  // ==========================

  {
    name: "English Communication",
    slug: "english-communication",
    category: SkillCategory.ENGLISH_COMMUNICATION,
    difficulty: SkillDifficulty.BEGINNER,
  },

];

export const SKILL_ALIASES: Record<string, string[]> = {
  javascript: ["js", "ecmascript", "es6", "es2015"],

  typescript: ["ts"],

  nodejs: ["node", "node.js", "node js"],

  expressjs: ["express", "express.js", "express js"],

  "rest-api": ["rest", "rest api", "restful api", "restful apis", "rest apis"],

  "jwt-authentication": [
    "jwt",
    "json web token",
    "json web tokens",
    "jwt auth",
  ],

  "error-handling": ["exception handling", "error management"],

  mongodb: ["mongo", "mongo db", "mongodb atlas"],

  mongoose: ["mongoose.js", "mongoose js"],

  git: ["github", "gitlab", "version control", "git version control"],

  docker: ["containerization", "containers", "docker containers"],

  redis: ["redis cache", "redis caching"],

  postman: ["api testing", "postman api testing"],

  deployment: ["deploy", "deployment pipeline", "ci cd", "ci/cd"],

  "api-security": [
    "api security",
    "web security",
    "secure apis",
    "authentication security",
  ],

  "data-structures": [
    "dsa",
    "data structure",
    "data structures and algorithms",
  ],

  algorithms: [
    "algorithm",
    "algorithms and data structures",
    "algorithmic problem solving",
  ],

  "object-oriented-programming": [
    "oop",
    "oops",
    "object oriented programming",
    "object oriented design",
  ],

  dbms: [
    "database management system",
    "database management systems",
    "database concepts",
  ],

  "operating-systems": [
    "operating system",
    "os",
    "os concepts",
  ],

  "computer-networks": [
    "computer network",
    "networking",
    "networking concepts",
    "computer networking",
  ],

  "quantitative-aptitude": ["aptitude", "quantitative aptitude", "quant"],

  "logical-reasoning": ["reasoning", "logical reasoning", "logic"],

  "verbal-ability": ["verbal", "verbal ability", "verbal reasoning"],

  "english-communication": [
    "english",
    "english communication",
    "english proficiency",
    "communication skills",
    "spoken english",
  ],
};

export const seedSkillCatalog = async (): Promise<void> => {
  console.log("Seeding Skill Catalog...");

  for (const skill of SKILL_CATALOG_SEED) {
    await SkillCatalogModel.updateOne(
      { slug: skill.slug },
      {
        $set: {
          ...skill,
          aliases: SKILL_ALIASES[skill.slug] ?? [],
        },
      },
      { upsert: true }
    );
  }

  console.log("✅ Skill Catalog seeded successfully.");
};