import mongoose from 'mongoose';

import { env } from '../config/env.js';

import { AssessmentQuestionModel } from '../modules/assessment-question/assessment-question.model.js';

import { backendDeveloperQuestions } from '../shared/data/assessment-questions/backend-developer.questions.js';

async function seed() {

    await mongoose.connect(
        env.MONGODB_URI
    );

    await AssessmentQuestionModel.deleteMany({});

    await AssessmentQuestionModel.insertMany([
        ...backendDeveloperQuestions,
    ]);

    console.log(
        'Assessment questions seeded successfully.'
    );

    await mongoose.disconnect();
}

seed().catch(console.error);