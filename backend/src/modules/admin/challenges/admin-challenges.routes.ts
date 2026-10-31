import { Router } from "express";
import { adminChallengesController } from "./admin-challenges.controller.js";
import { authenticate } from "../../../core/middleware/authenticate.middleware.js";
import { authorize } from "../../../core/middleware/authorize.middleware.js";
import { UserRole } from "../../users/index.js";

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN));

// Coding Challenges
router.get("/challenges", adminChallengesController.getChallenges);
router.post("/challenges", adminChallengesController.createChallenge);
router.delete("/challenges/:id", adminChallengesController.deleteChallenge);

// Interview Rubrics
router.get("/interview-rubrics", adminChallengesController.getRubrics);
router.patch("/interview-rubrics/:id", adminChallengesController.updateRubric);

export default router;
