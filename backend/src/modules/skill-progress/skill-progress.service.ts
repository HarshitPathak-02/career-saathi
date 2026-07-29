import {
    ClientSession,
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";
import { CreateSkillProgressDTO, SkillProgressMessages, SkillProgressPlanningData, skillProgressRepository } from "./index.js";



class SkillProgressService {

    async createSkillProgress(
        data: CreateSkillProgressDTO,
        session?: ClientSession
    ) {

        this.validateMarks(
            data.obtainedMarks,
            data.totalMarks
        );

        const percentage =
            this.calculatePercentage(
                data.obtainedMarks,
                data.totalMarks
            );

        const latestProgress =
            await skillProgressRepository
                .findLatestByUserSkill(
                    data.userSkillId,
                    session
                );

        const improvementPercentage =
            this.calculateImprovement(
                latestProgress?.percentage ??
                null,
                percentage
            );

        return skillProgressRepository.create(
            {
                ...data,
                percentage,
                improvementPercentage,
            },
            session
        );
    }

    async createManySkillProgress(
        skills: CreateSkillProgressDTO[],
        session?: ClientSession
    ) {

        const createdProgress = [];

        for (const skill of skills) {

            const progress =
                await this.createSkillProgress(
                    skill,
                    session
                );

            createdProgress.push(
                progress
            );
        }

        return createdProgress;
    }

    async getSkillProgressById(
        id: Types.ObjectId,
        session?: ClientSession
    ) {

        const progress =
            await skillProgressRepository
                .findById(
                    id,
                    session
                );

        if (!progress) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                SkillProgressMessages.NOT_FOUND
            );
        }

        return progress;
    }

    async getHistoryByUserSkill(
        userSkillId: Types.ObjectId,
        session?: ClientSession
    ) {

        return skillProgressRepository
            .findHistoryByUserSkill(
                userSkillId,
                session
            );
    }

    async getAssessmentProgress(
        assessmentId: Types.ObjectId,
        session?: ClientSession
    ) {

        return skillProgressRepository
            .findByAssessment(
                assessmentId,
                session
            );
    }

    async getSkillProgressByAssessment(
        assessmentId: string,
        session?: ClientSession
    ) {

        return this.getAssessmentProgress(
            new Types.ObjectId(
                assessmentId
            ),
            session
        );
    }

    async getSkillPlanningData(
        assessmentId: string,
        session?: ClientSession
    ): Promise<
        SkillProgressPlanningData[]
    > {

        const progress =
            await this.getAssessmentProgress(
                new Types.ObjectId(
                    assessmentId
                ),
                session
            );

        return progress.map(
            (item) => ({
                userSkillId:
                    item.userSkillId._id,

                skillCatalogId:
                    item.userSkillId
                        .skillCatalogId._id,

                skillName:
                    item.userSkillId
                        .skillCatalogId.name,

                percentage:
                    item.percentage,
            })
        );
    }

    private validateMarks(
        obtainedMarks: number,
        totalMarks: number
    ): void {

        if (
            !Number.isFinite(obtainedMarks) ||
            !Number.isFinite(totalMarks) ||
            obtainedMarks < 0 ||
            totalMarks <= 0 ||
            obtainedMarks > totalMarks
        ) {
            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                SkillProgressMessages.INVALID_MARKS
            );
        }
    }

    private calculatePercentage(
        obtainedMarks: number,
        totalMarks: number
    ): number {

        return Number(
            (
                (
                    obtainedMarks /
                    totalMarks
                ) *
                100
            ).toFixed(2)
        );
    }

    private calculateImprovement(
        previousPercentage: number | null,
        currentPercentage: number
    ): number | null {

        if (
            previousPercentage === null
        ) {
            return null;
        }

        return Number(
            (
                currentPercentage -
                previousPercentage
            ).toFixed(2)
        );
    }
}

export const skillProgressService =
    new SkillProgressService();