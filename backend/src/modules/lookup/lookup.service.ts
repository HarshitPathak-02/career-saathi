import { Types } from "mongoose";

import { lookupRepository } from "./lookup.repository.js";
import * as LookupMapper from "./lookup.mapper.js";

import { AppError } from "../../core/errors/app-error.js";

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
                404,
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

        /**
         * We only want to know whether
         * the role exists.
         *
         * We'll improve this after adding
         * findRoleById() to repository.
         */

        if (!role) {
            throw new AppError(
                404,
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