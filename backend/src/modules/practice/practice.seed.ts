import { SkillCatalogModel } from "../../master-data/skill-catalog/skill-catalog.schema.js";
import { SkillTopicModel } from "../../master-data/skill-topic/skill-topic.schema.js";
import { CodingChallengeModel } from "./coding-challenge.model.js";
import { ChallengeDifficulty, ChallengeSource } from "./practice.enums.js";

interface ChallengeSeedData {
  title: string;
  slug: string;
  skillSlug: string;
  topicSlug: string;
  roleSlugs: string[];
  difficulty: ChallengeDifficulty;
  estimatedMinutes: number;
  description: string;
  starterCode: string;
  solutionCode: string;
  testCases: Array<{
    id: string;
    name: string;
    inputCode: string;
    expectedOutput: string;
    isHidden?: boolean;
    explanation?: string;
  }>;
}

const SEEDED_CHALLENGES: ChallengeSeedData[] = [
  {
    title: "Safe Async Handler for Express Routes",
    slug: "safe-async-handler",
    skillSlug: "nodejs",
    topicSlug: "error-handling",
    roleSlugs: ["nodejs-backend-developer"],
    difficulty: ChallengeDifficulty.EASY,
    estimatedMinutes: 15,
    description: `## Problem: Safe Async Handler

In Express.js, unhandled promise rejections inside asynchronous route handlers can cause unhandled exceptions or leave client requests hanging indefinitely.

### Task
Implement an \`asyncHandler\` higher-order function that:
1. Accepts an asynchronous route handler function \`fn(req, res, next)\`.
2. Returns a standard Express middleware function \`(req, res, next)\`.
3. Calls \`fn(req, res, next)\` and automatically catches any rejected promises, forwarding the error to Express's \`next(error)\` function.

### Example
\`\`\`js
const handler = asyncHandler(async (req, res, next) => {
  throw new Error("Database failed");
});
// When invoked, next is called with Error("Database failed")
\`\`\`
`,
    starterCode: `/**
 * Wraps an async route handler to catch errors and forward to next()
 * @param {Function} fn - Async handler (req, res, next) => Promise<any>
 * @returns {Function} Express middleware (req, res, next) => void
 */
function asyncHandler(fn) {
  return function(req, res, next) {
    // TODO: Implement wrapper
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
`,
    solutionCode: `function asyncHandler(fn) {
  return function(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}`,
    testCases: [
      {
        id: "tc-1",
        name: "Catches thrown error and calls next(err)",
        inputCode: `let caught = null;
const next = (err) => { caught = err?.message; };
const wrapped = asyncHandler(async () => { throw new Error("Fault"); });
wrapped({}, {}, next);
return caught;`,
        expectedOutput: `"Fault"`,
        explanation: "Handler should forward thrown errors to next callback",
      },
      {
        id: "tc-2",
        name: "Catches rejected promise and calls next(err)",
        inputCode: `let caught = null;
const next = (err) => { caught = err; };
const wrapped = asyncHandler(() => Promise.reject("Rejected"));
wrapped({}, {}, next);
return caught;`,
        expectedOutput: `"Rejected"`,
        explanation: "Handler should forward promise rejections to next callback",
      },
      {
        id: "tc-3",
        name: "Does not call next with error when resolved successfully",
        inputCode: `let nextCalled = false;
const next = () => { nextCalled = true; };
const wrapped = asyncHandler(async (req, res) => { return "OK"; });
wrapped({}, {}, next);
return nextCalled;`,
        expectedOutput: `false`,
        explanation: "Successful async completion should not trigger error next()",
      },
    ],
  },

  {
    title: "Async Retry with Exponential Backoff",
    slug: "async-retry-exponential-backoff",
    skillSlug: "nodejs",
    topicSlug: "async-patterns",
    roleSlugs: ["nodejs-backend-developer"],
    difficulty: ChallengeDifficulty.MEDIUM,
    estimatedMinutes: 25,
    description: `## Problem: Async Retry with Exponential Backoff

Distributed backend services frequently encounter transient network errors or temporary service outages.

### Task
Implement an asynchronous function \`retryWithBackoff(fn, maxRetries, baseDelayMs)\` that:
1. Executes the provided asynchronous function \`fn()\`.
2. If \`fn()\` resolves, returns its result immediately.
3. If \`fn()\` rejects, retries up to \`maxRetries\` times.
4. Pauses for \`baseDelayMs * Math.pow(2, attempt - 1)\` milliseconds between retries (e.g. 1st retry: 1x, 2nd: 2x, 3rd: 4x).
5. If all retries fail, throws the last encountered error.

### Constraints
- \`maxRetries >= 0\`
- If \`maxRetries === 0\`, runs once and throws on error without retry.
`,
    starterCode: `/**
 * Retries an async function with exponential backoff
 * @param {Function} fn - Asynchronous function returning a Promise
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelayMs - Base delay in milliseconds
 * @returns {Promise<any>}
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelayMs = 10) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= maxRetries) {
        throw err;
      }
      attempt++;
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
`,
    solutionCode: `async function retryWithBackoff(fn, maxRetries = 3, baseDelayMs = 10) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= maxRetries) {
        throw err;
      }
      attempt++;
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}`,
    testCases: [
      {
        id: "tc-1",
        name: "Returns value immediately on first attempt success",
        inputCode: `const res = await retryWithBackoff(async () => "Success", 3, 5);
return res;`,
        expectedOutput: `"Success"`,
      },
      {
        id: "tc-2",
        name: "Succeeds on 2nd retry after initial failure",
        inputCode: `let calls = 0;
const res = await retryWithBackoff(async () => {
  calls++;
  if (calls < 2) throw new Error("Transient");
  return "Recovered";
}, 3, 5);
return { res, calls };`,
        expectedOutput: `{"res":"Recovered","calls":2}`,
      },
      {
        id: "tc-3",
        name: "Throws final error if retries are exhausted",
        inputCode: `let errMessage = null;
try {
  await retryWithBackoff(async () => { throw new Error("Permanent"); }, 2, 5);
} catch (e) {
  errMessage = e.message;
}
return errMessage;`,
        expectedOutput: `"Permanent"`,
      },
    ],
  },

  {
    title: "Concurrent Promise Pool Limiter",
    slug: "concurrent-promise-pool",
    skillSlug: "javascript",
    topicSlug: "async-javascript",
    roleSlugs: ["nodejs-backend-developer", "react-frontend-developer"],
    difficulty: ChallengeDifficulty.MEDIUM,
    estimatedMinutes: 25,
    description: `## Problem: Concurrent Promise Pool Limiter

Running hundreds of asynchronous tasks simultaneously can exhaust database connection pools or trigger API rate limits.

### Task
Implement an asynchronous function \`asyncPool(concurrencyLimit, items, asyncFn)\` that:
1. Executes \`asyncFn(item)\` for each item in the \`items\` array.
2. Ensures no more than \`concurrencyLimit\` promises are pending at any given time.
3. Returns an array of results matching the exact order of the original \`items\` array.
`,
    starterCode: `/**
 * Processes items with bounded concurrency
 * @param {number} concurrencyLimit - Max concurrent promises
 * @param {Array} items - Input items array
 * @param {Function} asyncFn - Async mapping function
 * @returns {Promise<Array>}
 */
async function asyncPool(concurrencyLimit, items, asyncFn) {
  const results = new Array(items.length);
  const executing = new Set();
  
  for (let i = 0; i < items.length; i++) {
    const p = Promise.resolve().then(() => asyncFn(items[i])).then((res) => {
      results[i] = res;
      executing.delete(p);
    });
    executing.add(p);
    if (executing.size >= concurrencyLimit) {
      await Promise.race(executing);
    }
  }
  await Promise.all(executing);
  return results;
}
`,
    solutionCode: `async function asyncPool(concurrencyLimit, items, asyncFn) {
  const results = new Array(items.length);
  const executing = new Set();
  
  for (let i = 0; i < items.length; i++) {
    const p = Promise.resolve().then(() => asyncFn(items[i])).then((res) => {
      results[i] = res;
      executing.delete(p);
    });
    executing.add(p);
    if (executing.size >= concurrencyLimit) {
      await Promise.race(executing);
    }
  }
  await Promise.all(executing);
  return results;
}`,
    testCases: [
      {
        id: "tc-1",
        name: "Maintains original item order in output array",
        inputCode: `const items = [30, 10, 20];
const results = await asyncPool(2, items, async (ms) => {
  await new Promise(r => setTimeout(r, ms));
  return ms * 2;
});
return results;`,
        expectedOutput: `[60,20,40]`,
      },
      {
        id: "tc-2",
        name: "Limits active concurrent executions to pool size",
        inputCode: `let active = 0;
let maxSeen = 0;
await asyncPool(2, [1, 2, 3, 4], async (val) => {
  active++;
  maxSeen = Math.max(maxSeen, active);
  await new Promise(r => setTimeout(r, 10));
  active--;
  return val;
});
return maxSeen <= 2;`,
        expectedOutput: `true`,
      },
    ],
  },

  {
    title: "Deep Object Property Flattener",
    slug: "deep-object-flattener",
    skillSlug: "javascript",
    topicSlug: "fundamentals",
    roleSlugs: ["nodejs-backend-developer", "react-frontend-developer"],
    difficulty: ChallengeDifficulty.EASY,
    estimatedMinutes: 20,
    description: `## Problem: Deep Object Flattener

Given a nested JavaScript object, flatten it into a single-level object where keys represent dot-notated paths.

### Example
\`\`\`js
flattenObject({ user: { address: { city: "Delhi" } } })
// Returns: { "user.address.city": "Delhi" }
\`\`\`
`,
    starterCode: `/**
 * Flattens a nested object into dot-separated keys
 * @param {Object} obj - Nested object
 * @returns {Object} Single-level flattened object
 */
function flattenObject(obj, prefix = "", result = {}) {
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const newKey = prefix ? \`\${prefix}.\${key}\` : key;
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      flattenObject(val, newKey, result);
    } else {
      result[newKey] = val;
    }
  }
  return result;
}
`,
    solutionCode: `function flattenObject(obj, prefix = "", result = {}) {
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const newKey = prefix ? \`\${prefix}.\${key}\` : key;
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      flattenObject(val, newKey, result);
    } else {
      result[newKey] = val;
    }
  }
  return result;
}`,
    testCases: [
      {
        id: "tc-1",
        name: "Flattens two-level nested object",
        inputCode: `return flattenObject({ a: { b: 1, c: 2 } });`,
        expectedOutput: `{"a.b":1,"a.c":2}`,
      },
      {
        id: "tc-2",
        name: "Handles primitive root values and deep objects",
        inputCode: `return flattenObject({ name: "CareerSaathi", config: { db: { port: 27018 } } });`,
        expectedOutput: `{"name":"CareerSaathi","config.db.port":27018}`,
      },
    ],
  },

  {
    title: "Immutable State Updater Logic",
    slug: "immutable-state-updater",
    skillSlug: "react",
    topicSlug: "state-and-props",
    roleSlugs: ["react-frontend-developer"],
    difficulty: ChallengeDifficulty.MEDIUM,
    estimatedMinutes: 20,
    description: `## Problem: Immutable State Updater

In React, mutating state objects directly leads to missing re-renders and unexpected side-effects.

### Task
Implement \`updateNestedProperty(state, pathArray, newValue)\` that returns a *new state object* with the target property updated without mutating any parent references in \`state\`.

### Example
\`\`\`js
const state = { profile: { settings: { theme: "light" } } };
const next = updateNestedProperty(state, ["profile", "settings", "theme"], "dark");
// next.profile.settings.theme === "dark"
// state.profile.settings.theme === "light" (unmutated!)
\`\`\`
`,
    starterCode: `/**
 * Immutably updates a deeply nested property in an object
 * @param {Object} state - State object
 * @param {Array<string>} path - Keys path, e.g. ["a", "b"]
 * @param {any} value - New value to set
 * @returns {Object} New unmutated object reference
 */
function updateNestedProperty(state, path, value) {
  if (path.length === 0) return value;
  const [head, ...tail] = path;
  return {
    ...state,
    [head]: tail.length > 0
      ? updateNestedProperty(state?.[head] ?? {}, tail, value)
      : value,
  };
}
`,
    solutionCode: `function updateNestedProperty(state, path, value) {
  if (path.length === 0) return value;
  const [head, ...tail] = path;
  return {
    ...state,
    [head]: tail.length > 0
      ? updateNestedProperty(state?.[head] ?? {}, tail, value)
      : value,
  };
}`,
    testCases: [
      {
        id: "tc-1",
        name: "Updates deeply nested value and leaves original unmutated",
        inputCode: `const initial = { user: { prefs: { theme: "light" } } };
const updated = updateNestedProperty(initial, ["user", "prefs", "theme"], "dark");
return {
  originalTheme: initial.user.prefs.theme,
  updatedTheme: updated.user.prefs.theme,
  isSameRef: initial.user === updated.user
};`,
        expectedOutput: `{"originalTheme":"light","updatedTheme":"dark","isSameRef":false}`,
      },
    ],
  },
];

