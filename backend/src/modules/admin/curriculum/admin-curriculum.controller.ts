import { Request, Response } from "express";
import { asyncHandler } from "../../../core/middleware/async-handler.js";
import { successResponse } from "../../../core/responses/successResponse.js";
import { AppError } from "../../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../../core/constants/http-status.constants.js";
import { CareerDomainModel } from "../../../master-data/career-domain/career-domain.schema.js";
import { CareerRoleModel } from "../../../master-data/career-role/career-role.schema.js";
import { SkillCatalogModel } from "../../../master-data/skill-catalog/skill-catalog.schema.js";
import { SkillTopicModel } from "../../../master-data/skill-topic/skill-topic.schema.js";
import { ADMIN_MESSAGES } from "../admin.constants.js";

class AdminCurriculumController {
  // DOMAINS
  getDomains = asyncHandler(async (_req: Request, res: Response) => {
    const domains = await CareerDomainModel.find().lean();
    const roles = await CareerRoleModel.find({ isActive: true }).lean();

    const roleCountMap = new Map<string, number>();
    for (const r of roles) {
      const dId = r.domainId?.toString();
      roleCountMap.set(dId, (roleCountMap.get(dId) || 0) + 1);
    }

    const formatted = domains.map((d: any) => ({
      id: d._id.toString(),
      name: d.name,
      code: d.slug?.toUpperCase() || "DOMAIN",
      description: d.description || "",
      isActive: d.isActive ?? true,
      roleCount: roleCountMap.get(d._id.toString()) || 0,
      createdAt: d.createdAt,
    }));

    return successResponse({
      res,
      message: ADMIN_MESSAGES.CURRICULUM_RETRIEVED,
      data: formatted,
    });
  });

  createDomain = asyncHandler(async (req: Request, res: Response) => {
    const { name, code, description, isActive } = req.body;
    if (!name) throw new AppError(HTTP_STATUS.BAD_REQUEST, "Name is required.");

    const slug = (code || name).toLowerCase().replace(/[^a-z0-9]/g, "-");
    const domain = await CareerDomainModel.create({
      name,
      slug,
      description: description || "",
      isActive: isActive ?? true,
    });

    return successResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: "Career Domain created successfully.",
      data: {
        id: domain._id.toString(),
        name: domain.name,
        code: domain.slug.toUpperCase(),
        description: domain.description,
        isActive: domain.isActive,
        roleCount: 0,
        createdAt: domain.createdAt,
      },
    });
  });

  deleteDomain = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await CareerDomainModel.findByIdAndDelete(id);
    return successResponse({
      res,
      message: "Career Domain deleted.",
      data: { id },
    });
  });

  // ROLES
  getRoles = asyncHandler(async (_req: Request, res: Response) => {
    const roles = await CareerRoleModel.find()
      .populate("domainId", "name slug")
      .lean();

    const formatted = roles.map((r: any) => ({
      id: r._id.toString(),
      domainId: r.domainId?._id?.toString() || r.domainId?.toString(),
      domainName: r.domainId?.name || "Software Engineering",
      title: r.name,
      slug: r.slug,
      description: r.description || "",
      seniorityTier: "ENTRY",
      coreSkillIds: [],
      isActive: r.isActive ?? true,
      createdAt: r.createdAt,
    }));

    return successResponse({
      res,
      message: "Career roles retrieved.",
      data: formatted,
    });
  });

  createRole = asyncHandler(async (req: Request, res: Response) => {
    const { title, slug, domainId, description, isActive } = req.body;
    if (!title || !domainId) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, "Title and domainId are required.");
    }

    const finalSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]/g, "-");
    const role = await CareerRoleModel.create({
      name: title,
      slug: finalSlug,
      domainId,
      description: description || "",
      isActive: isActive ?? true,
    });

    const domain = await CareerDomainModel.findById(domainId).lean();

    return successResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: "Career Role created successfully.",
      data: {
        id: role._id.toString(),
        domainId: role.domainId.toString(),
        domainName: domain?.name || "Software Engineering",
        title: role.name,
        slug: role.slug,
        description: role.description,
        seniorityTier: "ENTRY",
        coreSkillIds: [],
        isActive: role.isActive,
        createdAt: role.createdAt,
      },
    });
  });

  deleteRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await CareerRoleModel.findByIdAndDelete(id);
    return successResponse({ res, message: "Role deleted.", data: { id } });
  });

  // SKILLS
  getSkills = asyncHandler(async (_req: Request, res: Response) => {
    const skills = await SkillCatalogModel.find().lean();
    const topics = await SkillTopicModel.find().lean();

    const topicCountMap = new Map<string, number>();
    for (const t of topics) {
      const sId = t.skillCatalogId?.toString();
      topicCountMap.set(sId, (topicCountMap.get(sId) || 0) + 1);
    }

    const formatted = skills.map((s: any) => ({
      id: s._id.toString(),
      name: s.name,
      slug: s.slug,
      category: s.category || "TECHNICAL",
      difficulty: s.difficulty || "INTERMEDIATE",
      description: s.description || "",
      topicCount: topicCountMap.get(s._id.toString()) || 0,
      isActive: true,
    }));

    return successResponse({
      res,
      message: "Skill catalog retrieved.",
      data: formatted,
    });
  });

  createSkill = asyncHandler(async (req: Request, res: Response) => {
    const { name, slug, category, difficulty, description } = req.body;
    if (!name) throw new AppError(HTTP_STATUS.BAD_REQUEST, "Skill name is required.");

    const finalSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]/g, "-");
    const skill = await SkillCatalogModel.create({
      name,
      slug: finalSlug,
      category: category || "TECHNICAL",
      difficulty: difficulty || "INTERMEDIATE",
      description: description || "",
    });

    return successResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: "Skill created successfully.",
      data: {
        id: skill._id.toString(),
        name: skill.name,
        slug: skill.slug,
        category: skill.category,
        difficulty: skill.difficulty,
        description: skill.description,
        topicCount: 0,
        isActive: true,
      },
    });
  });

  // TOPICS
  getTopics = asyncHandler(async (_req: Request, res: Response) => {
    const topics = await SkillTopicModel.find()
      .populate("skillCatalogId", "name")
      .lean();

    const formatted = topics.map((t: any) => ({
      id: t._id.toString(),
      skillId: t.skillCatalogId?._id?.toString() || t.skillCatalogId?.toString(),
      skillName: t.skillCatalogId?.name || "Technical Competency",
      title: t.name,
      slug: t.slug,
      documentationUrl: "",
      summary: t.description || "",
    }));

    return successResponse({
      res,
      message: "Skill topics retrieved.",
      data: formatted,
    });
  });

  createTopic = asyncHandler(async (req: Request, res: Response) => {
    const { title, slug, skillId, summary, documentationUrl } = req.body;
    if (!title || !skillId) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, "Title and skillId are required.");
    }

    const finalSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]/g, "-");
    const topic = await SkillTopicModel.create({
      name: title,
      slug: finalSlug,
      skillCatalogId: skillId,
      description: summary || "",
      displayOrder: 1,
    });

    const skill = await SkillCatalogModel.findById(skillId).lean();

    return successResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: "Topic created successfully.",
      data: {
        id: topic._id.toString(),
        skillId: topic.skillCatalogId.toString(),
        skillName: skill?.name || "Technical Competency",
        title: topic.name,
        slug: topic.slug,
        documentationUrl: documentationUrl || "",
        summary: topic.description,
      },
    });
  });
}

export const adminCurriculumController = new AdminCurriculumController();
