import { Request, Response } from "express";

import { lookupService } from "./lookup.service.js";

import {
    DomainIdParamDto,
    RoleIdParamDto,
} from "./lookup.types.js";

import { asyncHandler } from "../../core/middleware/async-handler.js";
import { LOOKUP_MESSAGES } from "./lookup.constants.js";

export class LookupController {

    getCareerDomains = asyncHandler(
        async (_req: Request, res: Response) => {

            const domains =
                await lookupService.getCareerDomains();

            return res.status(200).json({
                success: true,
                message: LOOKUP_MESSAGES.CAREER_DOMAINS_FETCHED,
                data: domains,
            });
        }
    );

    getCareerRolesByDomain = asyncHandler(
        async (req: Request, res: Response) => {

            const { domainId } =
                req.params as DomainIdParamDto;

            const roles =
                await lookupService.getCareerRolesByDomain(
                    domainId
                );

            return res.status(200).json({
                success: true,
                message: LOOKUP_MESSAGES.CAREER_ROLES_FETCHED,
                data: roles,
            });
        }
    );

    getCareerRoleSkills = asyncHandler(
        async (req: Request, res: Response) => {

            const { roleId } =
                req.params as RoleIdParamDto;

            const skills =
                await lookupService.getCareerRoleSkills(
                    roleId
                );

            return res.status(200).json({
                success: true,
                message: LOOKUP_MESSAGES.CAREER_ROLE_SKILLS_FETCHED,
                data: skills,
            });
        }
    );

}

export const lookupController =
    new LookupController();