export const seedCodingChallenges = async (): Promise<void> => {
  console.log("Seeding Coding Challenges...");

  for (const challenge of SEEDED_CHALLENGES) {
    const skill = await SkillCatalogModel.findOne({
      slug: challenge.skillSlug,
      isActive: true,
    });

    if (!skill) {
      console.warn(
        `Skill '${challenge.skillSlug}' not found for challenge '${challenge.title}', skipping.`
      );
      continue;
    }

    const topic = await SkillTopicModel.findOne({
      skillCatalogId: skill._id,
      slug: challenge.topicSlug,
      isActive: true,
    });

    if (!topic) {
      console.warn(
        `Topic '${challenge.topicSlug}' for skill '${challenge.skillSlug}' not found, skipping.`
      );
      continue;
    }

    await CodingChallengeModel.updateOne(
      {
        slug: challenge.slug,
      },
      {
        $set: {
          title: challenge.title,
          slug: challenge.slug,
          skillCatalogId: skill._id,
          topicId: topic._id,
          roleSlugs: challenge.roleSlugs,
          difficulty: challenge.difficulty,
          estimatedMinutes: challenge.estimatedMinutes,
          description: challenge.description,
          starterCode: challenge.starterCode,
          solutionCode: challenge.solutionCode,
          testCases: challenge.testCases,
          source: ChallengeSource.SEEDED,
          isActive: true,
        },
      },
      {
        upsert: true,
      }
    );
  }

  console.log("✅ Coding Challenges seeded successfully.");
};
