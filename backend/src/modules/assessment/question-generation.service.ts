import { Types } from "mongoose";

import logger from "../../config/logger.js";
import { AppError } from "../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { aiParser } from "../../shared/ai/ai.parser.js";
import { aiService } from "../../shared/ai/ai.service.js";
import { SkillCatalogModel } from "../../master-data/skill-catalog/skill-catalog.schema.js";
import { skillTopicRepository } from "../../master-data/skill-topic/skill-topic.repository.js";
import {
  QuestionDifficulty,
  QuestionSource,
  QuestionStatus,
  QuestionType,
} from "./assessment-engine.enums.js";
import {
  ASSESSMENT_ENGINE,
} from "./assessment-engine.constants.js";
import {
  questionRepository,
} from "./question.repository.js";
import {
  buildQuestionContentHash,
  validateQuestionContent,
} from "./question.validator.js";
import type {
  QuestionContentInput,
  QuestionMatching,
  QuestionNumericAnswer,
  QuestionOption,
} from "./question.types.js";

const QUESTION_PROMPT_VERSION = "question-bank-v2";

interface AIQuestionOutput {
  topicSlug: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  stem: string;
  options?: QuestionOption[];
  correctOptionKeys?: string[];
  numericAnswer?: QuestionNumericAnswer;
  matching?: QuestionMatching;
  explanation: string;
  estimatedTimeSeconds: number;
}

interface AIQuestionGenerationOutput {
  questions: AIQuestionOutput[];
}

const QUESTION_TYPE_SEQUENCE: QuestionType[] = [
  QuestionType.SINGLE_CHOICE,
  QuestionType.MULTI_SELECT,
  QuestionType.NUMERIC,
  QuestionType.MATCHING,
  QuestionType.SINGLE_CHOICE,
];

const MAX_GENERATION_ATTEMPTS = 4;

const normalizeTopicKey = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeDifficulty = (
  value: unknown,
  fallback: QuestionDifficulty
): QuestionDifficulty => {
  if (typeof value === "string") {
    const upper = value.toUpperCase().trim();
    if (
      upper === QuestionDifficulty.EASY ||
      upper === QuestionDifficulty.MEDIUM ||
      upper === QuestionDifficulty.HARD
    ) {
      return upper as QuestionDifficulty;
    }
  }
  return fallback;
};

const normalizeQuestionType = (
  value: unknown,
  fallback: QuestionType
): QuestionType => {
  if (typeof value === "string") {
    const upper = value.toUpperCase().trim();
    if (Object.values(QuestionType).includes(upper as QuestionType)) {
      return upper as QuestionType;
    }
  }
  return fallback;
};

const buildDifficultySequence = (
  count: number
): QuestionDifficulty[] => {
  if (count <= 0) {
    return [];
  }

  if (count === 5) {
    return [
      QuestionDifficulty.EASY,
      QuestionDifficulty.EASY,
      QuestionDifficulty.MEDIUM,
      QuestionDifficulty.MEDIUM,
      QuestionDifficulty.HARD,
    ];
  }

  const hardCount = Math.max(
    1,
    Math.round(count * ASSESSMENT_ENGINE.DIFFICULTY_DISTRIBUTION.HARD)
  );
  const mediumCount = Math.max(
    1,
    Math.round(count * ASSESSMENT_ENGINE.DIFFICULTY_DISTRIBUTION.MEDIUM)
  );
  const easyCount = Math.max(1, count - hardCount - mediumCount);

  const sequence: QuestionDifficulty[] = [];
  for (let i = 0; i < easyCount; i += 1) {
    sequence.push(QuestionDifficulty.EASY);
  }
  for (let i = 0; i < mediumCount; i += 1) {
    sequence.push(QuestionDifficulty.MEDIUM);
  }
  for (let i = 0; i < hardCount; i += 1) {
    sequence.push(QuestionDifficulty.HARD);
  }

  return sequence;
};

const parseJsonText = (
  text: string
): unknown => {
  const normalized = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  return aiParser.parse(normalized);
};

const assertGenerationOutput = (
  value: unknown
): AIQuestionGenerationOutput => {
  if (
    !value ||
    typeof value !== "object" ||
    !Array.isArray(
      (value as AIQuestionGenerationOutput)
        .questions
    )
  ) {
    throw new Error(
      "AI question output must contain a questions array."
    );
  }

  return value as AIQuestionGenerationOutput;
};

