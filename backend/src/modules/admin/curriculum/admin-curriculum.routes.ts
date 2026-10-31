import { Router } from "express";
import { adminCurriculumController } from "./admin-curriculum.controller.js";
import { authenticate } from "../../../core/middleware/authenticate.middleware.js";
import { authorize } from "../../../core/middleware/authorize.middleware.js";
import { UserRole } from "../../users/index.js";

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN));

// Domains
router.get("/domains", adminCurriculumController.getDomains);
router.post("/domains", adminCurriculumController.createDomain);
router.delete("/domains/:id", adminCurriculumController.deleteDomain);

// Roles
router.get("/roles", adminCurriculumController.getRoles);
router.post("/roles", adminCurriculumController.createRole);
router.delete("/roles/:id", adminCurriculumController.deleteRole);

// Role Skills Mapping (Track Builder)
router.get("/roles/:roleId/skills", adminCurriculumController.getRoleSkills);
router.post("/roles/:roleId/skills", adminCurriculumController.addSkillToRole);
router.delete("/roles/:roleId/skills/:skillId", adminCurriculumController.removeSkillFromRole);
router.patch("/roles/:roleId/skills/:skillId", adminCurriculumController.updateRoleSkill);

// Skills
router.get("/skills", adminCurriculumController.getSkills);
router.post("/skills", adminCurriculumController.createSkill);

// Topics
router.get("/topics", adminCurriculumController.getTopics);
router.post("/topics", adminCurriculumController.createTopic);

export default router;
