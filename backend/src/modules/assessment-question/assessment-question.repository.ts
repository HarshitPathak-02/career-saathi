import { ClientSession } from 'mongoose';

import {
    CreateAssessmentQuestionData,
    UpdateAssessmentQuestionData,
    AssessmentQuestionDocument,
} from './assessment-question.types.js';

import { AssessmentQuestionModel } from './assessment-question.model.js';
import { CareerRoleCode } from '../career-role/career-role.enums.js';

class AssessmentQuestionRepository {

    async create(
        data: CreateAssessmentQuestionData,
        session?: ClientSession
    ): Promise<AssessmentQuestionDocument> {

        if (session) {
            const [question] =
                await AssessmentQuestionModel.create(
                    [data],
                    { session }
                );

            return question;
        }

        return AssessmentQuestionModel.create(data);
    }

    async findById(
        id: string,
        session?: ClientSession
    ) {
        const query =
            AssessmentQuestionModel.findById(id);

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findAll(
        session?: ClientSession
    ) {

        const query =
            AssessmentQuestionModel.find()
                .sort({
                    createdAt: -1,
                });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findByCareerRoleAndSkill(
        careerRoleCode: CareerRoleCode,
        skillCode: string,
        session?: ClientSession
    ) {

        const query =
            AssessmentQuestionModel.find({
                careerRoleCode,
                skillCode,
                isActive: true,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async updateById(
        id: string,
        data: UpdateAssessmentQuestionData,
        session?: ClientSession
    ) {

        return AssessmentQuestionModel.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
                session,
            }
        );
    }

    async deleteById(
        id: string,
        session?: ClientSession
    ) {

        return AssessmentQuestionModel.findByIdAndDelete(
            id,
            {
                session,
            }
        );
    }

    async findRandomQuestions(
        careerRoleCode: CareerRoleCode,
        skillCode: string,
        limit: number
    ) {
        return AssessmentQuestionModel.aggregate([
            {
                $match: {
                    careerRoleCode,
                    skillCode,
                    isActive: true,
                },
            },
            {
                $sample: {
                    size: limit,
                },
            },
        ]);
    }
    async findRandomByCareerRoleAndSkill(
        careerRoleCode: CareerRoleCode,
        skillCode: string,
        limit: number,
        session?: ClientSession
    ): Promise<AssessmentQuestionDocument[]> {

        const pipeline = [
            {
                $match: {
                    careerRoleCode,
                    skillCode,
                    isActive: true,
                },
            },
            {
                $sample: {
                    size: limit,
                },
            },
        ];

        const aggregate =
            AssessmentQuestionModel.aggregate(pipeline);

        if (session) {
            aggregate.session(session);
        }

        return aggregate.exec();
    }

    async findRandomQuestionsForSkills(
        careerRoleCode: CareerRoleCode,
        skillCodes: string[],
        questionsPerSkill: number,
        session?: ClientSession
    ): Promise<AssessmentQuestionDocument[]> {

        const questions: AssessmentQuestionDocument[] = [];

        for (const skillCode of skillCodes) {

            const skillQuestions =
                await this.findRandomByCareerRoleAndSkill(
                    careerRoleCode,
                    skillCode,
                    questionsPerSkill,
                    session
                );

            questions.push(...skillQuestions);
        }

        return questions;
    }

    async findByIds(
        ids: string[],
        session?: ClientSession
    ): Promise<AssessmentQuestionDocument[]> {

        const query =
            AssessmentQuestionModel.find({
                _id: {
                    $in: ids,
                },
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async countByCareerRoleAndSkill(
        careerRoleCode: CareerRoleCode,
        skillCode: string
    ): Promise<number> {

        return AssessmentQuestionModel.countDocuments({

            careerRoleCode,

            skillCode,

            isActive: true,

        });
    }
}

export const assessmentQuestionRepository =
    new AssessmentQuestionRepository();