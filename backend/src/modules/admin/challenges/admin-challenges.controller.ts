import { Request, Response } from "express";
import { asyncHandler } from "../../../core/middleware/async-handler.js";
import { successResponse } from "../../../core/responses/successResponse.js";
import { AppError } from "../../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../../core/constants/http-status.constants.js";
import { CodingChallengeModel } from "../../practice/coding-challenge.model.js";
import { InterviewRubricModel } from "./interview-rubric.model.js";
import { SkillCatalogModel } from "../../../master-data/skill-catalog/skill-catalog.schema.js";
import { SkillTopicModel } from "../../../master-data/skill-topic/skill-topic.schema.js";
import { ADMIN_MESSAGES } from "../admin.constants.js";

class AdminChallengesController {
  // CHALLENGES
  getChallenges = asyncHandler(async (_req: Request, res: Response) => {
    const challenges = await CodingChallengeModel.find({ isActive: true })
      .populate("skillCatalogId", "name")
      .populate("topicId", "name")
      .lean();

    const formatted = challenges.map((c: any) => ({
      id: c._id.toString(),
      title: c.title,
      slug: c.slug,
      skillCatalogId: c.skillCatalogId?._id?.toString() || c.skillCatalogId?.toString(),
      skillName: c.skillCatalogId?.name || "System Design",
      topicId: c.topicId?._id?.toString() || c.topicId?.toString(),
      topicTitle: c.topicId?.name || "Algorithms",
      roleSlugs: c.roleSlugs || ["full-stack-engineer"],
      difficulty: c.difficulty,
      estimatedMinutes: c.estimatedMinutes || 45,
      problemStatement: c.description,
      starterTemplates: c.starterCode ? { typescript: c.starterCode } : {},
      testCases: (c.testCases || []).map((tc: any) => ({
        id: tc.id || "tc_" + Math.random(),
        name: tc.name,
        inputCode: tc.inputCode,
        expectedOutput: tc.expectedOutput,
        isHidden: Boolean(tc.isHidden),
        explanation: tc.explanation || "",
      })),
      hints: ["Read constraints carefully.", "Consider edge cases."],
      tags: ["Algorithm", "Problem Solving"],
      isActive: c.isActive,
      createdAt: c.createdAt,
    }));

    return successResponse({
      res,
      message: ADMIN_MESSAGES.CHALLENGES_RETRIEVED,
      data: formatted,
    });
  });

  createChallenge = asyncHandler(async (req: Request, res: Response) => {
    const {
      title,
      slug,
      skillCatalogId,
      topicId,
      difficulty,
      estimatedMinutes,
      problemStatement,
      starterTemplates,
      testCases,
      tags,
    } = req.body;

    if (!title || !problemStatement) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, "Title and problem statement are required.");
    }

    let skillId = skillCatalogId;
    let topId = topicId;

    if (!skillId) {
      const anySkill = await SkillCatalogModel.findOne();
      skillId = anySkill?._id;
    }
    if (!topId) {
      const anyTopic = await SkillTopicModel.findOne();
      topId = anyTopic?._id;
    }

