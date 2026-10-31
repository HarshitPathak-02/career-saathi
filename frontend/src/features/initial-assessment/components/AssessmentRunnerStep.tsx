import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    AlertCircle,
    CheckCircle2,
    ClipboardList,
    Clock3,
    RefreshCw,
    Trophy,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";

import {
    useAppDispatch,
    useAppSelector,
} from "../../../app/hooks";

import {
    getApiErrorMessage,
} from "../../../shared/lib/getApiErrorMessage";

import {
    INITIAL_ASSESSMENT_STORAGE_KEY,
    resetInitialAssessment,
} from "../slice/initialAssessmentSlice";

import {
    useAutosaveAttemptMutation,
    useGetAssessmentSectionsQuery,
    useStartSectionAttemptMutation,
    useSubmitAssessmentAttemptMutation,
} from "../api/initialAssessmentApi";

import type {
    AssessmentAnswerPayload,
    AssessmentSectionStatus,
    AssessmentSectionView,
    AttemptQuestion,
    StartSectionAttemptResponse,
    SubmitAttemptResponse,
} from "../types/initialAssessment.types";

interface AnswerState {
    selectedOptionKeys: string[];

    numericValue: number | "";

    matchingPairs: Array<{
        leftKey: string;

        rightKey: string;
    }>;
}

type AnswerMap = Record<string, AnswerState>;

interface QuestionFieldProps {
    question: AttemptQuestion;

    answer: AnswerState;

    disabled: boolean;

    onChange: (answer: AnswerState) => void;
}

const emptyAnswer = (): AnswerState => ({
    selectedOptionKeys: [],
    numericValue: "",
    matchingPairs: [],
});

const buildAnswerPayload = (
    questions: AttemptQuestion[],
    answers: AnswerMap
): AssessmentAnswerPayload[] => {
    return questions.flatMap((question) => {
        const answer = answers[
            question.assessmentQuestionId
        ];

        if (!answer) {
            return [];
        }

        const hasSelection =
            answer.selectedOptionKeys.length > 0;

        const hasNumericAnswer =
            typeof answer.numericValue === "number";

        const hasMatchingAnswer =
            answer.matchingPairs.length > 0;

        if (
            !hasSelection &&
            !hasNumericAnswer &&
            !hasMatchingAnswer
        ) {
            return [];
        }

        return [
            {
                assessmentQuestionId:
                    question.assessmentQuestionId,

                selectedOptionKeys:
                    answer.selectedOptionKeys,

                numericValue:
                    typeof answer.numericValue ===
                    "number"
                        ? answer.numericValue
                        : undefined,

                matchingPairs:
                    hasMatchingAnswer
                        ? answer.matchingPairs
                        : undefined,
            },
        ];
    });
};

const sectionStatusLabel = (
    status: AssessmentSectionStatus
): string => {
    switch (status) {
        case "COMPLETED":
            return "Completed";

        case "IN_PROGRESS":
            return "In progress";

        case "CANCELLED":
            return "Cancelled";

        default:
            return "Not started";
    }
};

const sectionActionLabel = (
    status: AssessmentSectionStatus
): string => {
    switch (status) {
        case "COMPLETED":
            return "Retake section";

        case "IN_PROGRESS":
            return "Resume section";

        default:
            return "Start section";
    }
};

const difficultyClass = (
    difficulty: AttemptQuestion["difficulty"]
): string => {
    switch (difficulty) {
        case "HARD":
            return "bg-red-50 text-red-700";

        case "MEDIUM":
            return "bg-amber-50 text-amber-700";

        default:
            return "bg-emerald-50 text-emerald-700";
    }
};

const formatDuration = (seconds: number): string => {
    const safeSeconds = Math.max(0, seconds);
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = safeSeconds % 60;

    return `${minutes}:${remainder
        .toString()
        .padStart(2, "0")}`;
};

