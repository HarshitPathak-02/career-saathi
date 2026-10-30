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

  // ==========================
  // Frontend
  // ==========================

  {
    name: "HTML",
    slug: "html",
    category: SkillCategory.FRONTEND,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "CSS",
    slug: "css",
    category: SkillCategory.FRONTEND,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "React",
    slug: "react",
    category: SkillCategory.FRONTEND,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Tailwind CSS",
    slug: "tailwind-css",
    category: SkillCategory.FRONTEND,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Responsive Web Design",
    slug: "responsive-web-design",
    category: SkillCategory.FRONTEND,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Web Accessibility",
    slug: "web-accessibility",
    category: SkillCategory.FRONTEND,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Frontend Testing",
    slug: "frontend-testing",
    category: SkillCategory.TESTING,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  // ==========================
  // Data
  // ==========================

  {
    name: "Python",
    slug: "python",
    category: SkillCategory.PROGRAMMING,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "SQL",
    slug: "sql",
    category: SkillCategory.DATABASE,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Excel",
    slug: "excel",
    category: SkillCategory.ANALYTICS,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Pandas",
    slug: "pandas",
    category: SkillCategory.DATA_SCIENCE,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "NumPy",
    slug: "numpy",
    category: SkillCategory.DATA_SCIENCE,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Statistics",
    slug: "statistics",
    category: SkillCategory.DATA_SCIENCE,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Data Visualization",
    slug: "data-visualization",
    category: SkillCategory.DATA_VISUALIZATION,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Machine Learning",
    slug: "machine-learning",
    category: SkillCategory.DATA_SCIENCE,
    difficulty: SkillDifficulty.ADVANCED,
  },

  {
    name: "Jupyter Notebook",
    slug: "jupyter-notebook",
    category: SkillCategory.DATA_SCIENCE,
    difficulty: SkillDifficulty.BEGINNER,
  },

  // ==========================
  // Design
  // ==========================

  {
    name: "Figma",
    slug: "figma",
    category: SkillCategory.DESIGN,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "UI Design",
    slug: "ui-design",
    category: SkillCategory.DESIGN,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "UX Research",
    slug: "ux-research",
    category: SkillCategory.DESIGN,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Wireframing",
    slug: "wireframing",
    category: SkillCategory.DESIGN,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Prototyping",
    slug: "prototyping",
    category: SkillCategory.DESIGN,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Interaction Design",
    slug: "interaction-design",
    category: SkillCategory.DESIGN,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  {
    name: "Design Systems",
    slug: "design-systems",
    category: SkillCategory.DESIGN,
    difficulty: SkillDifficulty.ADVANCED,
  },

  // ==========================
  // Marketing
  // ==========================

  {
    name: "SEO",
    slug: "seo",
    category: SkillCategory.MARKETING,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Content Marketing",
    slug: "content-marketing",
    category: SkillCategory.MARKETING,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Google Analytics",
    slug: "google-analytics",
    category: SkillCategory.ANALYTICS,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Social Media Marketing",
    slug: "social-media-marketing",
    category: SkillCategory.MARKETING,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Email Marketing",
    slug: "email-marketing",
    category: SkillCategory.MARKETING,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Copywriting",
    slug: "copywriting",
    category: SkillCategory.MARKETING,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Digital Advertising",
    slug: "digital-advertising",
    category: SkillCategory.MARKETING,
    difficulty: SkillDifficulty.INTERMEDIATE,
  },

  // ==========================
  // Professional Skills
  // ==========================

  {
    name: "HR Interview Skills",
    slug: "hr-interview-skills",
    category: SkillCategory.HR_INTERVIEW,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "Resume Writing",
    slug: "resume-writing",
    category: SkillCategory.PROFESSIONAL,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "LinkedIn Profile",
    slug: "linkedin-profile",
    category: SkillCategory.PROFESSIONAL,
    difficulty: SkillDifficulty.BEGINNER,
  },

  {
    name: "GitHub Profile",
    slug: "github-profile",
    category: SkillCategory.PROFESSIONAL,
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

  html: ["html5", "hypertext markup language"],

  css: ["css3", "cascading style sheets"],

  react: ["react.js", "reactjs", "react js"],

  "tailwind-css": ["tailwind", "tailwindcss", "tailwind css"],

  "responsive-web-design": [
    "responsive design",
    "responsive web development",
    "mobile responsive design",
  ],

  "web-accessibility": [
    "accessibility",
    "a11y",
    "wcag",
    "accessible web design",
  ],

  "frontend-testing": [
    "front end testing",
    "react testing",
    "jest",
    "vitest",
  ],

  python: ["python3", "python 3"],

  sql: ["mysql", "postgresql", "postgres", "structured query language"],

  excel: ["microsoft excel", "ms excel", "spreadsheets"],

  pandas: ["python pandas"],

  numpy: ["python numpy"],

  statistics: ["statistical analysis", "stats", "probability and statistics"],

  "data-visualization": [
    "data visualisation",
    "data viz",
    "dashboards",
    "charts",
  ],

  "machine-learning": ["ml", "machine learning basics", "predictive modeling"],

  "jupyter-notebook": ["jupyter", "jupyter notebooks", "notebooks"],

  figma: ["figma design"],

  "ui-design": ["ui", "user interface design", "visual design"],

  "ux-research": ["ux", "user research", "user experience research"],

  wireframing: ["wireframes", "wireframe"],

  prototyping: ["prototype", "interactive prototypes"],

  "interaction-design": ["ixd", "interaction designer"],

  "design-systems": ["design system", "component libraries"],

  seo: ["search engine optimization", "search engine optimisation"],

  "content-marketing": ["content strategy", "content creation"],

  "google-analytics": ["ga4", "google analytics 4", "web analytics"],

  "social-media-marketing": [
    "social media",
    "social media marketing",
    "smm",
  ],

  "email-marketing": ["email campaigns", "newsletter marketing"],

  copywriting: ["copy writing", "ad copy", "content writing"],

  "digital-advertising": [
    "digital ads",
    "paid advertising",
    "google ads",
    "meta ads",
  ],

  "hr-interview-skills": [
    "hr interview",
    "hr round",
    "behavioral interview",
    "interview preparation",
  ],

  "resume-writing": ["resume", "cv", "cv writing", "resume building"],

  "linkedin-profile": [
    "linkedin",
    "linkedin optimization",
    "linkedin profile optimization",
  ],

  "github-profile": [
    "github portfolio",
    "github profile optimization",
    "developer portfolio",
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