const toQuestionContent = (
  question: AIQuestionOutput
): QuestionContentInput => {
  const estimatedTimeSeconds =
    Number.isInteger(question.estimatedTimeSeconds) &&
    question.estimatedTimeSeconds >= 10 &&
    question.estimatedTimeSeconds <= 600
      ? question.estimatedTimeSeconds
      : 60;

  const stem = typeof question.stem === "string" ? question.stem.trim() : "";
  const explanation =
    typeof question.explanation === "string" ? question.explanation.trim() : "";

  switch (question.type) {
    case QuestionType.SINGLE_CHOICE:
    case QuestionType.MULTI_SELECT: {
      const options = Array.isArray(question.options)
        ? question.options
            .filter(
              (option) =>
                option &&
                typeof option.key === "string" &&
                typeof option.text === "string"
            )
            .map((option) => ({
              key: option.key.trim(),
              text: option.text.trim(),
            }))
        : [];

      const correctOptionKeys = Array.isArray(question.correctOptionKeys)
        ? question.correctOptionKeys
            .filter((key) => typeof key === "string" && key.trim().length > 0)
            .map((key) => key.trim())
        : [];

      return {
        type: question.type,
        stem,
        options,
        correctOptionKeys,
        numericAnswer: undefined,
        matching: undefined,
        explanation,
        estimatedTimeSeconds,
      };
    }

    case QuestionType.NUMERIC: {
      const rawValue = question.numericAnswer?.value;
      const parsedValue =
        rawValue !== undefined && rawValue !== null ? Number(rawValue) : NaN;
      const tolerance =
        question.numericAnswer?.tolerance !== undefined &&
        question.numericAnswer?.tolerance !== null
          ? Math.max(0, Number(question.numericAnswer.tolerance))
          : 0;
      const unit =
        typeof question.numericAnswer?.unit === "string"
          ? question.numericAnswer.unit.trim()
          : "";

      return {
        type: QuestionType.NUMERIC,
        stem,
        options: undefined,
        correctOptionKeys: undefined,
        numericAnswer: Number.isFinite(parsedValue)
          ? {
              value: parsedValue,
              tolerance: Number.isFinite(tolerance) ? tolerance : 0,
              unit,
            }
          : undefined,
        matching: undefined,
        explanation,
        estimatedTimeSeconds,
      };
    }

    case QuestionType.MATCHING: {
      const leftItems = Array.isArray(question.matching?.leftItems)
        ? question.matching.leftItems
            .filter(
              (item) =>
                item &&
                typeof item.key === "string" &&
                typeof item.text === "string"
            )
            .map((item) => ({
              key: item.key.trim(),
              text: item.text.trim(),
            }))
        : [];

      const rightItems = Array.isArray(question.matching?.rightItems)
        ? question.matching.rightItems
            .filter(
              (item) =>
                item &&
                typeof item.key === "string" &&
                typeof item.text === "string"
            )
            .map((item) => ({
              key: item.key.trim(),
              text: item.text.trim(),
            }))
        : [];

      const correctPairs = Array.isArray(question.matching?.correctPairs)
        ? question.matching.correctPairs
            .filter(
              (pair) =>
                pair &&
                typeof pair.leftKey === "string" &&
                typeof pair.rightKey === "string"
            )
            .map((pair) => ({
              leftKey: pair.leftKey.trim(),
              rightKey: pair.rightKey.trim(),
            }))
        : [];

      return {
        type: QuestionType.MATCHING,
        stem,
        options: undefined,
        correctOptionKeys: undefined,
        numericAnswer: undefined,
        matching:
          leftItems.length > 0 && rightItems.length > 0
            ? {
                leftItems,
                rightItems,
                correctPairs,
              }
            : undefined,
        explanation,
        estimatedTimeSeconds,
      };
    }

    default:
      return {
        type: question.type,
        stem,
        explanation,
        estimatedTimeSeconds,
      };
  }
};

class QuestionGenerationService {

