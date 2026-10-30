import type {
  ClientSession,
} from "mongoose";
import {
  Types,
} from "mongoose";

import { AppError } from "../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { appClock } from "../../shared/time/app-clock.js";
import { executeTransaction } from "../../shared/utils/transaction.util.js";
import {
  careerJourneyRepository,
  CareerJourneyStatus,
} from "../career-journey/index.js";
import {
  AssessmentMethod,
  skillProgressService,
} from "../skill-progress/index.js";
import { skillProgressRepository } from "../skill-progress/skill-progress.repository.js";
import { userSkillRepository } from "../user-skill/user-skill.repository.js";
import { userSkillService } from "../user-skill/user-skill.service.js";
import {
  AssessmentStatus,
  AssessmentType,
} from "./assessment.enums.js";
import {
  ASSESSMENT_ENGINE,
} from "./assessment-engine.constants.js";
import {
  AssessmentAttemptStatus,
  AssessmentDeliveryMode,
  AssessmentSectionStatus,
  QuestionType,
} from "./assessment-engine.enums.js";
import {
  assessmentRepository,
} from "./assessment.repository.js";
import type {
  AssessmentDocument,
} from "./assessment.model.js";
import {
  assessmentAttemptRepository,
} from "./assessment-attempt.repository.js";
import type {
  AssessmentAttemptDocument,
} from "./assessment-attempt.model.js";
import {
  assessmentAnswerRepository,
} from "./assessment-answer.repository.js";
import type {
  AssessmentAnswer,
  AssessmentAnswerDocument,
} from "./assessment-answer.model.js";
import {
  assessmentQuestionRepository,
} from "./assessment-question.repository.js";
import type {
  AssessmentQuestionDocument,
} from "./assessment-question.model.js";
import {
  assessmentSectionRepository,
} from "./assessment-section.repository.js";
import type {
  AssessmentSectionDocument,
} from "./assessment-section.model.js";
import {
  questionGenerationService,
} from "./question-generation.service.js";
import {
  questionRepository,
} from "./question.repository.js";
import type {
  QuestionAnswerKey,
} from "./question.types.js";
import {
  skillEvidenceRepository,
} from "./skill-evidence.repository.js";
import {
  skillTopicProgressRepository,
} from "./skill-topic-progress.repository.js";
import {
  SkillEvidenceSource,
} from "./assessment-engine.enums.js";
import { skillTopicRepository } from "../../master-data/skill-topic/skill-topic.repository.js";
import { skillCatalogRepository } from "../../master-data/skill-catalog/skill-catalog.repository.js";
import type {
  AutosaveAnswerInput,
  AutosaveAttemptInput,
  AssessmentSectionView,
  AttemptAnswerView,
  AttemptQuestionResult,
  AttemptQuestionView,
  AttemptStateResponse,
  AttemptTopicResult,
  InitialCampaignSection,
  StartInitialCampaignResponse,
  StartSectionAttemptResponse,
  SubmitAttemptInput,
  SubmitAttemptResponse,
} from "./assessment-runtime.types.js";

interface TopicAttemptStats {
  topicId: Types.ObjectId;
  topicName: string;
  weightedCorrect: number;
  weightedTotal: number;
  correctCount: number;
  questionCount: number;
}

const EMPTY_MATCHING_PAIRS =
  [] as unknown as AssessmentAnswer["matchingPairs"];

const asObjectId = (
  value: string,
  message: string
): Types.ObjectId => {
  if (!Types.ObjectId.isValid(value)) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      message
    );
  }

  return new Types.ObjectId(value);
};

class AssessmentRuntimeService {

