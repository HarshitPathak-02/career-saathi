import { AppError } from "../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { SkillCatalogModel } from "../skill-catalog/skill-catalog.schema.js";
import { SkillTopicModel } from "./skill-topic.schema.js";

const SKILL_TOPICS: Record<string, string[]> = {
  javascript: [
    "Fundamentals",
    "Functions and Scope",
    "Async JavaScript",
    "ES Modules",
  ],

  typescript: [
    "Type System",
    "Generics",
    "Narrowing",
    "Utility Types",
  ],

  nodejs: [
    "Event Loop",
    "Async Patterns",
    "Streams and Buffers",
    "Error Handling",
  ],

  expressjs: [
    "Routing",
    "Middleware",
    "Error Middleware",
    "Validation",
  ],

  "rest-api": [
    "HTTP Semantics",
    "Resource Design",
    "Status Codes",
    "Versioning",
  ],

  "jwt-authentication": [
    "Token Structure",
    "Signing and Verification",
    "Refresh Tokens",
    "Security Pitfalls",
  ],

  "error-handling": [
    "Error Types",
    "Propagation",
    "Centralized Handling",
    "Recovery",
  ],

  mongodb: [
    "Documents and Collections",
    "Query Operators",
    "Indexes",
    "Aggregation",
  ],

  mongoose: [
    "Schemas and Models",
    "Validation",
    "Population",
    "Middleware",
  ],

  git: [
    "Commits and History",
    "Branching",
    "Merging and Rebasing",
    "Conflict Resolution",
  ],

  docker: [
    "Images and Containers",
    "Dockerfiles",
    "Volumes and Networks",
    "Compose",
  ],

  redis: [
    "Data Structures",
    "Caching Patterns",
    "Expiration",
    "Persistence",
  ],

  postman: [
    "Collections",
    "Environments",
    "Test Scripts",
    "Mock Servers",
  ],

  deployment: [
    "Build Artifacts",
    "Environment Configuration",
    "Process Management",
    "Rollbacks",
  ],

  "api-security": [
    "Authentication",
    "Authorization",
    "Input Validation",
    "Rate Limiting",
  ],

  "data-structures": [
    "Arrays and Strings",
    "Hash Maps",
    "Trees",
    "Graphs",
  ],

  algorithms: [
    "Complexity Analysis",
    "Sorting and Searching",
    "Recursion",
    "Dynamic Programming",
  ],

  "object-oriented-programming": [
    "Classes and Objects",
    "Inheritance",
    "Polymorphism",
    "Encapsulation",
  ],

  dbms: [
    "Relational Model",
    "SQL Queries",
    "Normalization",
    "Transactions",
  ],

  "operating-systems": [
    "Processes and Threads",
    "Memory Management",
    "Scheduling",
    "File Systems",
  ],

  "computer-networks": [
    "OSI Model",
    "TCP and UDP",
    "HTTP",
    "DNS",
  ],

  "quantitative-aptitude": [
    "Percentages",
    "Ratios",
    "Time and Work",
    "Probability",
  ],

  "logical-reasoning": [
    "Series",
    "Puzzles",
    "Syllogisms",
    "Data Sufficiency",
  ],

  "verbal-ability": [
    "Reading Comprehension",
    "Grammar",
    "Vocabulary",
    "Sentence Correction",
  ],

  "english-communication": [
    "Professional Writing",
    "Speaking",
    "Active Listening",
    "Email Etiquette",
  ],

  html: [
    "Document Structure",
    "Forms",
    "Semantic HTML",
    "Accessibility",
  ],

  css: [
    "Layout",
    "Flexbox and Grid",
    "Responsive Design",
    "Selectors",
  ],

  react: [
    "Components",
    "State and Props",
    "Hooks",
    "Rendering and Keys",
  ],

  "tailwind-css": [
    "Utility Classes",
    "Responsive Variants",
    "Component Patterns",
    "Configuration",
  ],

  "responsive-web-design": [
    "Breakpoints",
    "Fluid Layouts",
    "Mobile First",
    "Media Queries",
  ],

  "web-accessibility": [
    "ARIA",
    "Keyboard Navigation",
    "Color Contrast",
    "Screen Readers",
  ],

  "frontend-testing": [
    "Unit Testing",
    "Component Testing",
    "Mocking",
    "End-to-End Testing",
  ],

  python: [
    "Syntax and Types",
    "Functions",
    "Data Structures",
    "Modules",
  ],

  sql: [
    "Select Queries",
    "Joins",
    "Aggregation",
    "Subqueries",
  ],

  excel: [
    "Formulas",
    "Functions",
    "Pivot Tables",
    "Charts",
  ],

  pandas: [
    "Series and DataFrames",
    "Indexing",
    "Cleaning",
    "Grouping",
  ],

  numpy: [
    "Arrays",
    "Broadcasting",
    "Vectorized Operations",
    "Linear Algebra",
  ],

  statistics: [
    "Descriptive Statistics",
    "Probability",
    "Hypothesis Testing",
    "Regression",
  ],

  "data-visualization": [
    "Chart Selection",
    "Encoding",
    "Dashboards",
    "Storytelling",
  ],

  "machine-learning": [
    "Supervised Learning",
    "Model Evaluation",
    "Feature Engineering",
    "Overfitting",
  ],

  "jupyter-notebook": [
    "Cells",
    "Kernels",
    "Data Exploration",
    "Reproducibility",
  ],

  figma: [
    "Frames and Layout",
    "Components",
    "Prototyping",
    "Handoff",
  ],

  "ui-design": [
    "Typography",
    "Color",
    "Layout",
    "Visual Hierarchy",
  ],

  "ux-research": [
    "Research Methods",
    "Interviews",
    "Usability Testing",
    "Synthesis",
  ],

  wireframing: [
    "Low-Fidelity Layouts",
    "Information Architecture",
    "Flow Mapping",
    "Annotation",
  ],

  prototyping: [
    "Interaction Flows",
    "Prototype Fidelity",
    "Testing",
    "Iteration",
  ],

  "interaction-design": [
    "States and Feedback",
    "Microinteractions",
    "Navigation",
    "Accessibility",
  ],

  "design-systems": [
    "Tokens",
    "Components",
    "Documentation",
    "Governance",
  ],

  seo: [
    "Keywords",
    "On-Page SEO",
    "Technical SEO",
    "Link Building",
  ],

  "content-marketing": [
    "Content Strategy",
    "Audience Research",
    "Distribution",
    "Measurement",
  ],

  "google-analytics": [
    "Events",
    "Reports",
    "Audiences",
    "Attribution",
  ],

  "social-media-marketing": [
    "Platform Strategy",
    "Content Calendar",
    "Community",
    "Paid Social",
  ],

  "email-marketing": [
    "List Building",
    "Campaign Design",
    "Automation",
    "Deliverability",
  ],

  copywriting: [
    "Headlines",
    "Persuasion",
    "Calls to Action",
    "Editing",
  ],

  "digital-advertising": [
    "Campaign Structure",
    "Targeting",
    "Bidding",
    "Measurement",
  ],

  "hr-interview-skills": [
    "Behavioral Questions",
    "STAR Method",
    "Communication",
    "Follow-Up",
  ],

  "resume-writing": [
    "Structure",
    "Impact Statements",
    "Tailoring",
    "Formatting",
  ],

  "linkedin-profile": [
    "Headline",
    "About Section",
    "Experience",
    "Networking",
  ],

  "github-profile": [
    "README",
    "Repositories",
    "Contribution History",
    "Portfolio",
  ],
};

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const seedSkillTopics = async (): Promise<void> => {
  console.log("Seeding Skill Topics...");

  for (const [skillSlug, topics] of Object.entries(SKILL_TOPICS)) {
    const skill = await SkillCatalogModel.findOne({
      slug: skillSlug,
      isActive: true,
    });

    if (!skill) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        `Skill '${skillSlug}' not found.`
      );
    }

    for (const [index, topicName] of topics.entries()) {
      const slug = toSlug(topicName);

      await SkillTopicModel.updateOne(
        {
          skillCatalogId: skill._id,
          slug,
        },
        {
          $set: {
            skillCatalogId: skill._id,
            name: topicName,
            slug,
            displayOrder: index + 1,
            isActive: true,
          },
        },
        {
          upsert: true,
        }
      );
    }
  }

  console.log("Skill Topics seeded successfully.");
};
