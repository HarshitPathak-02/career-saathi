import { Types } from "mongoose";

import { AppError } from "../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";

import { appClock } from "../../shared/time/app-clock.js";
import { executeTransaction } from "../../shared/utils/transaction.util.js";

import { skillCatalogRepository } from "../../master-data/skill-catalog/index.js";

import {
    careerJourneyRepository,
} from "../career-journey/career-journey.repository.js";

import { userSkillService } from "../user-skill/user-skill.service.js";
import { roadmapWorkflowService } from "../roadmap/roadmap-workflow.service.js";

import { ResumeStatus } from "./resume.enums.js";
import { ResumeMapper } from "./resume.mapper.js";
import { resumeRepository } from "./resume.repository.js";

import type { ResumeResponse } from "./resume.types.js";

export class ResumeConfirmationService {
    async confirmSkills(
        userId: string,
        resumeId: string,
        skillCatalogIds: Types.ObjectId[]
    ): Promise<ResumeResponse> {
        const userObjectId = new Types.ObjectId(
            userId
        );

        const resumeObjectId = new Types.ObjectId(
            resumeId
        );

        const resume =
            await resumeRepository.findByIdAndUserId(
                userObjectId,
                resumeObjectId
            );

        if (!resume) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Resume not found."
            );
        }

        if (
            resume.status !== ResumeStatus.ANALYZED ||
            !resume.analysis
        ) {
            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Analyze the resume before confirming skills."
            );
        }

        const analyzedSkillIds = new Set(
            resume.analysis.skills.flatMap(
                (skill) =>
                    skill.matched &&
                    skill.skillCatalogId
                        ? [
                            skill.skillCatalogId.toString(),
                        ]
                        : []
            )
        );

        const hasUnmatchedSelection =
            skillCatalogIds.some(
                (skillCatalogId) =>
                    !analyzedSkillIds.has(
                        skillCatalogId.toString()
                    )
            );

        if (hasUnmatchedSelection) {
            throw new AppError(
                HTTP_STATUS.UNPROCESSABLE_ENTITY,
                "One or more selected skills were not found in this resume."
            );
        }

        const catalogSkills =
            await skillCatalogRepository.findActiveByIds(
                skillCatalogIds
            );

        if (
            catalogSkills.length !==
            skillCatalogIds.length
        ) {
            throw new AppError(
                HTTP_STATUS.UNPROCESSABLE_ENTITY,
                "One or more selected skills are not available."
            );
        }

        const careerJourney =
            await careerJourneyRepository
                .findOne({
                    _id:
                        resume.careerJourneyId,
                });

        if (!careerJourney) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }

        const existingUserSkills =
            await userSkillService
                .getUserSkills(
                    resume.careerJourneyId
                        .toString()
                );

        const selectedSkillIdSet =
            new Set(
                existingUserSkills
                    .filter(
                        (userSkill) =>
                            userSkill
                                .selectedByUser
                    )
                    .map(
                        (userSkill) =>
                            userSkill
                                .skillCatalogId
                                .toString()
                    )
            );

        const newSkillCatalogIds =
            skillCatalogIds.filter(
                (skillCatalogId) =>
                    !selectedSkillIdSet.has(
                        skillCatalogId
                            .toString()
                    )
            );

        return executeTransaction(
            async (session) => {
                await userSkillService
                    .ensureUserSkills(
                        resume.careerJourneyId
                            .toString(),
                        skillCatalogIds,
                        session
                    );

                await roadmapWorkflowService.syncPendingRoadmapSkills(
                    careerJourney._id,
                    skillCatalogIds,
                    "Confirmed from resume prior to journey start",
                    session
                );

                const updatedResume =
                    await resumeRepository
                        .updateConfirmation(
                            resumeObjectId,
                            userObjectId,
                            {
                                skillCatalogIds,
                                confirmedAt:
                                    appClock.now(),
                            },
                            session
                        );

                if (!updatedResume) {
                    throw new AppError(
                        HTTP_STATUS.NOT_FOUND,
                        "Resume not found."
                    );
                }

                const response =
                    ResumeMapper.toResponse(
                        updatedResume
                    );

                if (response.confirmation) {
                    response.confirmation
                        .newSkillCatalogIds =
                        newSkillCatalogIds.map(
                            (skillCatalogId) =>
                                skillCatalogId
                                    .toString()
                        );
                }

                return response;
            }
        );
    }
}

export const resumeConfirmationService =
    new ResumeConfirmationService();