    const finalSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]/g, "-");
    const challenge = await CodingChallengeModel.create({
      title,
      slug: finalSlug,
      skillCatalogId: skillId,
      topicId: topId,
      roleSlugs: ["full-stack-engineer", "backend-engineer"],
      difficulty: difficulty || "MEDIUM",
      estimatedMinutes: estimatedMinutes || 45,
      description: problemStatement,
      starterCode: starterTemplates?.typescript || starterTemplates?.javascript || "",
      solutionCode: "",
      testCases: (testCases || []).map((tc: any, idx: number) => ({
        id: tc.id || "tc_" + (idx + 1),
        name: tc.name || `Test Case ${idx + 1}`,
        inputCode: tc.inputCode || "",
        expectedOutput: tc.expectedOutput || "",
        isHidden: Boolean(tc.isHidden),
        explanation: tc.explanation || "",
      })),
      isActive: true,
    } as any);

    return successResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: "Coding challenge published successfully.",
      data: {
        id: (challenge as any)._id.toString(),
        title: (challenge as any).title,
        slug: (challenge as any).slug,
        difficulty: (challenge as any).difficulty,
        estimatedMinutes: (challenge as any).estimatedMinutes,
        problemStatement: (challenge as any).description,
        starterTemplates,
        testCases: (challenge as any).testCases,
        tags: ["Algorithm"],
        isActive: (challenge as any).isActive,
        createdAt: (challenge as any).createdAt,
      },
    });
  });

  deleteChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await CodingChallengeModel.findByIdAndDelete(id);
    return successResponse({ res, message: "Challenge removed.", data: { id } });
  });

  // RUBRICS
  getRubrics = asyncHandler(async (_req: Request, res: Response) => {
    let rubrics = await InterviewRubricModel.find({ isActive: true }).lean();

    if (rubrics.length === 0) {
      // Seed default rubrics
      await InterviewRubricModel.create([
        {
          roleSlug: "full-stack-engineer",
          roleTitle: "Full Stack Engineer",
          tier: "ENTRY",
          personaPrompt:
            "You are an empathetic yet thorough Senior Engineering Team Lead evaluating an entry-level candidate. Probe their understanding of client-server state synchronization, REST status codes, and database normalization.",
          rubricCriteria: [
            { name: "Frontend State & Performance", weight: 30, description: "Ability to explain props, state, render cycles, and optimization." },
            { name: "API & Backend Security", weight: 35, description: "Correct use of HTTP methods, authentication tokens, and error handling." },
            { name: "Problem Solving & Communication", weight: 35, description: "Clarity of thought, asking clarifying questions, and defensive thinking." },
          ],
        },
        {
          roleSlug: "backend-engineer",
          roleTitle: "Backend Engineer",
          tier: "MID",
          personaPrompt:
            "You are a Principal Backend Systems Architect. Rigorously evaluate the candidate's understanding of ACID transactions, distributed locking, index selectivity, and database connection pooling under high load.",
          rubricCriteria: [
            { name: "Database & Concurrency", weight: 40, description: "Transactions, locks, index selectivity, and query explain plans." },
            { name: "Distributed Systems & Reliability", weight: 35, description: "Handling network partitions, idempotency, and retries with jitter." },
            { name: "Code Quality & Clean Architecture", weight: 25, description: "Separation of concerns, repository patterns, and testing." },
          ],
        },
      ]);
      rubrics = await InterviewRubricModel.find({ isActive: true }).lean();
    }

    const formatted = rubrics.map((r: any) => ({
      id: r._id.toString(),
      roleSlug: r.roleSlug,
      roleTitle: r.roleTitle,
      tier: r.tier,
      personaPrompt: r.personaPrompt,
      rubricCriteria: r.rubricCriteria,
      updatedAt: r.updatedAt,
    }));

    return successResponse({
      res,
      message: "Interview rubrics retrieved.",
      data: formatted,
    });
  });

  updateRubric = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { personaPrompt, rubricCriteria } = req.body;

    const rubric = await InterviewRubricModel.findById(id);
    if (!rubric) throw new AppError(HTTP_STATUS.NOT_FOUND, "Rubric not found.");

    if (personaPrompt) rubric.personaPrompt = personaPrompt;
    if (rubricCriteria) rubric.rubricCriteria = rubricCriteria;
    await rubric.save();

    return successResponse({
      res,
      message: "Interview rubric updated successfully.",
      data: {
        id: rubric._id.toString(),
        roleSlug: rubric.roleSlug,
        roleTitle: rubric.roleTitle,
        tier: rubric.tier,
        personaPrompt: rubric.personaPrompt,
        rubricCriteria: rubric.rubricCriteria,
        updatedAt: rubric.updatedAt,
      },
    });
  });
}

export const adminChallengesController = new AdminChallengesController();
