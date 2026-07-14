import { ClientSession } from 'mongoose';

import {
    AssessmentSkillResultDocument,
    CreateAssessmentSkillResultData,
} from './assessment-skill-result.types.js';

import { AssessmentSkillResultModel } from './assessment-skill-result.model.js';

class AssessmentSkillResultRepository {

    async createMany(
        data: CreateAssessmentSkillResultData[],
        session?: ClientSession
    ): Promise<AssessmentSkillResultDocument[]> {

        if (session) {
            return AssessmentSkillResultModel.insertMany(
                data,
                { session }
            );
        }

        return AssessmentSkillResultModel.insertMany(
            data
        );
    }

    async findByAssessmentId(
        assessmentId: string,
        session?: ClientSession
    ) {

        const query =
            AssessmentSkillResultModel.find({
                assessmentId,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findByAssessmentAndSkill(
        assessmentId: string,
        skillCode: string,
        session?: ClientSession
    ) {

        const query =
            AssessmentSkillResultModel.findOne({
                assessmentId,
                skillCode,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }
}

export const assessmentSkillResultRepository =
    new AssessmentSkillResultRepository();