  async startInitialCampaign(
    userId: string,
    careerJourneyId: string
  ): Promise<StartInitialCampaignResponse> {
    const userObjectId = asObjectId(
      userId,
      "Invalid user id."
    );
    const journeyObjectId = asObjectId(
      careerJourneyId,
      "Invalid career journey id."
    );

    return executeTransaction(
      async (session) => {
        const journey =
          await careerJourneyRepository
            .findByIdAndUserId(
              journeyObjectId,
              userObjectId,
              session
            );

        if (!journey) {
          throw new AppError(
            HTTP_STATUS.NOT_FOUND,
            "Career journey not found."
          );
        }

        if (
          journey.status !==
          CareerJourneyStatus.DRAFT
        ) {
          throw new AppError(
            HTTP_STATUS.CONFLICT,
            "Initial assessment can only be started for a draft career journey."
          );
        }

        const selectedSkills =
          await userSkillRepository
            .findSelectedByCareerJourney(
              journeyObjectId,
              session
            );

        if (selectedSkills.length === 0) {
          throw new AppError(
            HTTP_STATUS.BAD_REQUEST,
            "Select at least one skill before starting the initial assessment."
          );
        }

        if (
          selectedSkills.length >
          ASSESSMENT_ENGINE
            .MAX_SKILLS_PER_INITIAL_ASSESSMENT
        ) {
          throw new AppError(
            HTTP_STATUS.BAD_REQUEST,
            `Select no more than ${ASSESSMENT_ENGINE.MAX_SKILLS_PER_INITIAL_ASSESSMENT} skills for the initial assessment.`
          );
        }

        const buildCampaignResponse = (
          existingAssessment: AssessmentDocument,
          existingSections: AssessmentSectionDocument[]
        ): StartInitialCampaignResponse => ({
          assessmentId:
            existingAssessment._id.toString(),
          careerJourneyId:
            journeyObjectId.toString(),
          type: existingAssessment.type,
          status: existingAssessment.status,
          sectionCount:
            existingAssessment.sectionCount,
          firstSectionId:
            existingSections[0]._id.toString(),
          sections:
            existingSections.map(
              (section): InitialCampaignSection => ({
                sectionId:
                  section._id.toString(),
                skillCatalogId:
                  section.skillCatalogId
                    .toString(),
                skillName:
                  selectedSkills.find(
                    (skill) =>
                      skill.skillCatalogId._id.toString() ===
                      section.skillCatalogId.toString()
                  )?.skillCatalogId.name ??
                  "Skill",
                displayOrder:
                  section.displayOrder,
                status: section.status,
                questionCount:
                  section.questionCount,
                timeLimitSeconds:
                  section.timeLimitSeconds,
              })
            ),
        });

        const existingAssessment =
          await assessmentRepository.findOne(
            {
              careerJourneyId:
                journeyObjectId,
              type: AssessmentType.INITIAL,
            },
            session
          );

        if (existingAssessment) {
          const existingSections =
            await assessmentSectionRepository
              .findByAssessment(
                existingAssessment._id,
                session
              );

          if (existingSections.length > 0) {
            return buildCampaignResponse(
              existingAssessment,
              existingSections
            );
          }

          throw new AppError(
            HTTP_STATUS.CONFLICT,
            "Initial assessment already exists."
          );
        }

        const assessment =
          await assessmentRepository.create(
            {
              careerJourneyId:
                journeyObjectId,
              type: AssessmentType.INITIAL,
              weekNumber: 0,
              title: "Initial Assessment",
              description:
                "Section-based initial assessment for selected skills.",
              skillCatalogIds:
                selectedSkills.map(
                  (skill) =>
                    skill.skillCatalogId._id
                ),
              deliveryMode:
                AssessmentDeliveryMode.INTERNAL,
              status: AssessmentStatus.PENDING,
              sectionCount:
                selectedSkills.length,
              completedSectionCount: 0,
            },
            session
          );

        const sections =
          await assessmentSectionRepository
            .createMany(
              selectedSkills.map(
                (skill, index) => ({
                  assessmentId:
                    assessment._id,
                  careerJourneyId:
                    journeyObjectId,
                  skillCatalogId:
                    skill.skillCatalogId._id,
                  displayOrder: index + 1,
                  status:
                    AssessmentSectionStatus.PENDING,
                  questionCount:
                    ASSESSMENT_ENGINE
                      .QUESTIONS_PER_SKILL,
                  timeLimitSeconds:
                    ASSESSMENT_ENGINE
                      .SECTION_TIME_LIMIT_SECONDS,
                  maxScore: 100,
                })
              ),
              session
            );

        return buildCampaignResponse(
          assessment,
          sections
        );
      }
    );
  }