const QuestionField = ({
    question,
    answer,
    disabled,
    onChange,
}: QuestionFieldProps) => {
    if (question.type === "NUMERIC") {
        return (
            <input
                type="number"
                value={answer.numericValue}
                disabled={disabled}
                onChange={(event) =>
                    onChange({
                        ...answer,

                        numericValue:
                            event.target.value === ""
                                ? ""
                                : Number(
                                    event.target.value
                                ),
                    })
                }
                placeholder="Enter a number"
                className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
        );
    }

    if (question.type === "MATCHING") {
        const pairByLeftKey = new Map(
            answer.matchingPairs.map((pair) => [
                pair.leftKey,
                pair.rightKey,
            ])
        );

        const updatePair = (
            leftKey: string,
            rightKey: string
        ) => {
            const nextPairs = answer.matchingPairs
                .filter(
                    (pair) =>
                        pair.leftKey !== leftKey &&
                        pair.rightKey !== rightKey
                )
                .concat(
                    rightKey
                        ? [
                            {
                                leftKey,
                                rightKey,
                            },
                        ]
                        : []
                );

            onChange({
                ...answer,
                matchingPairs: nextPairs,
            });
        };

        return (
            <div className="mt-4 space-y-3">
                {question.matching?.leftItems.map(
                    (leftItem) => (
                        <div
                            key={leftItem.key}
                            className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 sm:items-center"
                        >
                            <p className="text-sm font-medium text-slate-800">
                                {leftItem.text}
                            </p>

                            <select
                                value={
                                    pairByLeftKey.get(
                                        leftItem.key
                                    ) ?? ""
                                }
                                disabled={disabled}
                                onChange={(event) =>
                                    updatePair(
                                        leftItem.key,
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="">
                                    Select a match
                                </option>

                                {question.matching?.rightItems.map(
                                    (rightItem) => (
                                        <option
                                            key={rightItem.key}
                                            value={rightItem.key}
                                        >
                                            {rightItem.text}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    )
                )}
            </div>
        );
    }

    return (
        <div className="mt-4 space-y-3">
            {question.options.map((option) => {
                const checked =
                    answer.selectedOptionKeys.includes(
                        option.key
                    );

                const isMultiSelect =
                    question.type === "MULTI_SELECT";

                return (
                    <label
                        key={option.key}
                        className={`
                            flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition
                            ${
                                checked
                                    ? "border-indigo-300 bg-indigo-50"
                                    : "border-slate-200 bg-white hover:border-indigo-200"
                            }
                        `}
                    >
                        <input
                            type={
                                isMultiSelect
                                    ? "checkbox"
                                    : "radio"
                            }
                            name={
                                question.assessmentQuestionId
                            }
                            checked={checked}
                            disabled={disabled}
                            onChange={(event) => {
                                if (isMultiSelect) {
                                    onChange({
                                        ...answer,

                                        selectedOptionKeys:
                                            event.target
                                                .checked
                                                ? [
                                                    ...answer
                                                        .selectedOptionKeys,
                                                    option.key,
                                                ]
                                                : answer.selectedOptionKeys.filter(
                                                    (key) =>
                                                        key !==
                                                        option.key
                                                ),
                                    });

                                    return;
                                }

                                onChange({
                                    ...answer,
                                    selectedOptionKeys: [
                                        option.key,
                                    ],
                                });
                            }}
                            className="mt-1 h-4 w-4 accent-indigo-600"
                        />

                        <span className="text-sm leading-6 text-slate-700">
                            {option.text}
                        </span>
                    </label>
                );
            })}
        </div>
    );
};

const AssessmentRunnerStep = () => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const assessmentId = useAppSelector(
        (state) =>
            state.initialAssessment.assessmentId
    );

    const [
        activeAttempt,
        setActiveAttempt,
    ] = useState<StartSectionAttemptResponse | null>(
        null
    );

    const [
        answers,
        setAnswers,
    ] = useState<AnswerMap>({});

    const [
        result,
        setResult,
    ] = useState<SubmitAttemptResponse | null>(
        null
    );

    const [
        actionError,
        setActionError,
    ] = useState<string | null>(null);

    const [
        saveStatus,
        setSaveStatus,
    ] = useState<
        "idle" | "saving" | "saved" | "error"
    >("idle");

    const [
        showSummary,
        setShowSummary,
    ] = useState(false);

    const [
        remainingSeconds,
        setRemainingSeconds,
    ] = useState<number | null>(null);

    const {
        data: sectionsResponse,
        isLoading: sectionsLoading,
        isFetching: sectionsFetching,
        isError: sectionsError,
        refetch: refetchSections,
    } = useGetAssessmentSectionsQuery(
        assessmentId ?? "",
        {
            skip: !assessmentId,
        }
    );

    const [
        startSectionAttempt,
        {
            isLoading: isStarting,
        },
    ] = useStartSectionAttemptMutation();

    const [
        autosaveAttempt,
    ] = useAutosaveAttemptMutation();

    const [
        submitAssessmentAttempt,
        {
            isLoading: isSubmitting,
        },
    ] = useSubmitAssessmentAttemptMutation();

    const sections =
        sectionsResponse?.data ?? [];

    const activeSection = activeAttempt
        ? sections.find(
            (section) =>
                section.sectionId ===
                activeAttempt.sectionId
        )
        : undefined;

    useEffect(() => {
        if (!activeAttempt || result) {
            return;
        }

        const timeLimitSeconds =
            activeSection?.timeLimitSeconds;

        if (!timeLimitSeconds) {
            return;
        }

        const deadline =
            new Date(
                activeAttempt.startedAt
            ).getTime() +
            timeLimitSeconds * 1000;

        const updateRemaining = () => {
            setRemainingSeconds(
                Math.max(
                    0,
                    Math.ceil(
                        (deadline - Date.now()) /
                            1000
                    )
                )
            );
        };

        const initialTick = window.setTimeout(
            updateRemaining,
            0
        );

        const interval = window.setInterval(
            updateRemaining,
            1000
        );

        return () => {
            window.clearTimeout(initialTick);
            window.clearInterval(interval);
        };
    }, [
        activeAttempt,
        activeSection?.timeLimitSeconds,
        result,
    ]);

    useEffect(() => {
        if (!activeAttempt || result) {
            return;
        }

        const payload = buildAnswerPayload(
            activeAttempt.questions,
            answers
        );

        if (payload.length === 0) {
            return;
        }

        const timer = window.setTimeout(
            async () => {
                setSaveStatus("saving");

                try {
                    await autosaveAttempt({
                        attemptId:
                            activeAttempt.attemptId,

                        answers: payload,
                    }).unwrap();

                    setSaveStatus("saved");
                } catch {
                    setSaveStatus("error");
                }
            },
            700
        );

        return () => {
            window.clearTimeout(timer);
        };
    }, [
        activeAttempt,
        answers,
        autosaveAttempt,
        result,
    ]);

    const handleStart = async (
        section: AssessmentSectionView
    ) => {
        setActionError(null);
        setResult(null);
        setShowSummary(false);
        setRemainingSeconds(null);
        setAnswers({});
        setSaveStatus("idle");

        try {
            const response =
                await startSectionAttempt(
                    section.sectionId
                ).unwrap();

            setAnswers(
                Object.fromEntries(
                    response.data.answers.map(
                        (answer) => [
                            answer.assessmentQuestionId,
                            {
                                selectedOptionKeys:
                                    answer.selectedOptionKeys,

                                numericValue:
                                    answer.numericValue ??
                                    "",

                                matchingPairs:
                                    answer.matchingPairs,
                            },
                        ]
                    )
                )
            );

            setActiveAttempt(response.data);
        } catch (error) {
            setActionError(
                getApiErrorMessage(error)
            );
        }
    };

    const handleAnswerChange = (
        questionId: string,
        answer: AnswerState
    ) => {
        setAnswers((current) => ({
            ...current,
            [questionId]: answer,
        }));
    };

    const handleSubmit = async () => {
        if (!activeAttempt) {
            return;
        }

        const payload = buildAnswerPayload(
            activeAttempt.questions,
            answers
        );

        if (payload.length === 0) {
            setActionError(
                "Answer at least one question before submitting this section."
            );

            return;
        }

        setActionError(null);

        try {
            const response =
                await submitAssessmentAttempt({
                    attemptId:
                        activeAttempt.attemptId,

                    answers: payload,
                }).unwrap();

            setResult(response.data);
        } catch (error) {
            setActionError(
                getApiErrorMessage(error)
            );
        }
    };

    const handleContinue = async () => {
        setResult(null);
        setShowSummary(false);
        setActiveAttempt(null);
        setRemainingSeconds(null);
        setAnswers({});
        setSaveStatus("idle");
        setActionError(null);

        await refetchSections();
    };

    const handleFinish = () => {
        window.sessionStorage.removeItem(
            INITIAL_ASSESSMENT_STORAGE_KEY
        );

        dispatch(resetInitialAssessment());
        navigate("/workspace");
    };

    const handleRestart = () => {
        window.sessionStorage.removeItem(
            INITIAL_ASSESSMENT_STORAGE_KEY
        );

        dispatch(resetInitialAssessment());
    };

    if (!assessmentId) {
        return (
            <div className="py-16 text-center">
                <p className="text-slate-600">
                    Your assessment is not ready yet.
                </p>

                <Button
                    className="mt-5"
                    onClick={handleRestart}
                >
                    Restart onboarding
                </Button>
            </div>
        );
    }

    if (sectionsLoading) {
        return (
            <div className="py-16 text-center text-slate-600">
                Loading your assessment sections...
            </div>
        );
    }

    if (sectionsError) {
        return (
            <div className="py-16 text-center">
                <p className="text-red-500">
                    We couldn't load your assessment sections.
                </p>

                <div className="mt-5 flex items-center justify-center gap-3">
                    <Button
                        onClick={() => refetchSections()}
                        loading={sectionsFetching}
                    >
                        Retry
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleRestart}
                    >
                        Restart onboarding
                    </Button>
                </div>
            </div>
        );
    }

    if (showSummary) {
        if (sectionsFetching) {
            return (
                <div className="py-16 text-center text-slate-600">
                    Preparing your assessment summary...
                </div>
            );
        }

        const completedSections =
            sections.filter(
                (section) =>
                    section.status === "COMPLETED" &&
                    section.score !== null
            );

        const averageScore =
            completedSections.length > 0
                ? completedSections.reduce(
                      (total, section) =>
                          total +
                          (section.score ?? 0),
                      0
                  ) / completedSections.length
                : 0;

        return (
            <div>
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600">
                            <Trophy size={24} />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-indigo-700">
                                Initial assessment summary
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                {completedSections.length}{" "}
                                skill
                                {completedSections.length ===
                                1
                                    ? ""
                                    : "s"}{" "}
                                assessed
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">
                                Average score:{" "}
                                {averageScore.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    {sections.map((section) => (
                        <div
                            key={section.sectionId}
                            className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
                        >
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    {section.skillName}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {section.questionCount}{" "}
                                    questions
                                </p>
                            </div>

                            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                                {section.score === null
                                    ? "Not scored"
                                    : `${section.score.toFixed(
                                          1
                                      )}%`}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
                    <Button onClick={handleFinish}>
                        Go to workspace
                    </Button>
                </div>
            </div>
        );
    }

    if (result) {
        const questionById = new Map(
            (
                activeAttempt?.questions ?? []
            ).map((question) => [
                question.assessmentQuestionId,
                question,
            ])
        );

        return (
            <div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
                            <Trophy size={24} />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-emerald-700">
                                {result.assessmentCompleted
                                    ? "Initial assessment complete"
                                    : "Section complete"}
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                {result.correctCount} of{" "}
                                {result.questionCount} correct
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">
                                Score:{" "}
                                {result.percentage.toFixed(
                                    1
                                )}
                                %
                            </p>
                        </div>
                    </div>
                </div>

                {result.weakTopics.length > 0 && (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5">
                        <h3 className="font-semibold text-amber-950">
                            Topics to strengthen
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {result.weakTopics.map(
                                (topic) => (
                                    <span
                                        key={topic.topicId}
                                        className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-800"
                                    >
                                        {topic.topicName}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-6 space-y-3">
                    {result.questions.map(
                        (questionResult) => {
                            const question =
                                questionById.get(
                                    questionResult.assessmentQuestionId
                                );

                            return (
                                <div
                                    key={
                                        questionResult.assessmentQuestionId
                                    }
                                    className="rounded-xl border border-slate-200 p-5"
                                >
                                    <div className="flex items-start gap-3">
                                        {questionResult.isCorrect ? (
                                            <CheckCircle2
                                                size={19}
                                                className="mt-0.5 shrink-0 text-emerald-600"
                                            />
                                        ) : (
                                            <AlertCircle
                                                size={19}
                                                className="mt-0.5 shrink-0 text-red-500"
                                            />
                                        )}

                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                {question?.stem ??
                                                    "Question"}
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                                {questionResult.explanation ||
                                                    "No explanation available."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>

                <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
                    <Button
                        onClick={
                            result.assessmentCompleted
                                ? () =>
                                      setShowSummary(
                                          true
                                      )
                                : handleContinue
                        }
                    >
                        {result.assessmentCompleted
                            ? "View summary"
                            : "Continue to next skill"}
                    </Button>
                </div>
            </div>
        );
    }

    if (activeAttempt) {
        const answeredCount =
            buildAnswerPayload(
                activeAttempt.questions,
                answers
            ).length;

        return (
            <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-indigo-600">
                            Section{" "}
                            {activeSection?.displayOrder ??
                                1}{" "}
                            of {sections.length}
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-slate-900">
                            {activeSection?.skillName ??
                                "Skill assessment"}
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            {answeredCount} of{" "}
                            {activeAttempt.questions.length}{" "}
                            questions answered
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                            <Clock3 size={14} />
                            Attempt{" "}
                            {activeAttempt.attemptNumber}
                        </span>

                        {remainingSeconds !== null && (
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold ${
                                    remainingSeconds <= 60
                                        ? "bg-red-50 text-red-700"
                                        : "bg-slate-100 text-slate-600"
                                }`}
                            >
                                <Clock3 size={14} />

                                {remainingSeconds === 0
                                    ? "Time is up - submit to continue"
                                    : `${formatDuration(
                                          remainingSeconds
                                      )} left`}
                            </span>
                        )}

                        <span>
                            {saveStatus === "saving"
                                ? "Saving..."
                                : saveStatus === "saved"
                                    ? "Progress saved"
                                    : saveStatus === "error"
                                        ? "Could not save progress"
                                        : "Answers save automatically"}
                        </span>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    {activeAttempt.questions.map(
                        (question, index) => (
                            <div
                                key={
                                    question.assessmentQuestionId
                                }
                                className="rounded-2xl border border-slate-200 bg-white p-5"
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                                        Question {index + 1}
                                    </span>

                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${difficultyClass(
                                            question.difficulty
                                        )}`}
                                    >
                                        {question.difficulty}
                                    </span>

                                    <span className="text-[11px] text-slate-400">
                                        {question.points} point
                                        {question.points === 1
                                            ? ""
                                            : "s"}
                                    </span>
                                </div>

                                <p className="mt-3 text-base font-medium leading-7 text-slate-900">
                                    {question.stem}
                                </p>

                                <QuestionField
                                    question={question}
                                    answer={
                                        answers[
                                            question
                                                .assessmentQuestionId
                                        ] ?? emptyAnswer()
                                    }
                                    disabled={isSubmitting}
                                    onChange={(answer) =>
                                        handleAnswerChange(
                                            question.assessmentQuestionId,
                                            answer
                                        )
                                    }
                                />
                            </div>
                        )
                    )}
                </div>

                {actionError && (
                    <div
                        role="alert"
                        className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <AlertCircle
                            size={18}
                            className="mt-0.5 shrink-0"
                        />

                        <p>{actionError}</p>
                    </div>
                )}

                <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        variant="outline"
                        onClick={handleContinue}
                        disabled={isSubmitting}
                    >
                        Back to sections
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        loading={isSubmitting}
                    >
                        Submit section
                    </Button>
                </div>
            </div>
        );
    }

    const allSectionsCompleted =
        sections.length > 0 &&
        sections.every(
            (section) =>
                section.status === "COMPLETED"
        );

    return (
        <div>
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <ClipboardList size={22} />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        {allSectionsCompleted
                            ? "Your assessment is complete"
                            : "Complete each skill section"}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                        {allSectionsCompleted
                            ? "Your scores have been saved and your journey is ready."
                            : "Finish one section at a time. You can leave and resume a section later."}
                    </p>
                </div>
            </div>

            {actionError && (
                <div
                    role="alert"
                    className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
                >
                    <AlertCircle
                        size={18}
                        className="mt-0.5 shrink-0"
                    />

                    <p>{actionError}</p>
                </div>
            )}

            <div className="mt-6 space-y-3">
                {sections.map((section) => (
                    <div
                        key={section.sectionId}
                        className="flex flex-col gap-4 rounded-xl border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
                                {section.displayOrder}
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    {section.skillName}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {section.questionCount}{" "}
                                    questions ·{" "}
                                    {Math.round(
                                        section.timeLimitSeconds /
                                            60
                                    )}{" "}
                                    min suggested ·{" "}
                                    {sectionStatusLabel(
                                        section.status
                                    )}
                                    {section.score !== null
                                        ? ` · ${section.score.toFixed(
                                            0
                                        )}%`
                                        : ""}
                                </p>
                            </div>
                        </div>

                        <Button
                            size="sm"
                            variant={
                                section.status ===
                                "COMPLETED"
                                    ? "outline"
                                    : "primary"
                            }
                            disabled={
                                isStarting ||
                                section.status ===
                                "CANCELLED"
                            }
                            loading={isStarting}
                            onClick={() =>
                                handleStart(section)
                            }
                        >
                            {sectionActionLabel(
                                section.status
                            )}
                        </Button>
                    </div>
                ))}
            </div>

            {sections.length === 0 && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
                    No assessment sections were found.
                </div>
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="inline-flex items-center gap-2 text-xs text-slate-500">
                    <RefreshCw size={14} />
                    Completed sections can be retaken.
                </p>

                {allSectionsCompleted && (
                    <Button onClick={handleFinish}>
                        Go to workspace
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AssessmentRunnerStep;
