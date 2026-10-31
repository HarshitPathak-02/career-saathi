import { Types } from "mongoose";

import logger from "../../config/logger.js";
import { AppError } from "../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { appClock } from "../../shared/time/app-clock.js";
import { aiParser } from "../../shared/ai/ai.parser.js";
import { aiService } from "../../shared/ai/ai.service.js";
import { careerJourneyRepository } from "../career-journey/career-journey.repository.js";
import { userSkillRepository } from "../user-skill/user-skill.repository.js";
import { SkillCatalogModel } from "../../master-data/skill-catalog/skill-catalog.schema.js";
import { SkillTopicModel } from "../../master-data/skill-topic/skill-topic.schema.js";
import { CareerRoleSkillModel } from "../../master-data/career-role-skill/career-role-skill.schema.js";
import { skillEvidenceRepository } from "../assessment/skill-evidence.repository.js";
import { skillTopicProgressRepository } from "../assessment/skill-topic-progress.repository.js";
import { SkillEvidenceSource } from "../assessment/assessment-engine.enums.js";
import { codingChallengeRepository } from "./coding-challenge.repository.js";
import { codingAttemptRepository } from "./coding-attempt.repository.js";
import { CodingAttemptStatus } from "./practice.enums.js";
import type {
  CodingEvaluation,
  EvaluateChallengeInput,
} from "./practice.types.js";

const parseJsonText = (text: string): unknown => {
  const normalized = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return aiParser.parse(normalized);
};

const sanitizeScore = (value: unknown, fallback = 70): number => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.min(100, Math.round(num)));
};

const sanitizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
};

class PracticeService {
  private async validateJourneyOwnership(
    userId: string,
    careerJourneyIdStr: string
  ) {
    const userObjectId = new Types.ObjectId(userId);
    const journeyObjectId = new Types.ObjectId(careerJourneyIdStr);

    const journey = await careerJourneyRepository.findByIdAndUserId(
      journeyObjectId,
      userObjectId
    );

    if (!journey) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Career journey not found.");
    }