  async getAssessmentSections(
    userId: string,
    assessmentId: string
  ): Promise<AssessmentSectionView[]> {
    const userObjectId = asObjectId(
      userId,
      "Invalid user id."
    );
    const assessmentObjectId = asObjectId(
      assessmentId,
      "Invalid assessment id."
    );

    const assessment =
      await assessmentRepository.findById(
        assessmentObjectId
      );

    if (!assessment) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        "Assessment not found."
      );
    }

    const journey =
      await careerJourneyRepository
        .findByIdAndUserId(
          assessment.careerJourneyId,
          userObjectId
        );

    if (!journey) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        "Career journey not found."
      );
    }

    const sections =
      await assessmentSectionRepository
        .findByAssessment(
          assessmentObjectId
        );

    const skills =
      await skillCatalogRepository
        .findActiveByIds(
          sections.map(
            (section) =>
              section.skillCatalogId
          )
        );

    const skillNameById = new Map(
      skills.map((skill) => [
        skill._id.toString(),
        skill.name,
      ])
    );

    return sections.map(
      (section): AssessmentSectionView => ({
        sectionId:
          section._id.toString(),
        skillCatalogId:
          section.skillCatalogId.toString(),
        skillName:
          skillNameById.get(
            section.skillCatalogId.toString()
          ) ?? "Skill",
        displayOrder:
          section.displayOrder,
        status: section.status,
        questionCount:
          section.questionCount,
        timeLimitSeconds:
          section.timeLimitSeconds,
        score: section.score ?? null,
        maxScore: section.maxScore,
        startedAt: section.startedAt ?? null,
        completedAt:
          section.completedAt ?? null,
      })
    );
  }

  async startOrResumeAttempt(
    userId: string,
    sectionId: string
  ): Promise<StartSectionAttemptResponse> {
    const userObjectId = asObjectId(
      userId,
      "Invalid user id."
    );
    const sectionObjectId = asObjectId(
      sectionId,
      "Invalid section id."
    );

    const section =
      await assessmentSectionRepository.findById(
        sectionObjectId
      );

    if (!section) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        "Assessment section not found."
      );
    }

    const assessment =
      await assessmentRepository.findById(
        section.assessmentId
      );

    if (!assessment) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        "Assessment not found."
      );
    }

    if (
      assessment.status ===
      AssessmentStatus.CANCELLED ||
      section.status ===
      AssessmentSectionStatus.CANCELLED
    ) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        "Assessment section is cancelled."
      );
    }

    await careerJourneyRepository
      .findByIdAndUserId(
        assessment.careerJourneyId,
        userObjectId
      )
      .then((journey) => {
        if (!journey) {
          throw new AppError(
            HTTP_STATUS.NOT_FOUND,
            "Career journey not found."
          );
        }
      });

    const existingAttempt =
      await assessmentAttemptRepository
        .findInProgressBySection(
          sectionObjectId
        );

    if (existingAttempt) {
      if (
        existingAttempt.expiresAt.getTime() >
        appClock.now().getTime()
      ) {
        return this.buildAttemptResponse(
          existingAttempt,
          section,
          true
        );
      }

      await assessmentAttemptRepository
        .updateById(
          existingAttempt._id,
          {
            $set: {
              status:
                AssessmentAttemptStatus.EXPIRED,
            },
          }
        );
    }

    const selectedQuestions =
      await questionGenerationService
        .selectQuestionsForAttempt(
          section.skillCatalogId,
          section.questionCount
        );

    const topics =
      await skillTopicRepository
        .findActiveBySkillCatalogId(
          section.skillCatalogId
        );

    const topicById = new Map(
      topics.map((topic) => [
        topic._id.toString(),
        topic,
      ])
    );

    return executeTransaction(
      async (session) => {
        const freshSection =
          await assessmentSectionRepository.findById(
            sectionObjectId,
            session
          );

        if (!freshSection) {
          throw new AppError(
            HTTP_STATUS.NOT_FOUND,
            "Assessment section not found."
          );
        }

        const now = appClock.now();

        const inProgress =
          await assessmentAttemptRepository
            .findInProgressBySection(
              sectionObjectId,
              session
            );

        if (inProgress) {
          if (
            inProgress.expiresAt.getTime() <=
            now.getTime()
          ) {
            await assessmentAttemptRepository
              .updateById(
                inProgress._id,
                {
                  $set: {
                    status:
                      AssessmentAttemptStatus.EXPIRED,
                  },
                },
                session
              );
          } else {
            return this.buildAttemptResponse(
              inProgress,
              freshSection,
              true,
              session
            );
          }
        }

        const latestAttempt =
          await assessmentAttemptRepository
            .findLatestBySection(
              sectionObjectId,
              session
            );

        const attemptNumber =
          latestAttempt
            ? latestAttempt.attemptNumber + 1
            : 1;

        const startedAt = appClock.now();
        const expiresAt = new Date(
          startedAt.getTime() +
            ASSESSMENT_ENGINE
              .ATTEMPT_EXPIRY_SECONDS *
              1000
        );

        const attempt =
          await assessmentAttemptRepository.create(
            {
              assessmentId:
                freshSection.assessmentId,
              sectionId:
                freshSection._id,
              userId: userObjectId,
              careerJourneyId:
                freshSection.careerJourneyId,
              skillCatalogId:
                freshSection.skillCatalogId,
              attemptNumber,
              status:
                AssessmentAttemptStatus.IN_PROGRESS,
              startedAt,
              expiresAt,
            },
            session
          );

        const snapshots =
          await assessmentQuestionRepository
            .createMany(
              selectedQuestions.map(
                (question, index) => {
                  const topic =
                    topicById.get(
                      question.topicId.toString()
                    );

                  if (!topic) {
                    throw new AppError(
                      HTTP_STATUS.INTERNAL_SERVER_ERROR,
                      "Question topic is missing."
                    );
                  }

                  const plainQuestion =
                    question.toObject();

                  return {
                    attemptId:
                      attempt._id,
                    questionId:
                      question._id,
                    questionVersion:
                      question.version,
                    skillCatalogId:
                      question.skillCatalogId,
                    topicId: question.topicId,
                    topicNameSnapshot:
                      topic.name,
                    type: question.type,
                    difficulty:
                      question.difficulty,
                    stemSnapshot:
                      question.stem,
                    optionsSnapshot:
                      plainQuestion.options ??
                      [],
                    matchingSnapshot:
                      plainQuestion.matching
                        ? {
                            leftItems:
                              plainQuestion
                                .matching
                                .leftItems,
                            rightItems:
                              plainQuestion
                                .matching
                                .rightItems,
                          }
                        : undefined,
                    answerKeySnapshot: {
                      correctOptionKeys:
                        plainQuestion
                          .correctOptionKeys ??
                        [],
                      numericAnswer:
                        plainQuestion
                          .numericAnswer,
                      matching:
                        plainQuestion.matching,
                    },
                    explanationSnapshot:
                      question.explanation,
                    order: index + 1,
                    estimatedTimeSeconds:
                      question.estimatedTimeSeconds,
                    points: 1,
                    reviewStatusAtServe:
                      question.status,
                  };
                }
              ),
              session
            );

        await questionRepository.markServed(
          selectedQuestions.map(
            (question) => question._id
          ),
          session
        );

        await assessmentSectionRepository
          .updateById(
            freshSection._id,
            {
              $set: {
                status:
                  AssessmentSectionStatus.IN_PROGRESS,
                startedAt,
                completedAt: null,
                score: null,
                questionCount:
                  selectedQuestions.length,
              },
            },
            session
          );

        const freshAssessment =
          await assessmentRepository.findById(
            freshSection.assessmentId,
            session
          );

        if (freshAssessment) {
          await assessmentRepository.updateById(
            freshAssessment._id,
            {
              $set: {
                status:
                  freshAssessment.status ===
                  AssessmentStatus.COMPLETED
                    ? AssessmentStatus.COMPLETED
                    : AssessmentStatus.IN_PROGRESS,
                startedAt:
                  freshAssessment.startedAt ??
                  startedAt,
              },
            },
            session
          );
        }

        return {
          attemptId:
            attempt._id.toString(),
          sectionId:
            attempt.sectionId.toString(),
          attemptNumber:
            attempt.attemptNumber,
          status: attempt.status,
          startedAt:
            attempt.startedAt,
          expiresAt:
            attempt.expiresAt,
          resumed: false,
          questions:
            snapshots.map((snapshot) =>
              this.toQuestionView(snapshot)
            ),
          answers: [],
        };
      }
    );
  }

  async getAttemptState(
    userId: string,
    attemptId: string
  ): Promise<AttemptStateResponse> {
    const userObjectId = asObjectId(
      userId,
      "Invalid user id."
    );
    const attemptObjectId = asObjectId(
      attemptId,
      "Invalid attempt id."
    );

    const attempt =
      await assessmentAttemptRepository.findById(
        attemptObjectId
      );

    this.assertAttemptOwner(
      attempt,
      userObjectId
    );

    const snapshots =
      await assessmentQuestionRepository
        .findByAttempt(attemptObjectId);

    const answers =
      await assessmentAnswerRepository
        .findByAttempt(attemptObjectId);

    return {
      attemptId: attempt._id.toString(),
      sectionId: attempt.sectionId.toString(),
      attemptNumber: attempt.attemptNumber,
      status: attempt.status,
      startedAt: attempt.startedAt,
      expiresAt: attempt.expiresAt,
      questions:
        snapshots.map((snapshot) =>
          this.toQuestionView(snapshot)
        ),
      answers: this.toAnswerViews(answers),
    };
  }

  async autosaveAttempt(
    input: AutosaveAttemptInput
  ): Promise<{ saved: number }> {
    const userObjectId = asObjectId(
      input.userId,
      "Invalid user id."
    );
    const attemptObjectId = asObjectId(
      input.attemptId,
      "Invalid attempt id."
    );

    const attempt =
      await assessmentAttemptRepository.findById(
        attemptObjectId
      );

    this.assertAttemptOwner(
      attempt,
      userObjectId
    );

    if (
      attempt.status !==
      AssessmentAttemptStatus.IN_PROGRESS
    ) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        "Only an in-progress attempt can be updated."
      );
    }

    if (
      attempt.expiresAt.getTime() <=
      appClock.now().getTime()
    ) {
      await assessmentAttemptRepository.updateById(
        attempt._id,
        {
          $set: {
            status:
              AssessmentAttemptStatus.EXPIRED,
          },
        }
      );

      throw new AppError(
        HTTP_STATUS.GONE,
        "Assessment attempt has expired."
      );
    }

    await this.saveAnswers(
      attempt,
      input.answers
    );

    return {
      saved: input.answers.length,
    };
  }

  async submitAttempt(
    input: SubmitAttemptInput
  ): Promise<SubmitAttemptResponse> {
    const userObjectId = asObjectId(
      input.userId,
      "Invalid user id."
    );
    const attemptObjectId = asObjectId(
      input.attemptId,
      "Invalid attempt id."
    );

    const existingAttempt =
      await assessmentAttemptRepository.findById(
        attemptObjectId
      );

    this.assertAttemptOwner(
      existingAttempt,
      userObjectId
    );

    if (
      existingAttempt.status ===
      AssessmentAttemptStatus.SUBMITTED
    ) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        "Assessment attempt has already been submitted."
      );
    }

    if (
      existingAttempt.expiresAt.getTime() <=
      appClock.now().getTime()
    ) {
      await assessmentAttemptRepository.updateById(
        existingAttempt._id,
        {
          $set: {
            status:
              AssessmentAttemptStatus.EXPIRED,
          },
        }
      );

      throw new AppError(
        HTTP_STATUS.GONE,
        "Assessment attempt has expired."
      );
    }

    return executeTransaction(
      async (session) => {
        const attempt =
          await assessmentAttemptRepository.findById(
            attemptObjectId,
            session
          );

        this.assertAttemptOwner(
          attempt,
          userObjectId
        );

        if (
          attempt.status !==
          AssessmentAttemptStatus.IN_PROGRESS
        ) {
          throw new AppError(
            HTTP_STATUS.CONFLICT,
            "Assessment attempt is not in progress."
          );
        }

        const journey =
          await careerJourneyRepository
            .findByIdAndUserId(
              attempt.careerJourneyId,
              userObjectId,
              session
            );

        if (!journey) {
          throw new AppError(
            HTTP_STATUS.NOT_FOUND,
            "Career journey not found."
          );
        }

        const section =
          await assessmentSectionRepository.findById(
            attempt.sectionId,
            session
          );

        if (!section) {
          throw new AppError(
            HTTP_STATUS.NOT_FOUND,
            "Assessment section not found."
          );
        }

        if (input.answers?.length) {
          await this.saveAnswers(
            attempt,
            input.answers,
            session
          );
        }

        const snapshots =
          await assessmentQuestionRepository
            .findByAttemptWithAnswerKey(
              attempt._id,
              session
            );

        const answers =
          await assessmentAnswerRepository
            .findByAttempt(
              attempt._id,
              session
            );

        if (snapshots.length === 0) {
          throw new AppError(
            HTTP_STATUS.CONFLICT,
            "Assessment attempt has no questions."
          );
        }

        const answerByQuestionId =
          new Map(
            answers.map((answer) => [
              answer.assessmentQuestionId
                .toString(),
              answer,
            ])
          );

        const questionResults: AttemptQuestionResult[] =
          [];
        const topicStats =
          new Map<string, TopicAttemptStats>();

        let correctCount = 0;

        for (const snapshot of snapshots) {
          const answer =
            answerByQuestionId.get(
              snapshot._id.toString()
            );

          const isCorrect =
            this.gradeAnswer(
              snapshot,
              answer
            );

          if (isCorrect) {
            correctCount += 1;
          }

          if (answer) {
            await assessmentAnswerRepository
              .updateById(
                answer._id,
                {
                  isCorrect,
                  pointsAwarded: isCorrect
                    ? snapshot.points
                    : 0,
                },
                session
              );
          }

          questionResults.push({
            assessmentQuestionId:
              snapshot._id.toString(),
            isCorrect,
            pointsAwarded: isCorrect
              ? snapshot.points
              : 0,
            explanation:
              snapshot.explanationSnapshot,
          });

          const topicKey =
            snapshot.topicId.toString();
          const stats =
            topicStats.get(topicKey) ?? {
              topicId:
                snapshot.topicId,
              topicName:
                snapshot.topicNameSnapshot,
              weightedCorrect: 0,
              weightedTotal: 0,
              correctCount: 0,
              questionCount: 0,
            };

          const weight =
            snapshot.difficulty === "EASY"
              ? 1
              : snapshot.difficulty ===
                  "MEDIUM"
                ? 1.5
                : 2;

          stats.weightedTotal += weight;
          stats.weightedCorrect +=
            isCorrect ? weight : 0;
          stats.correctCount +=
            isCorrect ? 1 : 0;
          stats.questionCount += 1;

          topicStats.set(topicKey, stats);
        }

        const questionCount =
          snapshots.length;
        const percentage = Number(
          (
            (correctCount /
              questionCount) *
            100
          ).toFixed(2)
        );
        const submittedAt = appClock.now();
        const durationSeconds =
          Math.max(
            0,
            Math.round(
              (submittedAt.getTime() -
                attempt.startedAt.getTime()) /
                1000
            )
          );

        await assessmentAttemptRepository
          .updateById(
            attempt._id,
            {
              $set: {
                status:
                  AssessmentAttemptStatus.SUBMITTED,
                submittedAt,
                durationSeconds,
                score: percentage,
                maxScore: 100,
                correctCount,
                questionCount,
                hasRetiredQuestion:
                  snapshots.some(
                    (snapshot) =>
                      snapshot.reviewStatusAtServe ===
                        "REJECTED" ||
                      snapshot.reviewStatusAtServe ===
                        "RETIRED"
                  ),
              },
            },
            session
          );

        const userSkill =
          await userSkillRepository.findOne(
            {
              careerJourneyId:
                attempt.careerJourneyId,
              skillCatalogId:
                attempt.skillCatalogId,
              isActive: true,
            },
            undefined,
            undefined,
            session
          );

        if (!userSkill) {
          throw new AppError(
            HTTP_STATUS.CONFLICT,
            "User skill is not initialized for this assessment."
          );
        }

        const existingProgress =
          await skillProgressRepository
            .findByAttemptAndUserSkill(
              attempt._id,
              userSkill._id,
              session
            );

        if (!existingProgress) {
          await skillProgressService
            .createSkillProgress(
              {
                careerJourneyId:
                  attempt.careerJourneyId,
                assessmentId:
                  attempt.assessmentId,
                assessmentSectionId:
                  attempt.sectionId,
                assessmentAttemptId:
                  attempt._id,
                userSkillId:
                  userSkill._id,
                obtainedMarks:
                  correctCount,
                totalMarks:
                  questionCount,
                assessmentMethod:
                  AssessmentMethod.INTERNAL,
                assessmentName:
                  "Internal section assessment",
              },
              session
            );
        }

        await userSkillService.updateManySkills(
          [
            {
              userSkillId:
                userSkill._id,
              currentScore:
                percentage,
              lastAssessmentAt:
                submittedAt,
            },
          ],
          session
        );

        await assessmentSectionRepository
          .updateById(
            section._id,
            {
              $set: {
                status:
                  AssessmentSectionStatus.COMPLETED,
                score: percentage,
                maxScore: 100,
                completedAt: submittedAt,
              },
            },
            session
          );

        const topicResults =
          await this.updateTopicProgress(
            attempt,
            topicStats,
            session
          );

        const completedSections =
          await assessmentSectionRepository
            .countCompleted(
              attempt.assessmentId,
              session
            );

        const assessment =
          await assessmentRepository.findById(
            attempt.assessmentId,
            session
          );

        if (!assessment) {
          throw new AppError(
            HTTP_STATUS.NOT_FOUND,
            "Assessment not found."
          );
        }

        const assessmentCompleted =
          completedSections >=
          assessment.sectionCount;

        await assessmentRepository.updateById(
          assessment._id,
          {
            $set: {
              completedSectionCount:
                completedSections,
              status: assessmentCompleted
                ? AssessmentStatus.COMPLETED
                : AssessmentStatus.IN_PROGRESS,
              completedAt:
                assessmentCompleted
                  ? assessment.completedAt ??
                    submittedAt
                  : null,
            },
          },
          session
        );

        const careerJourneyActivated =
          assessmentCompleted &&
          assessment.type ===
            AssessmentType.INITIAL &&
          journey.status ===
            CareerJourneyStatus.DRAFT;

        if (careerJourneyActivated) {
          await careerJourneyRepository
            .updateStatusById(
              journey._id,
              CareerJourneyStatus.ACTIVE,
              session
            );
        }

        return {
          attemptId:
            attempt._id.toString(),
          sectionId:
            attempt.sectionId.toString(),
          skillCatalogId:
            attempt.skillCatalogId.toString(),
          status:
            AssessmentAttemptStatus.SUBMITTED,
          score: percentage,
          maxScore: 100,
          percentage,
          correctCount,
          questionCount,
          durationSeconds,
          questions: questionResults,
          topics: topicResults,
          weakTopics:
            topicResults.filter(
              (topic) => topic.weak
            ),
          assessmentCompleted,
          careerJourneyActivated,
        };
      }
    );
  }

  private assertAttemptOwner(
    attempt: AssessmentAttemptDocument | null,
    userId: Types.ObjectId
  ): asserts attempt is AssessmentAttemptDocument {
    if (!attempt) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        "Assessment attempt not found."
      );
    }

    if (
      attempt.userId.toString() !==
      userId.toString()
    ) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        "You do not have access to this assessment attempt."
      );
    }
  }

  private async buildAttemptResponse(
    attempt: AssessmentAttemptDocument,
    section: AssessmentSectionDocument,
    resumed: boolean,
    session?: ClientSession
  ): Promise<StartSectionAttemptResponse> {
    const snapshots =
      await assessmentQuestionRepository
        .findByAttempt(
          attempt._id,
          session
        );

    if (snapshots.length === 0) {
      throw new AppError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Assessment attempt has no questions."
      );
    }

    const answers =
      await assessmentAnswerRepository
        .findByAttempt(
          attempt._id,
          session
        );

    return {
      attemptId: attempt._id.toString(),
      sectionId: section._id.toString(),
      attemptNumber: attempt.attemptNumber,
      status: attempt.status,
      startedAt: attempt.startedAt,
      expiresAt: attempt.expiresAt,
      resumed,
      questions:
        snapshots.map((snapshot) =>
          this.toQuestionView(snapshot)
        ),
      answers: this.toAnswerViews(answers),
    };
  }

  private toAnswerViews(
    answers: AssessmentAnswerDocument[]
  ): AttemptAnswerView[] {
    return answers.map((answer) => ({
      assessmentQuestionId:
        answer.assessmentQuestionId.toString(),
      selectedOptionKeys:
        answer.selectedOptionKeys,
      numericValue:
        answer.numericValue ?? null,
      matchingPairs:
        answer.matchingPairs.map((pair) => ({
          leftKey: pair.leftKey,
          rightKey: pair.rightKey,
        })),
    }));
  }

  private toQuestionView(
    snapshot: AssessmentQuestionDocument
  ): AttemptQuestionView {
    return {
      assessmentQuestionId:
        snapshot._id.toString(),
      type: snapshot.type,
      difficulty:
        snapshot.difficulty,
      stem: snapshot.stemSnapshot,
      options:
        snapshot.optionsSnapshot.map(
          (option) => ({
            key: option.key,
            text: option.text,
          })
        ),
      matching: snapshot.matchingSnapshot
        ? {
            leftItems:
              snapshot.matchingSnapshot.leftItems.map(
                (item) => ({
                  key: item.key,
                  text: item.text,
                })
              ),
            rightItems:
              snapshot.matchingSnapshot.rightItems.map(
                (item) => ({
                  key: item.key,
                  text: item.text,
                })
              ),
          }
        : undefined,
      estimatedTimeSeconds:
        snapshot.estimatedTimeSeconds,
      points: snapshot.points,
    };
  }

  private async saveAnswers(
    attempt: AssessmentAttemptDocument,
    answers: AutosaveAnswerInput[],
    session?: ClientSession
  ): Promise<void> {
    const snapshots =
      await assessmentQuestionRepository
        .findByAttempt(
          attempt._id,
          session
        );

    const snapshotById =
      new Map(
        snapshots.map((snapshot) => [
          snapshot._id.toString(),
          snapshot,
        ])
      );

    for (const answer of answers) {
      const snapshot =
        snapshotById.get(
          answer.assessmentQuestionId
        );

      if (!snapshot) {
        throw new AppError(
          HTTP_STATUS.BAD_REQUEST,
          "Answer references a question that does not belong to this attempt."
        );
      }

      await assessmentAnswerRepository.upsert(
        attempt._id,
        snapshot._id,
        this.normalizeAnswer(
          snapshot,
          answer
        ),
        session
      );
    }
  }

  private normalizeAnswer(
    snapshot: AssessmentQuestionDocument,
    answer: AutosaveAnswerInput
  ): Partial<AssessmentAnswer> {
    const timeSpentSeconds = Math.min(
      Math.max(
        Math.floor(
          answer.timeSpentSeconds ?? 0
        ),
        0
      ),
      600
    );

    const optionKeys = new Set(
      snapshot.optionsSnapshot.map(
        (option) => option.key
      )
    );

    switch (snapshot.type) {
      case QuestionType.SINGLE_CHOICE: {
        const selected =
          answer.selectedOptionKeys ?? [];

        if (
          new Set(selected).size !==
            selected.length ||
          selected.length > 1 ||
          selected.some(
            (key) => !optionKeys.has(key)
          )
        ) {
          throw new AppError(
            HTTP_STATUS.BAD_REQUEST,
            "Invalid single-choice answer."
          );
        }

        return {
          selectedOptionKeys: selected,
          numericValue: null,
          matchingPairs:
            EMPTY_MATCHING_PAIRS,
          timeSpentSeconds,
        };
      }

      case QuestionType.MULTI_SELECT: {
        const selected =
          answer.selectedOptionKeys ?? [];

        if (
          new Set(selected).size !==
            selected.length ||
          selected.some(
            (key) => !optionKeys.has(key)
          )
        ) {
          throw new AppError(
            HTTP_STATUS.BAD_REQUEST,
            "Invalid multi-select answer."
          );
        }

        return {
          selectedOptionKeys: selected,
          numericValue: null,
          matchingPairs:
            EMPTY_MATCHING_PAIRS,
          timeSpentSeconds,
        };
      }

      case QuestionType.NUMERIC: {
        const numericValue =
          answer.numericValue ?? null;

        if (
          numericValue !== null &&
          !Number.isFinite(numericValue)
        ) {
          throw new AppError(
            HTTP_STATUS.BAD_REQUEST,
            "Invalid numeric answer."
          );
        }

        return {
          selectedOptionKeys: [],
          numericValue,
          matchingPairs:
            EMPTY_MATCHING_PAIRS,
          timeSpentSeconds,
        };
      }

      case QuestionType.MATCHING: {
        const pairs =
          answer.matchingPairs ?? [];
        const leftKeys = new Set(
          (
            snapshot.matchingSnapshot
              ?.leftItems ?? []
          ).map((item) => item.key)
        );
        const rightKeys = new Set(
          (
            snapshot.matchingSnapshot
              ?.rightItems ?? []
          ).map((item) => item.key)
        );
        const seenLeftKeys = new Set<string>();
        const seenRightKeys = new Set<string>();

        for (const pair of pairs) {
          if (
            seenLeftKeys.has(pair.leftKey) ||
            seenRightKeys.has(pair.rightKey) ||
            !leftKeys.has(pair.leftKey) ||
            !rightKeys.has(pair.rightKey)
          ) {
            throw new AppError(
              HTTP_STATUS.BAD_REQUEST,
              "Invalid matching answer."
            );
          }

          seenLeftKeys.add(pair.leftKey);
          seenRightKeys.add(pair.rightKey);
        }

        return {
          selectedOptionKeys: [],
          numericValue: null,
          matchingPairs:
            pairs as unknown as AssessmentAnswer["matchingPairs"],
          timeSpentSeconds,
        };
      }

      default:
        throw new AppError(
          HTTP_STATUS.BAD_REQUEST,
          "Unsupported question type."
        );
    }
  }

  private gradeAnswer(
    snapshot: AssessmentQuestionDocument,
    answer: AssessmentAnswerDocument | undefined
  ): boolean {
    if (!answer) {
      return false;
    }

    const answerKey =
      snapshot.answerKeySnapshot as QuestionAnswerKey;

    switch (snapshot.type) {
      case QuestionType.SINGLE_CHOICE: {
        const correct =
          answerKey.correctOptionKeys ?? [];
        const selected =
          answer.selectedOptionKeys ?? [];

        return (
          correct.length === 1 &&
          selected.length === 1 &&
          selected[0] === correct[0]
        );
      }

      case QuestionType.MULTI_SELECT: {
        const correct = new Set(
          answerKey.correctOptionKeys ?? []
        );
        const selected = new Set(
          answer.selectedOptionKeys ?? []
        );

        if (correct.size !== selected.size) {
          return false;
        }

        return Array.from(correct).every(
          (key) => selected.has(key)
        );
      }

      case QuestionType.NUMERIC: {
        if (
          answer.numericValue === null ||
          answer.numericValue === undefined ||
          !answerKey.numericAnswer
        ) {
          return false;
        }

        return (
          Math.abs(
            answer.numericValue -
              answerKey.numericAnswer.value
          ) <=
          (answerKey.numericAnswer.tolerance ??
            0)
        );
      }

      case QuestionType.MATCHING: {
        const correctPairs =
          answerKey.matching?.correctPairs ?? [];
        const submittedPairs =
          answer.matchingPairs ?? [];

        if (
          correctPairs.length !==
          submittedPairs.length
        ) {
          return false;
        }

        const correctSet = new Set(
          correctPairs.map(
            (pair) =>
              `${pair.leftKey}:${pair.rightKey}`
          )
        );

        return submittedPairs.every((pair) =>
          correctSet.has(
            `${pair.leftKey}:${pair.rightKey}`
          )
        );
      }

      default:
        return false;
    }
  }

  private async updateTopicProgress(
    attempt: AssessmentAttemptDocument,
    topicStats: Map<string, TopicAttemptStats>,
    session: ClientSession
  ): Promise<AttemptTopicResult[]> {
    const results: AttemptTopicResult[] =
      [];

    for (const stats of topicStats.values()) {
      const currentMastery =
        stats.weightedTotal > 0
          ? Number(
              (
                (stats.weightedCorrect /
                  stats.weightedTotal) *
                100
              ).toFixed(2)
            )
          : 0;

      const existing =
        await skillTopicProgressRepository
          .findOneByTopic(
            attempt.careerJourneyId,
            attempt.skillCatalogId,
            stats.topicId,
            session
          );

      const questionsAnswered =
        (existing?.questionsAnswered ?? 0) +
        stats.questionCount;
      const correctCount =
        (existing?.correctCount ?? 0) +
        stats.correctCount;

      const masteryScore = existing
        ? Number(
            (
              existing.masteryScore * 0.7 +
              currentMastery * 0.3
            ).toFixed(2)
          )
        : currentMastery;

      const accuracy =
        questionsAnswered > 0
          ? Number(
              (
                (correctCount /
                  questionsAnswered) *
                100
              ).toFixed(2)
            )
          : 0;

      const confidence = Math.min(
        1,
        questionsAnswered / 10
      );

      await skillTopicProgressRepository
        .upsert(
          attempt.careerJourneyId,
          attempt.skillCatalogId,
          stats.topicId,
          {
            masteryScore,
            accuracy,
            questionsAnswered,
            correctCount,
            confidence,
            lastAttemptId: attempt._id,
            lastAssessedAt: appClock.now(),
          },
          session
        );

      await skillEvidenceRepository.create(
        {
          userId: attempt.userId,
          careerJourneyId:
            attempt.careerJourneyId,
          skillCatalogId:
            attempt.skillCatalogId,
          topicId: stats.topicId,
          source:
            SkillEvidenceSource.ASSESSMENT,
          sourceId: attempt._id,
          score: masteryScore,
          confidence,
          evidenceText: "",
          scoringEligible: true,
          observedAt: appClock.now(),
        },
        session
      );

      results.push({
        topicId: stats.topicId.toString(),
        topicName: stats.topicName,
        masteryScore,
        accuracy,
        questionsAnswered,
        correctCount,
        weak:
          questionsAnswered >=
            ASSESSMENT_ENGINE
              .MIN_TOPIC_SAMPLE_SIZE &&
          masteryScore < 40,
      });
    }

    return results.sort(
      (a, b) =>
        a.masteryScore - b.masteryScore
    );
  }
}

export const assessmentRuntimeService =
  new AssessmentRuntimeService();
