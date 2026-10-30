import { createHash } from "node:crypto";

import { QuestionType } from "./assessment-engine.enums.js";
import type {
  QuestionContentInput,
  QuestionMatching,
  QuestionNumericAnswer,
  QuestionOption,
} from "./question.types.js";

const isNonEmptyString = (
  value: unknown
): value is string =>
  typeof value === "string" &&
  value.trim().length > 0;

const assertUniqueKeys = (
  items: Array<{ key: string }>,
  label: string
): void => {
  const keys = items.map((item) => item.key);

  if (new Set(keys).size !== keys.length) {
    throw new Error(`${label} must have unique keys.`);
  }
};

const validateOptions = (
  options: QuestionOption[] | undefined
): QuestionOption[] => {
  if (
    !Array.isArray(options) ||
    options.length < 2 ||
    options.length > 8
  ) {
    throw new Error(
      "Choice questions require between 2 and 8 options."
    );
  }

  for (const option of options) {
    if (!isNonEmptyString(option.key)) {
      throw new Error("Every option must have a key.");
    }

    if (!isNonEmptyString(option.text)) {
      throw new Error("Every option must have text.");
    }
  }

  assertUniqueKeys(options, "Options");

  return options;
};

const validateNumericAnswer = (
  numericAnswer: QuestionNumericAnswer | undefined
): QuestionNumericAnswer => {
  if (!numericAnswer) {
    throw new Error(
      "Numeric questions require a numeric answer."
    );
  }

  if (!Number.isFinite(numericAnswer.value)) {
    throw new Error("Numeric answer value must be finite.");
  }

  if (
    !Number.isFinite(numericAnswer.tolerance) ||
    numericAnswer.tolerance < 0
  ) {
    throw new Error(
      "Numeric answer tolerance must be a non-negative finite number."
    );
  }

  if (
    numericAnswer.unit !== undefined &&
    typeof numericAnswer.unit !== "string"
  ) {
    throw new Error("Numeric answer unit must be a string.");
  }

  return numericAnswer;
};

const validateMatching = (
  matching: QuestionMatching | undefined
): QuestionMatching => {
  if (!matching) {
    throw new Error(
      "Matching questions require matching data."
    );
  }

  if (
    !Array.isArray(matching.leftItems) ||
    matching.leftItems.length < 2
  ) {
    throw new Error(
      "Matching questions require at least two left items."
    );
  }

  if (
    !Array.isArray(matching.rightItems) ||
    matching.rightItems.length < 2
  ) {
    throw new Error(
      "Matching questions require at least two right items."
    );
  }

  if (
    !Array.isArray(matching.correctPairs) ||
    matching.correctPairs.length !==
      matching.leftItems.length
  ) {
    throw new Error(
      "Every left item must have exactly one correct pair."
    );
  }

  for (const item of [
    ...matching.leftItems,
    ...matching.rightItems,
  ]) {
    if (
      !isNonEmptyString(item.key) ||
      !isNonEmptyString(item.text)
    ) {
      throw new Error(
        "Every matching item must have a key and text."
      );
    }
  }

  assertUniqueKeys(matching.leftItems, "Matching left items");
  assertUniqueKeys(matching.rightItems, "Matching right items");

  const leftKeys = new Set(
    matching.leftItems.map((item) => item.key)
  );
  const rightKeys = new Set(
    matching.rightItems.map((item) => item.key)
  );
  const pairedLeftKeys = new Set<string>();

  for (const pair of matching.correctPairs) {
    if (
      !leftKeys.has(pair.leftKey) ||
      !rightKeys.has(pair.rightKey)
    ) {
      throw new Error(
        "Matching pairs must reference valid left and right items."
      );
    }

    if (pairedLeftKeys.has(pair.leftKey)) {
      throw new Error(
        "A matching left item cannot have multiple pairs."
      );
    }

    pairedLeftKeys.add(pair.leftKey);
  }

  return matching;
};

export const validateQuestionContent = (
  question: QuestionContentInput
): void => {
  if (!isNonEmptyString(question.stem)) {
    throw new Error("Question stem is required.");
  }

  if (!isNonEmptyString(question.explanation)) {
    throw new Error("Question explanation is required.");
  }

  if (
    !Number.isInteger(question.estimatedTimeSeconds) ||
    question.estimatedTimeSeconds < 10 ||
    question.estimatedTimeSeconds > 600
  ) {
    throw new Error(
      "Estimated time must be an integer between 10 and 600 seconds."
    );
  }

  const correctOptionKeys =
    question.correctOptionKeys ?? [];
  const optionKeys = new Set(
    (question.options ?? []).map((option) => option.key)
  );

  switch (question.type) {
    case QuestionType.SINGLE_CHOICE: {
      const options = validateOptions(question.options);

      if (
        correctOptionKeys.length !== 1 ||
        !optionKeys.has(correctOptionKeys[0])
      ) {
        throw new Error(
          "Single-choice questions require exactly one valid correct option."
        );
      }

      if (
        options.some(
          (option) =>
            !isNonEmptyString(option.key)
        )
      ) {
        throw new Error("Invalid option key.");
      }

      if (
        question.numericAnswer !== undefined ||
        question.matching !== undefined
      ) {
        throw new Error(
          "Single-choice questions cannot contain numeric or matching data."
        );
      }

      break;
    }

    case QuestionType.MULTI_SELECT: {
      validateOptions(question.options);

      const uniqueCorrectKeys = new Set(correctOptionKeys);

      if (
        correctOptionKeys.length < 2 ||
        uniqueCorrectKeys.size !==
          correctOptionKeys.length ||
        correctOptionKeys.some(
          (key) => !optionKeys.has(key)
        )
      ) {
        throw new Error(
          "Multi-select questions require at least two valid unique correct options."
        );
      }

      if (
        question.numericAnswer !== undefined ||
        question.matching !== undefined
      ) {
        throw new Error(
          "Multi-select questions cannot contain numeric or matching data."
        );
      }

      break;
    }

    case QuestionType.NUMERIC:
      validateNumericAnswer(question.numericAnswer);

      if (
        (question.options?.length ?? 0) > 0 ||
        correctOptionKeys.length > 0 ||
        question.matching !== undefined
      ) {
        throw new Error(
          "Numeric questions cannot contain options or matching data."
        );
      }

      break;

    case QuestionType.MATCHING:
      validateMatching(question.matching);

      if (
        (question.options?.length ?? 0) > 0 ||
        correctOptionKeys.length > 0 ||
        question.numericAnswer !== undefined
      ) {
        throw new Error(
          "Matching questions cannot contain options or numeric data."
        );
      }

      break;

    default:
      throw new Error("Unsupported question type.");
  }
};

const normalizeHashPart = (
  value: string
): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

export const buildQuestionContentHash = (
  question: QuestionContentInput
): string => {
  const options = (question.options ?? [])
    .map(
      (option) =>
        `${normalizeHashPart(option.key)}:${normalizeHashPart(option.text)}`
    )
    .sort();

  const matchingLeft = (
    question.matching?.leftItems ?? []
  )
    .map(
      (item) =>
        `${normalizeHashPart(item.key)}:${normalizeHashPart(item.text)}`
    )
    .sort();

  const matchingRight = (
    question.matching?.rightItems ?? []
  )
    .map(
      (item) =>
        `${normalizeHashPart(item.key)}:${normalizeHashPart(item.text)}`
    )
    .sort();

  const payload = [
    question.type,
    normalizeHashPart(question.stem),
    ...options,
    ...matchingLeft,
    ...matchingRight,
  ].join("|");

  return createHash("sha256")
    .update(payload)
    .digest("hex");
};
