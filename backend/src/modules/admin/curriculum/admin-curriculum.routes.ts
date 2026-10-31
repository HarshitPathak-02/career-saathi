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

// Skills
router.get("/skills", adminCurriculumController.getSkills);
router.post("/skills", adminCurriculumController.createSkill);

// Topics
router.get("/topics", adminCurriculumController.getTopics);
router.post("/topics", adminCurriculumController.createTopic);

export default router;
