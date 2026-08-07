import { Types } from "mongoose";

import { lookupRepository } from "./lookup.repository.js";
import * as LookupMapper from "./lookup.mapper.js";

import { AppError } from "../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";

export class LookupService {

    async getCareerDomains() {

        const domains =
            await lookupRepository.getCareerDomains();

        return domains.map(
            LookupMapper.toCareerDomainDto
        );
    }

    async getCareerRolesByDomain(
        domainId: string
    ) {

        const domainObjectId =
            new Types.ObjectId(domainId);

        const domains =
            await lookupRepository.getCareerDomains();

        const domainExists =
            domains.some(
                domain =>
                    domain._id.equals(domainObjectId)
            );

        if (!domainExists) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career domain not found."
            );
        }

        const roles =
            await lookupRepository.getCareerRolesByDomain(
                domainObjectId
            );

        return roles.map(
            LookupMapper.toCareerRoleDto
        );
    }

    async getCareerRoleSkills(
        roleId: string
    ) {

        const roleObjectId =
            new Types.ObjectId(roleId);

        const role =
            await lookupRepository.getCareerRolesByDomain(
                roleObjectId as never
            );

        if (!role) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career role not found."
            );
        }

        const skills =
            await lookupRepository.getCareerRoleSkills(
                roleObjectId
            );

        return skills.map(
            LookupMapper.toCareerRoleSkillDto
        );
    }

}

export const lookupService =
    new LookupService();