    return journey;
  }

  async getPracticeHub(userId: string, careerJourneyIdStr: string) {
    const journey = await this.validateJourneyOwnership(
      userId,
      careerJourneyIdStr
    );

    const userSkills = await userSkillRepository.findMany({
      careerJourneyId: journey._id,
      isActive: true,
    });

    let skillCatalogIds = userSkills.map((us) => us.skillCatalogId);

    if (skillCatalogIds.length === 0 && journey.roleId) {
      const roleSkills = await CareerRoleSkillModel.find({
        roleId: journey.roleId,
      })
        .sort({ displayOrder: 1 })
        .lean();
      skillCatalogIds = roleSkills.map((rs) => rs.skillId);
    }

    const skills = await SkillCatalogModel.find({
      _id: { $in: skillCatalogIds },
      isActive: true,
    }).sort({ name: 1 });

    const topics = await SkillTopicModel.find({
      skillCatalogId: { $in: skillCatalogIds },
      isActive: true,
    }).sort({ displayOrder: 1 });

    const challenges = await codingChallengeRepository.findBySkillCatalogIds(
      skillCatalogIds
    );

    const topicProgress = await skillTopicProgressRepository.findByJourney(
      journey._id
    );

    const weakProgresses = topicProgress.filter(
      (tp) => tp.masteryScore < 75 || tp.accuracy < 70
    );

    const weakTopicIds = new Set(weakProgresses.map((wp) => wp.topicId.toString()));

    const recommendedTopics = topics
      .filter((topic) => weakTopicIds.has(topic._id.toString()))
      .slice(0, 5)
      .map((t) => ({
        topicId: t._id.toString(),
        skillCatalogId: t.skillCatalogId.toString(),
        name: t.name,
        slug: t.slug,
        masteryScore:
          weakProgresses.find((wp) => wp.topicId.toString() === t._id.toString())
            ?.masteryScore ?? 0,
      }));

    const recentAttempts = await codingAttemptRepository.findRecentByUser(
      new Types.ObjectId(userId),
      6
    );

    return {
      skills: skills.map((s) => ({
        id: s._id.toString(),
        name: s.name,
        slug: s.slug,
        category: s.category,
      })),
      recommendedTopics,
      challenges: challenges.map((c) => ({
        id: c._id.toString(),
        title: c.title,
        slug: c.slug,
        skillCatalogId: c.skillCatalogId.toString(),
        topicId: c.topicId.toString(),
        difficulty: c.difficulty,
        estimatedMinutes: c.estimatedMinutes,
      })),
      recentAttempts: recentAttempts.map((a) => ({
        id: a._id.toString(),
        challengeId: a.challengeId.toString(),
        status: a.status,
        optedInToJourney: a.optedInToJourney,
        correctnessScore: a.evaluation?.correctnessScore ?? null,
        codeQualityScore: a.evaluation?.codeQualityScore ?? null,
        evaluatedAt: a.evaluatedAt,
      })),
    };
  }

  async getChallengeBySlug(
    userId: string,
    careerJourneyIdStr: string,
    slug: string
  ) {
    const journey = await this.validateJourneyOwnership(
      userId,
      careerJourneyIdStr
    );

    const challenge = await codingChallengeRepository.findBySlug(slug);
    if (!challenge) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Coding challenge not found.");
    }

    const hasSkill = await userSkillRepository.findMany({
      careerJourneyId: journey._id,
      skillCatalogId: challenge.skillCatalogId,
      isActive: true,
    });

    if (hasSkill.length === 0) {
      const roleSkill = journey.roleId
        ? await CareerRoleSkillModel.findOne({
            roleId: journey.roleId,
            skillId: challenge.skillCatalogId,
          })
        : null;

      if (!roleSkill) {
        throw new AppError(
          HTTP_STATUS.FORBIDDEN,
          "This challenge skill is not part of your active career journey."
        );
      }
    }

    const skill = await SkillCatalogModel.findById(challenge.skillCatalogId);
    const topic = await SkillTopicModel.findById(challenge.topicId);

    const latestAttempt =
      await codingAttemptRepository.findLatestByUserAndChallenge(
        new Types.ObjectId(userId),
        challenge._id
      );

    return {
      id: challenge._id.toString(),
      title: challenge.title,
      slug: challenge.slug,
      skill: {
        id: skill?._id.toString(),
        name: skill?.name,
        slug: skill?.slug,
      },
      topic: {
        id: topic?._id.toString(),
        name: topic?.name,
        slug: topic?.slug,
      },
      difficulty: challenge.difficulty,
      estimatedMinutes: challenge.estimatedMinutes,
      description: challenge.description,
      starterCode: challenge.starterCode,
      testCases: challenge.testCases
        .filter((tc) => !tc.isHidden)
        .map((tc) => ({
          id: tc.id,
          name: tc.name,
          inputCode: tc.inputCode,
          expectedOutput: tc.expectedOutput,
          explanation: tc.explanation,
        })),
      latestAttempt: latestAttempt
        ? {
            id: latestAttempt._id.toString(),
            submittedCode: latestAttempt.submittedCode,
            status: latestAttempt.status,
            optedInToJourney: latestAttempt.optedInToJourney,
            evaluation: latestAttempt.evaluation,
            evaluatedAt: latestAttempt.evaluatedAt,
          }
        : null,
    };
  }

  async evaluateAttempt(
    userId: string,
    careerJourneyIdStr: string,
    slug: string,
    input: EvaluateChallengeInput
  ) {
    const journey = await this.validateJourneyOwnership(
      userId,
      careerJourneyIdStr
    );

    const challenge = await codingChallengeRepository.findBySlug(slug);
    if (!challenge) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Coding challenge not found.");
    }

    const prompt = [
      "You are a Staff Software Engineer acting as a mentor and code reviewer.",
      "Review this candidate's solution to the programming challenge.",
      "",
      `Challenge: ${challenge.title}`,
      `Description:\n${challenge.description}`,
      "",
      `Test Execution Results:`,
      `- Total Tests: ${input.testResults.total}`,
      `- Passed Tests: ${input.testResults.passed}`,
      `- Failed Tests: ${input.testResults.failed}`,
      `- Client Run Count: ${input.runCount}`,
      `- Duration: ${input.durationSeconds}s`,
      "",
      `Candidate Code:\n\`\`\`javascript\n${input.submittedCode}\n\`\`\``,
      "",
      "Provide your evaluation as valid JSON ONLY with this exact shape:",
      `{
  "correctnessScore": 90,
  "codeQualityScore": 85,
  "observedStrengths": ["string", "string"],
  "observedStruggles": ["string"],
  "antiPatterns": ["string"],
  "mentorFeedback": "Concise coaching paragraphs diagnosing edge cases, async handling, and recommendations"
}`,
      "",
      "Guidelines:",
      "- If all tests passed, correctnessScore should be >= 85.",
      "- If any tests failed, correctnessScore should reflect test pass percentage.",
      "- codeQualityScore evaluates error handling, immutability, readability, and modern idiomatic JavaScript/Node.js.",
      "- observedStrengths highlights specific positive architectural or syntax patterns.",
      "- observedStruggles diagnoses specific hurdles (e.g. unhandled promise rejections, race conditions).",
      "- Return JSON ONLY. Do not wrap in markdown or commentary.",
    ].join("\n");

    let evaluation: CodingEvaluation = {
      correctnessScore:
        input.testResults.total > 0
          ? Math.round(
              (input.testResults.passed / input.testResults.total) * 100
            )
          : 50,
      codeQualityScore: 70,
      observedStrengths: ["Tests completed successfully"],
      observedStruggles: [],
      antiPatterns: [],
      mentorFeedback:
        "Good effort! Ensure you handle edge cases and asynchronous error boundaries cleanly.",
    };

    try {
      const response = await aiService.generate({
        prompt,
        systemInstruction:
          "You are an expert technical interviewer and staff engineer code reviewer. Return valid JSON only.",
        temperature: 0.3,
        maxOutputTokens: 2048,
      });

      const parsed = parseJsonText(response.text) as Partial<CodingEvaluation>;
      if (parsed && typeof parsed === "object") {
        evaluation = {
          correctnessScore: sanitizeScore(
            parsed.correctnessScore,
            evaluation.correctnessScore
          ),
          codeQualityScore: sanitizeScore(
            parsed.codeQualityScore,
            evaluation.codeQualityScore
          ),
          observedStrengths: sanitizeStringArray(parsed.observedStrengths),
          observedStruggles: sanitizeStringArray(parsed.observedStruggles),
          antiPatterns: sanitizeStringArray(parsed.antiPatterns),
          mentorFeedback:
            typeof parsed.mentorFeedback === "string" &&
            parsed.mentorFeedback.trim().length > 0
              ? parsed.mentorFeedback.trim()
              : evaluation.mentorFeedback,
        };
      }
    } catch (err) {
      logger.warn(
        {
          challenge: challenge.slug,
          error: err instanceof Error ? err.message : String(err),
        },
        "AI code review generation failed; falling back to heuristic evaluation"
      );
    }

    const now = appClock.now();

    const attempt = await codingAttemptRepository.create({
      userId: new Types.ObjectId(userId),
      careerJourneyId: journey._id,
      challengeId: challenge._id,
      skillCatalogId: challenge.skillCatalogId,
      topicId: challenge.topicId,
      submittedCode: input.submittedCode,
      testResults: input.testResults,
      runCount: input.runCount,
      durationSeconds: input.durationSeconds,
      status: CodingAttemptStatus.EVALUATED,
      evaluation,
      optedInToJourney: false,
      evaluatedAt: now,
    });

    await skillEvidenceRepository.create({
      userId: new Types.ObjectId(userId),
      careerJourneyId: journey._id,
      skillCatalogId: challenge.skillCatalogId,
      topicId: challenge.topicId,
      source: SkillEvidenceSource.CODING_PRACTICE,
      sourceId: attempt._id,
      score: evaluation.correctnessScore,
      confidence: 0.25,
      evidenceText: evaluation.mentorFeedback.slice(0, 300),
      scoringEligible: false,
      observedAt: now,
    });

    return {
      attemptId: attempt._id.toString(),
      challengeSlug: challenge.slug,
      evaluation,
      optedInToJourney: false,
      evaluatedAt: now,
    };
  }

  async setAttemptOptIn(
    userId: string,
    attemptIdStr: string,
    optIn: boolean
  ) {
    const attempt = await codingAttemptRepository.findById(
      new Types.ObjectId(attemptIdStr)
    );

    if (!attempt) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Coding attempt not found.");
    }

    if (attempt.userId.toString() !== userId) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        "You do not have access to this attempt."
      );
    }

    const updated = await codingAttemptRepository.setOptIn(
      attempt._id,
      optIn
    );

    await skillEvidenceRepository.updateScoringEligibleBySource(
      SkillEvidenceSource.CODING_PRACTICE,
      attempt._id,
      optIn
    );

    if (optIn && attempt.evaluation) {
      const existingProgress =
        await skillTopicProgressRepository.findOneByTopic(
          attempt.careerJourneyId,
          attempt.skillCatalogId,
          attempt.topicId
        );

      const questionsAnswered = (existingProgress?.questionsAnswered ?? 0) + 1;
      const isCorrect = attempt.evaluation.correctnessScore >= 70;
      const correctCount =
        (existingProgress?.correctCount ?? 0) + (isCorrect ? 1 : 0);
      const accuracy = Math.round((correctCount / questionsAnswered) * 100);
      const masteryScore = Math.round(
        accuracy * 0.7 + attempt.evaluation.codeQualityScore * 0.3
      );

      await skillTopicProgressRepository.upsert(
        attempt.careerJourneyId,
        attempt.skillCatalogId,
        attempt.topicId,
        {
          questionsAnswered,
          correctCount,
          accuracy,
          masteryScore,
          confidence: 0.4,
          lastAssessedAt: appClock.now(),
        }
      );
    }

    return {
      attemptId: updated?._id.toString(),
      optedInToJourney: updated?.optedInToJourney ?? false,
    };
  }
}

export const practiceService = new PracticeService();
