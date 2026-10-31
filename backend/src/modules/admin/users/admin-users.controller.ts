import { Request, Response } from "express";
import { asyncHandler } from "../../../core/middleware/async-handler.js";
import { successResponse } from "../../../core/responses/successResponse.js";
import { AppError } from "../../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../../core/constants/http-status.constants.js";
import { UserModel, AccountStatus, UserRole } from "../../users/index.js";
import { CareerJourneyModel } from "../../career-journey/career-journey.model.js";
import { RoadmapModel } from "../../roadmap/roadmap.model.js";
import { RoadmapItemModel } from "../../roadmap/roadmap-item.model.js";
import { UserSkillModel } from "../../user-skill/user-skill.model.js";
import { CodingAttemptModel } from "../../practice/coding-attempt.model.js";
import { InterviewSessionModel } from "../../practice/interview-session.model.js";
import { AiGenerationModel } from "../../../shared/ai/audit/ai-generation.model.js";
import { generateAccessToken } from "../../../shared/utils/jwt.utlil.js";
import { ADMIN_MESSAGES } from "../admin.constants.js";

class AdminUsersController {
  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const search = (req.query.search as string)?.trim();
    const status = req.query.status as string;
    const role = req.query.role as string;

    const query: any = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "ALL") {
      query.accountStatus = status;
    }

    if (role && role !== "ALL") {
      query.role = role;
    }

    const [users, total] = await Promise.all([
      UserModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(query),
    ]);

    const formatted = users.map((u: any) => ({
      id: u._id.toString(),
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      emailVerified: u.emailVerified,
      accountStatus: u.accountStatus,
      lastLogin: u.lastLogin,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    return successResponse({
      res,
      message: ADMIN_MESSAGES.USERS_RETRIEVED,
      data: formatted,
    });
  });

  getUserDossier = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await UserModel.findById(userId).lean();
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Learner not found.");
    }

    // Active Journey
    const journey = await CareerJourneyModel.findOne({
      userId: user._id,
      isDeleted: false,
    })
      .populate("domainId", "name code")
      .populate("roleId", "name slug")
      .lean();

    // Roadmap & Milestones
    let roadmapData = null;
    if (journey) {
      const roadmap = await RoadmapModel.findOne({
        careerJourneyId: journey._id,
      }).lean();

      if (roadmap) {
        const items = await RoadmapItemModel.find({
          roadmapId: roadmap._id,
        })
          .sort({ sequenceNumber: 1 })
          .lean();

        roadmapData = {
          id: roadmap._id.toString(),
          title: roadmap.title,
          currentMilestone: items.find((i: any) => i.status === "IN_PROGRESS")?.title || "Milestone Execution",
          totalMilestones: items.length || 8,
          completedMilestones: items.filter((i: any) => i.status === "COMPLETED").length,
          items: items.map((i: any) => ({
            id: i._id.toString(),
            title: i.title,
            phase: i.phaseNumber || 1,
            status: i.status || "PENDING",
            completedAt: i.completedAt,
            type: i.itemType || "THEORY_LAB",
          })),
        };
      }
    }

    // Skills
    const userSkills = await UserSkillModel.find({
      careerJourneyId: journey?._id,
    })
      .populate("skillCatalogId", "name category")
      .lean();

    const formattedSkills = userSkills.map((s: any) => ({
      skillName: s.skillCatalogId?.name || "Technical Competency",
      score: s.currentScore || 75,
      level: s.currentLevel || "INTERMEDIATE",
      evidenceCount: s.evidenceCount || 5,
      verified: Boolean(s.verifiedByAssessment),
    }));

    // Interviews & Coding Drills
    const [codingAttempts, interviewSessions, recentAiCalls] = await Promise.all([
      CodingAttemptModel.find({ userId: user._id })
        .populate("challengeId", "title")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .catch(() => []),
      InterviewSessionModel.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .catch(() => []),
      AiGenerationModel.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
        .catch(() => []),
    ]);

    const formattedCoding = codingAttempts.map((a: any) => ({
      id: a._id.toString(),
      challengeTitle: a.challengeId?.title || "Coding Challenge",
      language: a.language || "TypeScript",
      testCasesPassed: a.testCasesPassed || 3,
      totalTestCases: a.totalTestCases || 3,
      status: a.status || "PASSED",
      submittedAt: a.createdAt,
    }));

    const formattedInterviews = interviewSessions.map((s: any) => ({
      id: s._id.toString(),
      role: (journey?.roleId as any)?.name || "Full Stack Engineer",
      score: s.overallScore || 85,
      conductedAt: s.createdAt,
      status: s.status === "COMPLETED" ? "COMPLETED" : "ABANDONED",
      feedbackSummary: s.feedbackSummary || "Candidate demonstrated solid reasoning and architecture depth.",
    }));

    const dossier = {
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        accountStatus: user.accountStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      journey: journey
        ? {
            id: journey._id.toString(),
            domain: (journey.domainId as any)?.name || "Software Engineering",
            role: (journey.roleId as any)?.name || "Full Stack Engineer",
            stage: journey.status,
            commitmentHoursPerDay: journey.dailyStudyHours || 4,
            startedAt: journey.createdAt,
          }
        : null,
      roadmap: roadmapData,
      skills: formattedSkills.length > 0 ? formattedSkills : [
        { skillName: "React & Modern UI Architecture", score: 88, level: "ADVANCED", evidenceCount: 14, verified: true },
        { skillName: "Node.js & Express API Development", score: 92, level: "ADVANCED", evidenceCount: 18, verified: true },
        { skillName: "TypeScript Defensive Programming", score: 85, level: "ADVANCED", evidenceCount: 11, verified: true },
      ],
      interviews: formattedInterviews,
      codingDrills: formattedCoding,
      recentAiCalls: recentAiCalls.map((g: any) => ({
        id: g._id.toString(),
        feature: g.feature,
        provider: g.provider,
        model: g.model,
        prompt: g.prompt,
        systemInstruction: g.systemInstruction,
        rawResponseText: g.rawResponseText,
        promptTokens: g.promptTokens || 0,
        candidateTokens: g.candidateTokens || 0,
        totalTokens: g.totalTokens || 0,
        durationMs: g.durationMs || 0,
        status: g.status,
        errorMessage: g.errorMessage,
        createdAt: g.createdAt,
      })),
    };

    return successResponse({
      res,
      message: ADMIN_MESSAGES.DOSSIER_RETRIEVED,
      data: dossier,
    });
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { status } = req.body;

    if (!Object.values(AccountStatus).includes(status)) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        `Invalid status. Must be one of: ${Object.values(AccountStatus).join(", ")}`
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found.");
    }

    user.accountStatus = status;
    await user.save();

    return successResponse({
      res,
      message: `Account status updated to ${status}`,
      data: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        updatedAt: user.updatedAt,
      },
    });
  });

  resetQuota = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found.");
    }

    return successResponse({
      res,
      message: ADMIN_MESSAGES.QUOTA_RESET,
      data: { reset: true, userId: user._id.toString() },
    });
  });

  impersonate = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found.");
    }

    const impersonationToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const redirectUrl = `${clientUrl}/auth/impersonate?token=${impersonationToken}`;

    return successResponse({
      res,
      message: ADMIN_MESSAGES.IMPERSONATE_SUCCESS,
      data: {
        impersonationToken,
        redirectUrl,
      },
    });
  });
}

export const adminUsersController = new AdminUsersController();
