import { Router } from "express";

import { lookupController } from "./lookup.controller.js";

import { authenticate } from "../../core/middleware/authenticate.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";

import {
    domainIdParamSchema,
    roleIdParamSchema,
} from "./lookup.validation.js";

const router = Router();

router.use(authenticate);

router.get(
    "/career-domains",
    lookupController.getCareerDomains
);

router.get(
    "/career-domains/:domainId/roles",
    validateRequest({
        params: domainIdParamSchema,
    }),
    lookupController.getCareerRolesByDomain
);

router.get(
    "/career-roles/:roleId/skills",
    validateRequest({
        params: roleIdParamSchema,
    }),
    lookupController.getCareerRoleSkills
);

export default router;