  async ensureServableQuestions(
    skillCatalogId: Types.ObjectId,
    questionCount: number
  ) {
    let servable =
      await questionRepository.findServableBySkill(
        skillCatalogId,
        questionCount
      );

    if (servable.length >= questionCount) {
      return servable;
    }

    const skill =
      await SkillCatalogModel.findOne({
        _id: skillCatalogId,
        isActive: true,
      });

    if (!skill) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        "Skill not found."
      );
    }

    const topics =
      await skillTopicRepository
        .findActiveBySkillCatalogId(
          skillCatalogId
        );

    if (topics.length === 0) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        `No topics are configured for skill '${skill.name}'.`
      );
    }

    const topicByKey = new Map<
      string,
      (typeof topics)[number]
    >();

    for (const topic of topics) {
      topicByKey.set(
        normalizeTopicKey(topic.slug),
        topic
      );
      topicByKey.set(
        normalizeTopicKey(topic.name),
        topic
      );
    }

    for (
      let attempt = 0;
      attempt < MAX_GENERATION_ATTEMPTS &&
      servable.length < questionCount;
      attempt += 1
    ) {
      const deficit = questionCount - servable.length;
      const requestedCount = Math.max(deficit + 3, 6);

      const difficulties =
        buildDifficultySequence(requestedCount);

      const questionTypes =
        Array.from(
          {
            length: requestedCount,
          },
          (_, index) =>
            QUESTION_TYPE_SEQUENCE[
              index %
                QUESTION_TYPE_SEQUENCE.length
            ]
        );

      const prompt = [
        "Generate technical assessment questions for a career skills platform.",
        "",
        `Skill: ${skill.name}`,
        `Available topic slugs: ${topics.map((topic) => topic.slug).join(", ")}`,
        "",
        "Return valid JSON only with this exact top-level object: {\"questions\": [...]}",
        "",
        "Each question object must adhere to its type schema strictly:",
        "1. SINGLE_CHOICE:",
        '   {"topicSlug":"<slug>","type":"SINGLE_CHOICE","difficulty":"EASY|MEDIUM|HARD","stem":"...","options":[{"key":"A","text":"..."},{"key":"B","text":"..."},{"key":"C","text":"..."},{"key":"D","text":"..."}],"correctOptionKeys":["A"],"explanation":"...","estimatedTimeSeconds":60}',
        "2. MULTI_SELECT:",
        '   {"topicSlug":"<slug>","type":"MULTI_SELECT","difficulty":"EASY|MEDIUM|HARD","stem":"...","options":[{"key":"A","text":"..."},{"key":"B","text":"..."},{"key":"C","text":"..."},{"key":"D","text":"..."}],"correctOptionKeys":["A","C"],"explanation":"...","estimatedTimeSeconds":60}',
        "3. NUMERIC:",
        '   {"topicSlug":"<slug>","type":"NUMERIC","difficulty":"EASY|MEDIUM|HARD","stem":"...","numericAnswer":{"value":42,"tolerance":0,"unit":""},"explanation":"...","estimatedTimeSeconds":60}',
        "4. MATCHING:",
        '   {"topicSlug":"<slug>","type":"MATCHING","difficulty":"EASY|MEDIUM|HARD","stem":"...","matching":{"leftItems":[{"key":"L1","text":"..."},{"key":"L2","text":"..."},{"key":"L3","text":"..."}],"rightItems":[{"key":"R1","text":"..."},{"key":"R2","text":"..."},{"key":"R3","text":"..."},{"key":"R4","text":"..."}],"correctPairs":[{"leftKey":"L1","rightKey":"R1"},{"leftKey":"L2","rightKey":"R2"},{"leftKey":"L3","rightKey":"R3"}]},"explanation":"...","estimatedTimeSeconds":60}',
        "",
        `Generate exactly ${requestedCount} questions.`,
        `Required difficulties in order: ${difficulties.join(", ")}.`,
        `Required question types in order: ${questionTypes.join(", ")}.`,
        "",
        "Rules:",
        "- topicSlug MUST be one of the exact available topic slugs listed above.",
        "- For SINGLE_CHOICE: exactly 4 options (keys A, B, C, D) and exactly 1 correctOptionKeys entry.",
        "- For MULTI_SELECT: exactly 4 options (keys A, B, C, D) and at least 2 correctOptionKeys entries.",
        "- For NUMERIC: omit options, correctOptionKeys, and matching entirely.",
        "- For MATCHING: provide at least 3 leftItems, at least 4 rightItems, and exactly 1 pair per leftItem with unique rightKeys. Omit options, correctOptionKeys, and numericAnswer.",
        "- Questions must be technically accurate, unambiguous, self-contained, and solvable without external resources.",
        "- Return JSON ONLY. Do not wrap in markdown or commentary.",
      ].join("\n");

      let output: AIQuestionGenerationOutput;
      let provider: string;
      let modelName: string;

      try {
        const response = await aiService.generate({
          prompt,
          systemInstruction:
            "You are an expert technical assessment author. Produce valid JSON only.",
          temperature: 0.4,
          maxOutputTokens: 8192,
        });

        provider = response.metadata.provider;
        modelName = response.metadata.model;
        const rawOutput = parseJsonText(response.text);
        output = assertGenerationOutput(rawOutput);
      } catch (genError) {
        logger.warn(
          {
            skill: skill.name,
            attempt: attempt + 1,
            error:
              genError instanceof Error
                ? genError.message
                : String(genError),
          },
          "AI question generation or parsing failed for attempt"
        );
        continue;
      }

      for (let qIndex = 0; qIndex < output.questions.length; qIndex += 1) {
        const outputQuestion = output.questions[qIndex];
        const normalizedTopicSlug = normalizeTopicKey(
          outputQuestion.topicSlug ?? ""
        );

        let topic = topicByKey.get(normalizedTopicSlug);

        if (!topic) {
          topic = topics.find(
            (candidate) =>
              normalizeTopicKey(candidate.slug).includes(normalizedTopicSlug) ||
              normalizedTopicSlug.includes(normalizeTopicKey(candidate.slug)) ||
              normalizeTopicKey(candidate.name).includes(normalizedTopicSlug) ||
              normalizedTopicSlug.includes(normalizeTopicKey(candidate.name))
          );
        }

        if (!topic) {
          logger.warn(
            {
              skill: skill.name,
              receivedTopicSlug: outputQuestion.topicSlug,
              fallbackTopic: topics[0].slug,
            },
            "Unknown topic slug in AI question; falling back to first skill topic"
          );
          topic = topics[0];
        }

        const normalizedType = normalizeQuestionType(
          outputQuestion.type,
          questionTypes[qIndex % questionTypes.length] ??
            QuestionType.SINGLE_CHOICE
        );

        const normalizedDiff = normalizeDifficulty(
          outputQuestion.difficulty,
          difficulties[qIndex % difficulties.length] ??
            QuestionDifficulty.MEDIUM
        );

        const content = toQuestionContent({
          ...outputQuestion,
          type: normalizedType,
        });

        try {
          validateQuestionContent(content);
        } catch (validationError) {
          logger.warn(
            {
              skill: skill.name,
              stem: content.stem,
              type: content.type,
              error:
                validationError instanceof Error
                  ? validationError.message
                  : String(validationError),
            },
            "AI question failed content validation; skipping"
          );
          continue;
        }

        const contentHash =
          buildQuestionContentHash(content);

        const duplicate =
          await questionRepository
            .findByContentHash(contentHash);

        if (duplicate) {
          logger.debug(
            { contentHash, stem: content.stem },
            "Question with duplicate contentHash found; skipping"
          );
          continue;
        }

        await questionRepository.create({
          skillCatalogId,
          topicId: topic._id,
          type: content.type,
          difficulty: normalizedDiff,
          stem: content.stem,
          options: content.options ?? [],
          correctOptionKeys:
            content.correctOptionKeys ?? [],
          numericAnswer:
            content.numericAnswer,
          matching: content.matching,
          explanation: content.explanation,
          estimatedTimeSeconds:
            content.estimatedTimeSeconds,
          status:
            QuestionStatus.AI_VALIDATED,
          source: QuestionSource.AI,
          version: 1,
          contentHash,
          generatedBy: {
            provider,
            model: modelName,
            promptVersion:
              QUESTION_PROMPT_VERSION,
          },
        } as unknown as Parameters<
          typeof questionRepository.create
        >[0]);
      }

      servable =
        await questionRepository
          .findServableBySkill(
            skillCatalogId,
            questionCount
          );
    }

    if (servable.length < questionCount) {
      throw new AppError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        `Could not prepare enough questions for skill '${skill.name}'.`
      );
    }

    return servable;
  }

  async selectQuestionsForAttempt(
    skillCatalogId: Types.ObjectId,
    questionCount: number
  ) {
    await this.ensureServableQuestions(
      skillCatalogId,
      questionCount
    );

    const available =
      await questionRepository.findServableBySkill(
        skillCatalogId,
        Math.max(questionCount + 10, 20)
      );

    const desiredDifficulties =
      buildDifficultySequence(questionCount);

    const selected: typeof available = [];
    const usedIds = new Set<string>();

    for (const difficulty of desiredDifficulties) {
      const match = available.find(
        (question) =>
          question.difficulty === difficulty &&
          !usedIds.has(
            question._id.toString()
          )
      );

      if (match) {
        selected.push(match);
        usedIds.add(match._id.toString());
      }
    }

    for (const question of available) {
      if (selected.length >= questionCount) {
        break;
      }

      if (
        usedIds.has(question._id.toString())
      ) {
        continue;
      }

      selected.push(question);
      usedIds.add(question._id.toString());
    }

    return selected.slice(0, questionCount);
  }
}

export const questionGenerationService =
  new QuestionGenerationService();
