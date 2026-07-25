import {
    ArrowLeft,
    BarChart3,
    ClipboardCheck,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    useGetAssessmentDetailsQuery,
} from "../api/assessmentApi";

import AssessmentSkillResultCard from "../components/AssessmentSkillResultCard";

const AssessmentDetailPage = () => {

    const navigate =
        useNavigate();

    const {
        assessmentId,
    } = useParams<{
        assessmentId: string;
    }>();

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetAssessmentDetailsQuery(
        assessmentId ?? "",
        {
            skip:
                !assessmentId,
        }
    );

    if (isLoading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <p className="text-slate-600">
                    Loading assessment details...
                </p>
            </div>
        );
    }

    if (
        isError ||
        !data?.data
    ) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">

                <div className="text-center">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Unable to load assessment
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                        Assessment details could not
                        be loaded.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            refetch()
                        }
                        className="
                            mt-5
                            rounded-lg
                            bg-indigo-600
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                        "
                    >
                        Retry
                    </button>

                </div>

            </div>
        );
    }

    const {
        assessment,
        skills,
        summary,
    } = data.data;

    const completedDate =
        assessment.completedAt
            ? new Date(
                assessment.completedAt
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }
            )
            : null;

    return (
        <div className="mx-auto max-w-5xl px-6 py-10">

            <button
                type="button"
                onClick={() =>
                    navigate("/assessments")
                }
                className="
                    mb-6
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-slate-600
                    transition
                    hover:text-slate-900
                "
            >
                <ArrowLeft
                    size={17}
                />

                Back to Assessments
            </button>

            <div
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    md:p-8
                "
            >

                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">

                    <div className="flex items-start gap-4">

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-indigo-50
                                text-indigo-600
                            "
                        >
                            <ClipboardCheck
                                size={24}
                            />
                        </div>

                        <div>

                            <span className="text-sm font-semibold text-indigo-600">
                                {assessment.type ===
                                    "INITIAL"
                                    ? "Initial Assessment"
                                    : `Week ${assessment.weekNumber} Assessment`}
                            </span>

                            <h1 className="mt-1 text-2xl font-bold text-slate-900">
                                {assessment.title}
                            </h1>

                            {assessment.description && (
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                    {
                                        assessment.description
                                    }
                                </p>
                            )}

                            {completedDate && (
                                <p className="mt-3 text-xs text-slate-500">
                                    Completed{" "}
                                    {completedDate}
                                </p>
                            )}

                        </div>

                    </div>

                    <span
                        className="
                            self-start
                            rounded-full
                            bg-emerald-50
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-emerald-700
                        "
                    >
                        {assessment.status}
                    </span>

                </div>

            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div
                    className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                    "
                >
                    <div className="flex items-center gap-3">

                        <BarChart3
                            size={20}
                            className="text-indigo-600"
                        />

                        <p className="text-sm font-medium text-slate-600">
                            Average Score
                        </p>

                    </div>

                    <p className="mt-3 text-3xl font-bold text-slate-900">
                        {summary.averagePercentage}%
                    </p>

                </div>

                <div
                    className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                    "
                >
                    <div className="flex items-center gap-3">

                        <ClipboardCheck
                            size={20}
                            className="text-indigo-600"
                        />

                        <p className="text-sm font-medium text-slate-600">
                            Skills Assessed
                        </p>

                    </div>

                    <p className="mt-3 text-3xl font-bold text-slate-900">
                        {summary.totalSkills}
                    </p>

                </div>

            </div>

            <div className="mt-8">

                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Skill Results
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                        Detailed results for every
                        skill included in this assessment.
                    </p>
                </div>

                {skills.length === 0 ? (

                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                        No skill results are available
                        for this assessment.
                    </div>

                ) : (

                    <div className="space-y-4">
                        {skills.map(
                            (skill) => (
                                <AssessmentSkillResultCard
                                    key={
                                        skill.id
                                    }
                                    skill={
                                        skill
                                    }
                                />
                            )
                        )}
                    </div>

                )}

            </div>

        </div>
    );
};

export default AssessmentDetailPage;