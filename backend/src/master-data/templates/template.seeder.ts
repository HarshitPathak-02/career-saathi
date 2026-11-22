import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { config } from "dotenv";

import { CareerRoleModel } from "../career-role/career-role.schema.js";
import { SkillCatalogModel } from "../skill-catalog/skill-catalog.schema.js";
import { SkillTopicModel } from "../skill-topic/skill-topic.schema.js";
import { MasterRoadmapTemplateModel } from "../../modules/roadmap/master-roadmap-template.model.js";
import { QuestionModel } from "../../modules/assessment/question.model.js";
import { buildQuestionContentHash } from "../../modules/assessment/question.validator.js";
import {
    QuestionDifficulty,
    QuestionSource,
    QuestionStatus,
    QuestionType,
} from "../../modules/assessment/assessment-engine.enums.js";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seedTemplatesAndQuestions() {
    console.log("--------------------------------------------------");
    console.log("CareerSaathi Template & Question Bank Seeder");
    console.log("--------------------------------------------------");

    // 1. Seed Master Roadmap Templates
    const roadmapsDir = path.join(__dirname, "roadmaps");
    if (fs.existsSync(roadmapsDir)) {
        const roadmapFiles = fs.readdirSync(roadmapsDir).filter(f => f.endsWith(".json"));
        console.log(`Found ${roadmapFiles.length} roadmap template file(s) in ${roadmapsDir}`);

        for (const file of roadmapFiles) {
            try {
                const filePath = path.join(roadmapsDir, file);
                const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                const { roleSlug, title, description, version, roadmapItems } = content;

                if (!roleSlug || !title || !roadmapItems) {
                    console.warn(`[WARN] Skipping ${file}: missing roleSlug, title, or roadmapItems.`);
                    continue;
                }

                const role = await CareerRoleModel.findOne({ slug: roleSlug });
                const roleId = role ? role._id : undefined;

                await MasterRoadmapTemplateModel.findOneAndUpdate(
                    { roleSlug, version: version || 1 },
                    {
                        roleId,
                        roleSlug,
                        title,
                        description: description || "",
                        version: version || 1,
                        roadmapItems,
                        isActive: true,
                    },
                    { upsert: true, new: true }
                );

                console.log(`[SUCCESS] Seeded Roadmap Template: "${title}" (${roleSlug})`);
            } catch (err) {
                console.error(`[ERROR] Failed to seed roadmap ${file}:`, err);
            }
        }
    }

    // 2. Seed Assessment Questions
    const questionsDir = path.join(__dirname, "questions");
    if (fs.existsSync(questionsDir)) {
        const questionFiles = fs.readdirSync(questionsDir).filter(f => f.endsWith(".json"));
        console.log(`\nFound ${questionFiles.length} question bank file(s) in ${questionsDir}`);

        for (const file of questionFiles) {
            try {
                const filePath = path.join(questionsDir, file);
                const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                const { skillSlug, questions } = content;

                if (!skillSlug || !Array.isArray(questions)) {
                    console.warn(`[WARN] Skipping ${file}: missing skillSlug or questions array.`);
                    continue;
                }

                const skill = await SkillCatalogModel.findOne({ slug: skillSlug });
                if (!skill) {
                    console.warn(`[WARN] Skill '${skillSlug}' not found in SkillCatalog. Please seed skill catalog first.`);
                    continue;
                }

                const topics = await SkillTopicModel.find({ skillCatalogId: skill._id });
                const defaultTopicId = topics.length > 0 ? topics[0]._id : new mongoose.Types.ObjectId();

                let seededCount = 0;
                for (const q of questions) {
                    let topicId = defaultTopicId;
                    if (q.topicSlug && topics.length > 0) {
                        const matched = topics.find(t => t.slug === q.topicSlug.toLowerCase());
                        if (matched) topicId = matched._id;
                    }

                    const questionContent = {
                        stem: q.stem,
                        type: q.type || QuestionType.SINGLE_CHOICE,
                        options: q.options || [],
                        correctOptionKeys: q.correctOptionKeys || ["A"],
                        explanation: q.explanation || "",
                        estimatedTimeSeconds: q.estimatedTimeSeconds || 60,
                    };

                    const contentHash = buildQuestionContentHash(questionContent);

                    await QuestionModel.findOneAndUpdate(
                        { contentHash },
                        {
                            skillCatalogId: skill._id,
                            topicId,
                            type: questionContent.type,
                            difficulty: q.difficulty || QuestionDifficulty.MEDIUM,
                            stem: questionContent.stem,
                            options: questionContent.options,
                            correctOptionKeys: questionContent.correctOptionKeys,
                            explanation: questionContent.explanation,
                            estimatedTimeSeconds: questionContent.estimatedTimeSeconds,
                            status: QuestionStatus.ADMIN_APPROVED,
                            source: QuestionSource.IMPORTED,
                            version: 1,
                            contentHash,
                            generatedBy: {
                                provider: "curated-seed",
                                model: "career-saathi-curated",
                                promptVersion: "curated-v1",
                            },
                        },
                        { upsert: true, new: true }
                    );
                    seededCount++;
                }

                console.log(`[SUCCESS] Seeded ${seededCount} question(s) for skill: "${skill.name}" (${skillSlug})`);
            } catch (err) {
                console.error(`[ERROR] Failed to seed questions from ${file}:`, err);
            }
        }
    }

    console.log("--------------------------------------------------");
    console.log("Template & Question Bank Seeding Completed.");
    console.log("--------------------------------------------------");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    (async () => {
        try {
            await mongoose.connect(process.env.MONGODB_URI!);
            console.log("Connected to MongoDB.");
            await seedTemplatesAndQuestions();
            await mongoose.disconnect();
            process.exit(0);
        } catch (error) {
            console.error("Seeder failed:", error);
            process.exit(1);
        }
    })();
}
