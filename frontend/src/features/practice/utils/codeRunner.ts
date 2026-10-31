import type {
  CodingTestCase,
  TestExecutionResult,
  TestSuiteResult,
} from "../types/practice.types";

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
    return false;
  }
  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) return false;
    if (!deepEqual(objA[key], objB[key])) return false;
  }
  return true;
}

function normalizeOutput(value: unknown): string {
  if (value === undefined) return "undefined";
  if (typeof value === "function") return value.toString();
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function matchesExpected(actual: unknown, expectedOutput: string): boolean {
  const actualStr = normalizeOutput(actual);
  const trimmedExpected = expectedOutput.trim();

  if (actualStr === trimmedExpected) return true;
  if (String(actual) === trimmedExpected) return true;

  try {
    const parsedExpected = JSON.parse(trimmedExpected);
    if (deepEqual(actual, parsedExpected)) return true;
    if (typeof actual === "number" && typeof parsedExpected === "number") {
      return Math.abs(actual - parsedExpected) < 0.001;
    }
  } catch {
    // Expected output was not valid JSON
  }

  if (
    typeof actual === "string" &&
    actual === trimmedExpected.replace(/^["']|["']$/g, "")
  ) {
    return true;
  }

  return false;
}

function prepareTestCaseBody(inputCode: string): string {
  const trimmed = inputCode.trim();
  if (!trimmed.includes("return")) {
    return `return (${trimmed});`;
  }

  // Prepend a microtask/macrotask yield before the final return statement
  // so async operations (e.g. Promise.catch, callbacks) settle
  const lastReturnIdx = trimmed.lastIndexOf("return");
  const beforeReturn = trimmed.slice(0, lastReturnIdx);
  const fromReturn = trimmed.slice(lastReturnIdx);

  return `${beforeReturn}\nawait new Promise((resolve) => setTimeout(resolve, 15));\n${fromReturn}`;
}

export async function runTestCase(
  userCode: string,
  testCase: CodingTestCase
): Promise<TestExecutionResult> {
  const logs: string[] = [];
  const customConsole = {
    log: (...args: unknown[]) => {
      logs.push(args.map((a) => (typeof a === "object" ? normalizeOutput(a) : String(a))).join(" "));
    },
    warn: (...args: unknown[]) => {
      logs.push("[WARN] " + args.map((a) => String(a)).join(" "));
    },
    error: (...args: unknown[]) => {
      logs.push("[ERROR] " + args.map((a) => String(a)).join(" "));
    },
    info: (...args: unknown[]) => {
      logs.push("[INFO] " + args.map((a) => String(a)).join(" "));
    },
  };

  const startTime = performance.now();
  let passed: boolean;
  let actualOutput: string;
  let errorMsg: string | undefined;

  try {
    const testBody = prepareTestCaseBody(testCase.inputCode);
    const runnerSource = `
      return (async (console) => {
        "use strict";
        ${userCode}

        const __test_run = async () => {
          ${testBody}
        };

        return await __test_run();
      });
    `;

    // Dynamic execution wrapper
    const fnFactory = new Function(runnerSource);
    const executeRunner = fnFactory();

    // 2000ms safety timeout against infinite loops
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error("Execution timed out: exceeded 2000ms safety limit.")),
        2000
      );
    });

    const rawResult = await Promise.race([
      executeRunner(customConsole),
      timeoutPromise,
    ]);

    actualOutput = normalizeOutput(rawResult);
    passed = matchesExpected(rawResult, testCase.expectedOutput);
  } catch (err: unknown) {
    passed = false;
    errorMsg = err instanceof Error ? err.message : String(err);
    actualOutput = errorMsg;
  }

  const executionTimeMs = Math.round((performance.now() - startTime) * 10) / 10;

  return {
    id: testCase.id,
    name: testCase.name,
    passed,
    actualOutput,
    expectedOutput: testCase.expectedOutput,
    error: errorMsg,
    logs,
    executionTimeMs,
  };
}

export async function runTests(
  userCode: string,
  testCases: CodingTestCase[]
): Promise<TestSuiteResult> {
  const startTime = performance.now();
  const results: TestExecutionResult[] = [];

  for (const tc of testCases) {
    const result = await runTestCase(userCode, tc);
    results.push(result);
  }

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const failed = total - passed;
  const executionTimeMs = Math.round((performance.now() - startTime) * 10) / 10;

  return {
    total,
    passed,
    failed,
    executionTimeMs,
    results,
  };
}
