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
import { mockInterviewRepository } from "../mock-interview/mock-interview.repository.js";
import {
  MockInterviewStatus,
  MockInterviewType,
} from "../mock-interview/mock-interview.enums.js";
import { CareerRoleModel } from "../../master-data/career-role/career-role.schema.js";
import { roadmapRepository } from "../roadmap/roadmap.repository.js";
import { roadmapWorkflowService } from "../roadmap/roadmap-workflow.service.js";
import { codingChallengeRepository } from "./coding-challenge.repository.js";
import { codingAttemptRepository } from "./coding-attempt.repository.js";
import { interviewSessionRepository } from "./interview-session.repository.js";
import {
  CodingAttemptStatus,
  InterviewSessionStatus,
  InterviewTurnType,
} from "./practice.enums.js";
import type {
  CodingEvaluation,
  EvaluateChallengeInput,
  InterviewEvaluation,
  StartInterviewInput,
  SubmitAnswerInput,
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

    const recentInterviews = await interviewSessionRepository.findRecentByUser(
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
      recentInterviews: recentInterviews.map((i) => {
        const skill = i.skillCatalogId
          ? skills.find((s) => s._id.toString() === i.skillCatalogId!.toString())
          : null;
        return {
          id: i._id.toString(),
          skillCatalogId: i.skillCatalogId ? i.skillCatalogId.toString() : "",
          skillName: i.isOfficialReadinessMock
            ? `${i.roleTitle || "Role"} - Mock Interview ${i.mockInterviewNumber}`
            : skill?.name ?? "Skill Drill",
          status: i.status,
          currentQuestionIndex: i.currentQuestionIndex,
          optedInToJourney: i.optedInToJourney,
          overallScore: i.evaluation?.overallScore ?? null,
          conceptualDepthScore: i.evaluation?.conceptualDepthScore ?? null,
          communicationScore: i.evaluation?.communicationScore ?? null,
          startedAt: i.startedAt,
          completedAt: i.completedAt ?? null,
        };
      }),
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
      if (attempt.skillCatalogId) {
        try {
          await roadmapWorkflowService.syncPendingRoadmapSkills(
            attempt.careerJourneyId,
            [attempt.skillCatalogId],
            "Practiced coding challenge prior to journey start"
          );
        } catch (syncErr) {
          logger.warn(
            { error: syncErr, attemptId: attempt._id },
            "Pre-mission roadmap sync on coding opt-in skipped or failed"
          );
        }
      }

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

  /*
  |--------------------------------------------------------------------------
  | Technical Interview Workspace Methods
  |--------------------------------------------------------------------------
  */

  private async generateScenarioQuestion(
    skillName: string,
    topicNames: string[],
    questionIndex: number,
    previousQuestions: string[]
  ): Promise<string> {
    const topicFocus = topicNames.length > 0 ? topicNames.join(", ") : skillName;
    const prompt = [
      `You are a Staff Software Engineer conducting a live technical interview on ${skillName}.`,
      `Topic Focus: ${topicFocus}.`,
      `Question Number: ${questionIndex + 1} of 3.`,
      previousQuestions.length > 0
        ? `Already asked in this session:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`
        : "",
      "Generate 1 realistic, concrete production engineering scenario or architectural trade-off question.",
      "The question must probe foundational mechanics, edge-case behavior, or debugging failure modes (e.g. concurrency, memory, timeouts, unhandled exceptions).",
      "Do NOT ask multiple sub-questions. Do NOT ask textbook trivia definitions (e.g. 'What is X?').",
      "Ask directly in 2 to 3 sentences maximum.",
      "Return ONLY a JSON object with this exact shape: {\"question\": \"<question text here>\"}.",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await aiService.generate({
        prompt,
        systemInstruction:
          "You are a seasoned technical interviewer at a top technology company. Ask realistic, probing scenario questions. Output JSON ONLY.",
        temperature: 0.5,
        maxOutputTokens: 256,
      });

      const parsed = parseJsonText(response.text) as any;
      const question =
        parsed?.question || (typeof parsed === "string" ? parsed : null);
      if (typeof question === "string" && question.trim().length > 10) {
        return question.trim();
      }
    } catch (err) {
      logger.warn({ error: err, skillName }, "AI scenario question generation failed; using fallback");
    }

    const fallbacks = [
      `Suppose a high-throughput endpoint in ${skillName} begins timing out intermittently under burst traffic. How would you systematically diagnose whether the issue is I/O latency, CPU saturation, or memory starvation?`,
      `In ${skillName}, when handling asynchronous operations and external network calls, how do you prevent unhandled rejections from destabilizing the service, and what cleanup guarantees do you implement?`,
      `Consider a scenario where two concurrent operations attempt to mutate the same resource state in ${skillName}. How do you ensure consistency, and what trade-offs exist between optimistic locking and atomic operations?`,
    ];
    return fallbacks[questionIndex % fallbacks.length];
  }

  private async generateFollowUpQuestion(
    skillName: string,
    questionText: string,
    candidateAnswer: string
  ): Promise<string> {
    const prompt = [
      `You are a Staff Technical Interviewer evaluating a candidate on ${skillName}.`,
      `Scenario Question Asked:\n"${questionText}"`,
      `Candidate's Response:\n"${candidateAnswer}"`,
      "",
      "Task: Formulate 1 targeted follow-up question that challenges an assumption made, probes an unaddressed edge case, or pressure-tests how their solution behaves under failure or scale.",
      "Keep the follow-up concise (1 to 2 sentences). Ask directly without preamble or compliments.",
      "Return ONLY a JSON object with this exact shape: {\"followUpQuestion\": \"<question text here>\"}.",
    ].join("\n");

    try {
      const response = await aiService.generate({
        prompt,
        systemInstruction:
          "You are a technical interviewer. Read the candidate's answer and ask 1 pointed follow-up challenging an assumption or edge case. Output JSON ONLY.",
        temperature: 0.4,
        maxOutputTokens: 200,
      });

      const parsed = parseJsonText(response.text) as any;
      const question =
        parsed?.followUpQuestion || parsed?.question || (typeof parsed === "string" ? parsed : null);
      if (typeof question === "string" && question.trim().length > 10) {
        return question.trim();
      }
    } catch (err) {
      logger.warn({ error: err }, "AI follow-up question generation failed; using fallback");
    }

    return `That addresses the primary flow, but how would your approach change if the underlying service or database experiences a transient network partition or high error rate?`;
  }

  private async generateInterviewEvaluation(
    skillName: string,
    turns: Array<{
      questionText: string;
      candidateAnswer: string | null;
      turnType: string;
    }>
  ): Promise<InterviewEvaluation> {
    const transcriptText = turns
      .map(
        (t, idx) =>
          `Turn ${idx + 1} (${t.turnType}):\nQ: ${t.questionText}\nA: ${t.candidateAnswer ?? "No response"}`
      )
      .join("\n\n");

    const prompt = [
      `You are an expert technical interviewer and staff engineer conducting a diagnostic assessment on ${skillName}.`,
      `Evaluate the candidate's performance across the entire 6-turn technical drill:`,
      transcriptText,
      "",
      "Evaluate rigorously based on conceptual depth, correctness, architectural trade-offs, and communication clarity.",
      "Return valid JSON ONLY with this exact shape:",
      `{
  "conceptualDepthScore": 82,
  "communicationScore": 75,
  "overallScore": 79,
  "observedStrengths": ["string", "string"],
  "observedGaps": ["string", "string"],
  "antiPatterns": ["string"],
  "mentorFeedback": "Coaching paragraph diagnosing strengths, key gaps, and targeted study advice"
}`,
    ].join("\n");

    let evaluation: InterviewEvaluation = {
      conceptualDepthScore: 70,
      communicationScore: 70,
      overallScore: 70,
      observedStrengths: ["Participated in all interview turns"],
      observedGaps: [],
      antiPatterns: [],
      mentorFeedback:
        "Good effort! Focus on deepening your understanding of edge-case handling and production trade-offs.",
    };

    try {
      const response = await aiService.generate({
        prompt,
        systemInstruction:
          "You are a technical bar raiser. Evaluate the candidate's interview transcript and return JSON ONLY.",
        temperature: 0.2,
        maxOutputTokens: 1024,
      });

      const parsed = parseJsonText(response.text) as Partial<InterviewEvaluation>;
      if (parsed && typeof parsed === "object") {
        evaluation = {
          conceptualDepthScore: sanitizeScore(parsed.conceptualDepthScore, 70),
          communicationScore: sanitizeScore(parsed.communicationScore, 70),
          overallScore: sanitizeScore(parsed.overallScore, 70),
          observedStrengths: sanitizeStringArray(parsed.observedStrengths),
          observedGaps: sanitizeStringArray(parsed.observedGaps),
          antiPatterns: sanitizeStringArray(parsed.antiPatterns),
          mentorFeedback:
            typeof parsed.mentorFeedback === "string" && parsed.mentorFeedback.trim().length > 0
              ? parsed.mentorFeedback.trim()
              : evaluation.mentorFeedback,
        };
      }
    } catch (err) {
      logger.warn({ error: err }, "AI interview evaluation failed; using heuristic fallback");
    }

    return evaluation;
  }

  private formatSessionResponse(session: any, skillName: string) {
    return {
      id: session._id.toString(),
      skillCatalogId: session.skillCatalogId ? session.skillCatalogId.toString() : null,
      skillName,
      isOfficialReadinessMock: Boolean(session.isOfficialReadinessMock),
      mockInterviewNumber: session.mockInterviewNumber ?? null,
      mockInterviewType: session.mockInterviewType ?? null,
      roleTitle: session.roleTitle ?? null,
      status: session.status,
      currentQuestionIndex: session.currentQuestionIndex,
      isAwaitingFollowUp: session.isAwaitingFollowUp,
      turns: session.turns.map((t: any) => ({
        turnIndex: t.turnIndex,
        questionIndex: t.questionIndex,
        turnType: t.turnType,
        questionText: t.questionText,
        candidateAnswer: t.candidateAnswer,
        answeredAt: t.answeredAt,
      })),
      evaluation: session.evaluation ?? null,
      optedInToJourney: session.optedInToJourney,
      startedAt: session.startedAt,
      completedAt: session.completedAt ?? null,
    };
  }

  async generateOfficialScenarioQuestion(
    roleTitle: string,
    interviewNumber: number,
    focus: string,
    skillNames: string[],
    questionIndex: number,
    previousQuestions: string[]
  ): Promise<string> {
    const skillsContext =
      skillNames.length > 0 ? `Core Technologies: ${skillNames.join(", ")}.` : "";
    const prompt = [
      `You are a Staff Technical Bar-Raiser at a top technology company conducting an Official Milestone Mock Interview for a ${roleTitle} candidate.`,
      `Interview ${interviewNumber} of 3 Focus: ${focus}.`,
      skillsContext,
      `Scenario Question ${questionIndex + 1} of 3.`,
      previousQuestions.length > 0
        ? `Already asked in this interview:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`
        : "",
      "Generate 1 realistic, concrete, production-level engineering scenario or architectural trade-off question fitting this interview focus.",
      "The question must challenge the candidate to make architectural choices, handle scale/concurrency/errors, or diagnose complex issues.",
      "Do NOT ask generic textbook definitions. Ask directly in 2 to 3 sentences maximum.",
      "Return ONLY a JSON object with this exact shape: {\"question\": \"<question text here>\"}.",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await aiService.generate({
        prompt,
        systemInstruction:
          "You are a technical bar-raiser conducting an official mock interview. Ask deep, realistic engineering scenario questions. Output JSON ONLY.",
        temperature: 0.5,
        maxOutputTokens: 256,
      });

      const parsed = parseJsonText(response.text) as any;
      const question =
        parsed?.question || (typeof parsed === "string" ? parsed : null);
      if (typeof question === "string" && question.trim().length > 10) {
        return question.trim();
      }
    } catch (err) {
      logger.warn(
        { error: err, roleTitle, interviewNumber },
        "AI official scenario question generation failed; using fallback"
      );
    }

    const fallbacks = [
      `In a high-concurrency production ${roleTitle} environment, how do you architect distributed state and prevent database connection exhaustion under 10x traffic spikes?`,
      `Describe how you design a resilient retry and circuit-breaking strategy for external API dependencies without causing cascading failures in downstream services.`,
      `When rolling out a critical schema migration with zero downtime on a multi-terabyte dataset, what specific deployment pattern and rollback mechanisms do you establish?`,
    ];
    return fallbacks[questionIndex % fallbacks.length];
  }

  async startOfficialReadinessMockInterview(
    userId: string,
    journey: any,
    roadmap: any,
    interviewNumber: number
  ) {
    let mockInterviewType = MockInterviewType.TECHNICAL;
    let title = "Technical & System Architecture";
    let focus = "Core Technical Concepts, State Management & System Architecture";

    if (interviewNumber === 2) {
      mockInterviewType = MockInterviewType.TECHNICAL;
      title = "Production Problem Solving & Debugging";
      focus = "Production Problem Solving, Concurrency, Latency & Error Recovery";
    } else if (interviewNumber === 3) {
      mockInterviewType = MockInterviewType.MIXED;
      title = "Comprehensive Role Screen & System Scalability";
      focus = "Comprehensive Role Leadership, System Scalability & Architectural Trade-offs";
    }

    let roleTitle = "Software Engineering";
    if (journey.roleId) {
      const role = await CareerRoleModel.findById(journey.roleId);
      if (role) roleTitle = role.name;
    }

    const userSkills = await userSkillRepository.findMany({
      careerJourneyId: journey._id,
      isActive: true,
    });
    const skillCatalogIds = userSkills.map((us) => us.skillCatalogId);
    const skills = await SkillCatalogModel.find({
      _id: { $in: skillCatalogIds },
      isActive: true,
    }).limit(6);
    const skillNames = skills.map((s) => s.name);

    // Concurrency check: resume active session if one exists for this milestone
    const existingActive = await interviewSessionRepository.findOne({
      userId: new Types.ObjectId(userId),
      careerJourneyId: journey._id,
      status: InterviewSessionStatus.IN_PROGRESS,
    });

    if (existingActive) {
      if (
        existingActive.isOfficialReadinessMock &&
        existingActive.mockInterviewNumber === interviewNumber
      ) {
        return this.formatSessionResponse(
          existingActive,
          `${roleTitle} - Interview ${interviewNumber}: ${title}`
        );
      }
      existingActive.status = InterviewSessionStatus.ABANDONED;
      await existingActive.save();
    }

    const questionText = await this.generateOfficialScenarioQuestion(
      roleTitle,
      interviewNumber,
      focus,
      skillNames,
      0,
      []
    );

    const now = appClock.now();

    const session = await interviewSessionRepository.create({
      userId: new Types.ObjectId(userId),
      careerJourneyId: journey._id,
      isOfficialReadinessMock: true,
      mockInterviewNumber: interviewNumber,
      mockInterviewType,
      roadmapId: roadmap._id,
      roleTitle,
      skillCatalogId: skills[0]?._id ?? null,
      status: InterviewSessionStatus.IN_PROGRESS,
      currentQuestionIndex: 0,
      isAwaitingFollowUp: true,
      turns: [
        {
          turnIndex: 0,
          questionIndex: 0,
          turnType: InterviewTurnType.SCENARIO,
          questionText,
          candidateAnswer: null,
          answeredAt: null,
          quickCritique: null,
        },
      ] as any,
      optedInToJourney: true,
      startedAt: now,
    });

    return this.formatSessionResponse(
      session,
      `${roleTitle} - Interview ${interviewNumber}: ${title}`
    );
  }

  async startInterviewSession(userId: string, input: StartInterviewInput) {
    const journey = await this.validateJourneyOwnership(
      userId,
      input.careerJourneyId
    );

    const skillCatalogObjectId = new Types.ObjectId(input.skillCatalogId);

    const hasSkill = await userSkillRepository.findMany({
      careerJourneyId: journey._id,
      skillCatalogId: skillCatalogObjectId,
      isActive: true,
    });

    if (hasSkill.length === 0 && journey.roleId) {
      const roleSkill = await CareerRoleSkillModel.findOne({
        roleId: journey.roleId,
        skillId: skillCatalogObjectId,
      });

      if (!roleSkill) {
        throw new AppError(
          HTTP_STATUS.FORBIDDEN,
          "This skill is not part of your active career journey."
        );
      }
    } else if (hasSkill.length === 0) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        "This skill is not part of your active career journey."
      );
    }

    const skill = await SkillCatalogModel.findById(skillCatalogObjectId);
    if (!skill) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Skill not found.");
    }

    // Concurrency check: resume active session if one already exists for this skill
    const existingActive = await interviewSessionRepository.findOne({
      userId: new Types.ObjectId(userId),
      careerJourneyId: journey._id,
      status: InterviewSessionStatus.IN_PROGRESS,
    });

    if (existingActive) {
      if (
        !existingActive.isOfficialReadinessMock &&
        existingActive.skillCatalogId?.toString() ===
          skillCatalogObjectId.toString()
      ) {
        return this.formatSessionResponse(existingActive, skill.name);
      }
      existingActive.status = InterviewSessionStatus.ABANDONED;
      await existingActive.save();
    }

    const topics = await SkillTopicModel.find({
      skillCatalogId: skillCatalogObjectId,
      isActive: true,
    }).limit(5);

    const questionText = await this.generateScenarioQuestion(
      skill.name,
      topics.map((t) => t.name),
      0,
      []
    );

    const now = appClock.now();

    const session = await interviewSessionRepository.create({
      userId: new Types.ObjectId(userId),
      careerJourneyId: journey._id,
      skillCatalogId: skillCatalogObjectId,
      status: InterviewSessionStatus.IN_PROGRESS,
      currentQuestionIndex: 0,
      isAwaitingFollowUp: true,
      turns: [
        {
          turnIndex: 0,
          questionIndex: 0,
          turnType: InterviewTurnType.SCENARIO,
          questionText,
          candidateAnswer: null,
          answeredAt: null,
          quickCritique: null,
        },
      ] as any,
      optedInToJourney: false,
      startedAt: now,
    });

    return this.formatSessionResponse(session, skill.name);
  }

  async getInterviewSession(
    userId: string,
    careerJourneyIdStr: string,
    sessionIdStr: string
  ) {
    await this.validateJourneyOwnership(userId, careerJourneyIdStr);

    const session = await interviewSessionRepository.findById(
      new Types.ObjectId(sessionIdStr)
    );

    if (!session) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Interview session not found.");
    }

    if (session.userId.toString() !== userId) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, "Access denied to this interview session.");
    }

    let skillName = "Technical Engineering";
    if (session.isOfficialReadinessMock) {
      skillName = `${session.roleTitle || "Role"} - Mock Interview ${session.mockInterviewNumber}`;
    } else if (session.skillCatalogId) {
      const skill = await SkillCatalogModel.findById(session.skillCatalogId);
      if (skill) skillName = skill.name;
    }
    return this.formatSessionResponse(session, skillName);
  }

  async submitInterviewAnswer(
    userId: string,
    sessionIdStr: string,
    input: SubmitAnswerInput
  ) {
    const journey = await this.validateJourneyOwnership(
      userId,
      input.careerJourneyId
    );

    const session = await interviewSessionRepository.findById(
      new Types.ObjectId(sessionIdStr)
    );

    if (!session) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Interview session not found.");
    }

    if (session.userId.toString() !== userId) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, "Access denied to this interview session.");
    }

    if (session.status !== InterviewSessionStatus.IN_PROGRESS) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, "This interview session is already completed.");
    }

    const currentTurn = session.turns[session.turns.length - 1];
    if (!currentTurn) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, "No active question turn in session.");
    }

    const now = appClock.now();
    currentTurn.candidateAnswer = input.candidateAnswer.trim();
    currentTurn.answeredAt = now;

    let skillName = "Technical Engineering";
    if (session.isOfficialReadinessMock) {
      skillName = `${session.roleTitle || "Role"} - Mock Interview ${session.mockInterviewNumber}`;
    } else if (session.skillCatalogId) {
      const skill = await SkillCatalogModel.findById(session.skillCatalogId);
      if (skill) skillName = skill.name;
    }

    if (currentTurn.turnType === InterviewTurnType.SCENARIO) {
      // Step A: Candidate answered the scenario question -> generate targeted follow-up question
      const followUpText = await this.generateFollowUpQuestion(
        skillName,
        currentTurn.questionText,
        currentTurn.candidateAnswer
      );

      session.turns.push({
        turnIndex: session.turns.length,
        questionIndex: session.currentQuestionIndex,
        turnType: InterviewTurnType.FOLLOW_UP,
        questionText: followUpText,
        candidateAnswer: null as any,
        answeredAt: null as any,
        quickCritique: null as any,
      });

      session.isAwaitingFollowUp = false;
      await session.save();

      return this.formatSessionResponse(session, skillName);
    } else {
      // Step B: Candidate answered the follow-up question
      if (session.currentQuestionIndex < 2) {
        // Next scenario question (Q2 or Q3)
        const nextQIndex = session.currentQuestionIndex + 1;
        const previousQuestions = session.turns
          .filter((t) => t.turnType === InterviewTurnType.SCENARIO)
          .map((t) => t.questionText);

        let nextScenarioText: string;
        if (session.isOfficialReadinessMock) {
          let focus = "Core Technical Concepts, State Management & System Architecture";
          if (session.mockInterviewNumber === 2) {
            focus = "Production Problem Solving, Concurrency, Latency & Error Recovery";
          } else if (session.mockInterviewNumber === 3) {
            focus = "Comprehensive Role Leadership, System Scalability & Architectural Trade-offs";
          }

          const userSkills = await userSkillRepository.findMany({
            careerJourneyId: journey._id,
            isActive: true,
          });
          const skillCatalogIds = userSkills.map((us) => us.skillCatalogId);
          const skills = await SkillCatalogModel.find({
            _id: { $in: skillCatalogIds },
            isActive: true,
          }).limit(6);

          nextScenarioText = await this.generateOfficialScenarioQuestion(
            session.roleTitle || "Software Engineering",
            session.mockInterviewNumber || 1,
            focus,
            skills.map((s) => s.name),
            nextQIndex,
            previousQuestions
          );
        } else {
          const topics = await SkillTopicModel.find({
            skillCatalogId: session.skillCatalogId,
            isActive: true,
          }).limit(5);

          nextScenarioText = await this.generateScenarioQuestion(
            skillName,
            topics.map((t) => t.name),
            nextQIndex,
            previousQuestions
          );
        }

        session.currentQuestionIndex = nextQIndex;
        session.isAwaitingFollowUp = true;
        session.turns.push({
          turnIndex: session.turns.length,
          questionIndex: nextQIndex,
          turnType: InterviewTurnType.SCENARIO,
          questionText: nextScenarioText,
          candidateAnswer: null as any,
          answeredAt: null as any,
          quickCritique: null as any,
        });

        await session.save();
        return this.formatSessionResponse(session, skillName);
      } else {
        // All 3 questions and 3 follow-ups complete (6 turns)! Final Evaluation time!
        const evaluation = await this.generateInterviewEvaluation(
          skillName,
          session.turns.map((t) => ({
            questionText: t.questionText,
            candidateAnswer: t.candidateAnswer ?? null,
            turnType: t.turnType,
          }))
        );

        session.evaluation = evaluation;
        session.status = InterviewSessionStatus.COMPLETED;
        session.completedAt = now;

        if (session.isOfficialReadinessMock && session.mockInterviewNumber) {
          session.optedInToJourney = true;
          await session.save();

          // Auto-record official MockInterview record
          const existingMock = await mockInterviewRepository.findByJourneyAndNumber(
            session.careerJourneyId,
            session.mockInterviewNumber
          );

          if (!existingMock) {
            const roadmap =
              session.roadmapId
                ? { _id: session.roadmapId }
                : await roadmapRepository.findLatestByCareerJourneyId(session.careerJourneyId);

            if (roadmap) {
              await mockInterviewRepository.create({
                careerJourneyId: session.careerJourneyId,
                roadmapId: roadmap._id,
                interviewNumber: session.mockInterviewNumber,
                platform: "CareerSaathi AI",
                interviewType: (session.mockInterviewType as any) || MockInterviewType.TECHNICAL,
                overallScore: evaluation.overallScore,
                technicalScore: evaluation.conceptualDepthScore,
                problemSolvingScore: evaluation.conceptualDepthScore,
                communicationScore: evaluation.communicationScore,
                feedback: evaluation.mentorFeedback,
                interviewedAt: session.completedAt,
                status: MockInterviewStatus.COMPLETED,
              });
            }
          }
        } else {
          await session.save();
        }

        // Record evidence
        if (session.skillCatalogId) {
          const primaryTopic = await SkillTopicModel.findOne({
            skillCatalogId: session.skillCatalogId,
          });

          if (primaryTopic) {
            await skillEvidenceRepository.create({
              userId: new Types.ObjectId(userId),
              careerJourneyId: journey._id,
              skillCatalogId: session.skillCatalogId,
              topicId: primaryTopic._id,
              source: SkillEvidenceSource.MOCK_INTERVIEW,
              sourceId: session._id,
              score: evaluation.overallScore,
              confidence: session.isOfficialReadinessMock ? 0.75 : 0.35,
              evidenceText: evaluation.mentorFeedback.slice(0, 300),
              scoringEligible: session.isOfficialReadinessMock,
              observedAt: now,
            });
          }

          // Pre-mission sync: If this interview was taken before any missions started, ensure skill is in pending roadmap
          try {
            await roadmapWorkflowService.syncPendingRoadmapSkills(
              session.careerJourneyId,
              [session.skillCatalogId],
              "Practiced in Technical Interview Workspace prior to journey start"
            );
          } catch (syncErr) {
            logger.warn(
              { error: syncErr, sessionId: session._id },
              "Pre-mission roadmap sync on interview completion skipped or failed"
            );
          }
        }

        return this.formatSessionResponse(session, skillName);
      }
    }
  }

  async setInterviewOptIn(userId: string, sessionIdStr: string, optIn: boolean) {
    const session = await interviewSessionRepository.findById(
      new Types.ObjectId(sessionIdStr)
    );

    if (!session) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Interview session not found.");
    }

    if (session.userId.toString() !== userId) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, "Access denied to this interview session.");
    }

    session.optedInToJourney = optIn;
    await session.save();

    await skillEvidenceRepository.updateScoringEligibleBySource(
      SkillEvidenceSource.MOCK_INTERVIEW,
      session._id,
      optIn
    );

    if (optIn && session.evaluation && session.skillCatalogId) {
      try {
        await roadmapWorkflowService.syncPendingRoadmapSkills(
          session.careerJourneyId,
          [session.skillCatalogId],
          "Opted-in practice technical interview prior to journey start"
        );
      } catch (syncErr) {
        logger.warn(
          { error: syncErr, sessionId: session._id },
          "Pre-mission roadmap sync on interview opt-in skipped or failed"
        );
      }

      const skillCatalogId = session.skillCatalogId;
      const primaryTopic = await SkillTopicModel.findOne({
        skillCatalogId,
      });

      if (primaryTopic) {
        const existingProgress =
          await skillTopicProgressRepository.findOneByTopic(
            session.careerJourneyId,
            skillCatalogId,
            primaryTopic._id
          );

        const questionsAnswered = (existingProgress?.questionsAnswered ?? 0) + 3;
        const isPassed = session.evaluation.overallScore >= 70;
        const correctCount =
          (existingProgress?.correctCount ?? 0) + (isPassed ? 3 : 1);
        const accuracy = Math.round((correctCount / questionsAnswered) * 100);
        const masteryScore = Math.round(
          accuracy * 0.6 +
            session.evaluation.conceptualDepthScore * 0.25 +
            session.evaluation.communicationScore * 0.15
        );

        await skillTopicProgressRepository.upsert(
          session.careerJourneyId,
          skillCatalogId,
          primaryTopic._id,
          {
            questionsAnswered,
            correctCount,
            accuracy,
            masteryScore,
            confidence: 0.45,
            lastAssessedAt: appClock.now(),
          }
        );
      }
    }

    return {
      sessionId: session._id.toString(),
      optedInToJourney: session.optedInToJourney,
    };
  }
}

export const practiceService = new PracticeService();
