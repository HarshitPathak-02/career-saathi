import { Types } from "mongoose";

import { AppError } from "../../core/errors/app-error.js";

import {
    skillProgressRepository,
} from "./skill-progress.repository.js";

import {
    SkillProgressMessages,
} from "./skill-progress.messages.js";

import {
    CreateSkillProgressDTO,
    SkillProgressPlanningData,
} from "./skill-progress.types.js";

class SkillProgressService {

    async createSkillProgress(
        data: CreateSkillProgressDTO
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
            await skillProgressRepository.findLatestByUserSkill(
                data.userSkillId
            );

        const improvementPercentage =
            this.calculateImprovement(
                latestProgress?.percentage ?? null,
                percentage
            );

        return skillProgressRepository.create({
            ...data,
            percentage,
            improvementPercentage,
        });

    }

    async createManySkillProgress(
        skills: CreateSkillProgressDTO[]
    ) {

        const createdProgress = [];

        for (const skill of skills) {

            const progress =
                await this.createSkillProgress(
                    skill
                );

            createdProgress.push(progress);

        }

        return createdProgress;

    }

    async getSkillProgressById(
        id: Types.ObjectId
    ) {

        const progress =
            await skillProgressRepository.findById(
                id
            );

        if (!progress) {
            throw new AppError(
                404,
                SkillProgressMessages.NOT_FOUND
            );
        }

        return progress;

    }

    async getHistoryByUserSkill(
        userSkillId: Types.ObjectId
    ) {

        return skillProgressRepository.findHistoryByUserSkill(
            userSkillId
        );

    }

    async getAssessmentProgress(
        assessmentId: Types.ObjectId
    ) {

        return skillProgressRepository.findByAssessment(
            assessmentId
        );

    }

    private validateMarks(
        obtainedMarks: number,
        totalMarks: number
    ) {

        if (obtainedMarks > totalMarks) {
            throw new AppError(
                400,
                SkillProgressMessages.INVALID_MARKS
            );
        }

    }

    private calculatePercentage(
        obtainedMarks: number,
        totalMarks: number
    ) {

        return Number(
            (
                (obtainedMarks / totalMarks) *
                100
            ).toFixed(2)
        );

    }

    private calculateImprovement(
        previousPercentage: number | null,
        currentPercentage: number
    ): number | null {

        if (previousPercentage === null) {
            return null;
        }

        return Number(
            (
                currentPercentage -
                previousPercentage
            ).toFixed(2)
        );
    }

    async getSkillProgressByAssessment(
        assessmentId: string
    ) {

        return this.getAssessmentProgress(
            new Types.ObjectId(
                assessmentId
            )
        );

    }

    async getSkillPlanningData(
        assessmentId: string,
    ): Promise<SkillProgressPlanningData[]> {

        const progress =
            await this.getAssessmentProgress(
                new Types.ObjectId(assessmentId),
            );

        return progress.map(item => ({

            userSkillId: item.userSkillId._id,

            skillCatalogId:
                item.userSkillId.skillCatalogId._id,

            skillName:
                item.userSkillId.skillCatalogId.name,

            percentage:
                item.percentage,

        }));

    }
}

export const skillProgressService =
    new SkillProgressService();