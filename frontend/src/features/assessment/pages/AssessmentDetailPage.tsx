import {
    BarChart3,
    ClipboardCheck,
} from "lucide-react";

import {
    useParams,
} from "react-router-dom";

import {
    useGetAssessmentDetailsQuery,
} from "../api/assessmentApi";

import AssessmentSkillResultCard from "../components/AssessmentSkillResultCard";

const AssessmentDetailPage = () => {

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
            <AssessmentDetailLoading />
        );

    }

    if (
        isError ||
        !data?.data
    ) {

        return (

            <div className="min-h-screen bg-slate-50">

                <div
                    className="
                        flex
                        min-h-150
                        items-center
                        justify-center
                        px-4
                        sm:px-6
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-md
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            text-center
                            shadow-sm
                            sm:p-8
                        "
                    >

                        <h2
                            className="
                                text-xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Unable to load assessment
                        </h2>

                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-600
                            "
                        >
                            Assessment details could not
                            be loaded. Please try again.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                refetch()
                            }
                            className="
                                mt-6
                                rounded-xl
                                bg-blue-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-blue-700
                            "
                        >
                            Try Again
                        </button>

                    </div>

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

        <div className="min-h-screen bg-slate-50">

            <div
                className="
                    mx-auto
                    max-w-6xl
                    px-4
                    py-8
                    sm:px-6
                    sm:py-10
                    lg:px-8
                "
            >

                {/* Assessment Header */}

                <section
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            relative
                            overflow-hidden
                            p-5
                            sm:p-7
                            lg:p-8
                        "
                    >

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-16
                                -top-20
                                h-56
                                w-56
                                rounded-full
                                bg-blue-50
                                blur-3xl
                            "
                        />

                        <div
                            className="
                                relative
                                flex
                                flex-col
                                gap-5
                                sm:flex-row
                                sm:items-start
                                sm:justify-between
                            "
                        >

                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-start
                                    gap-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                        text-blue-600
                                    "
                                >

                                    <ClipboardCheck
                                        size={23}
                                    />

                                </div>

                                <div className="min-w-0">

                                    <span
                                        className="
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-[0.12em]
                                            text-blue-600
                                        "
                                    >

                                        {assessment.type ===
                                            "INITIAL"
                                            ? "Initial Assessment"
                                            : `Week ${assessment.weekNumber} Assessment`
                                        }

                                    </span>

                                    <h1
                                        className="
                                            mt-1
                                            text-2xl
                                            font-bold
                                            tracking-tight
                                            text-slate-900
                                            sm:text-3xl
                                        "
                                    >
                                        {assessment.title}
                                    </h1>

                                    {assessment.description && (

                                        <p
                                            className="
                                                mt-3
                                                max-w-2xl
                                                text-sm
                                                leading-6
                                                text-slate-600
                                                sm:text-base
                                                sm:leading-7
                                            "
                                        >
                                            {assessment.description}
                                        </p>

                                    )}

                                    {completedDate && (

                                        <p
                                            className="
                                                mt-4
                                                text-xs
                                                font-medium
                                                text-slate-400
                                            "
                                        >
                                            Completed {completedDate}
                                        </p>

                                    )}

                                </div>

                            </div>

                            <span
                                className="
                                    w-fit
                                    shrink-0
                                    rounded-full
                                    bg-emerald-50
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-emerald-700
                                "
                            >
                                {assessment.status}
                            </span>

                        </div>

                    </div>

                </section>

                {/* Summary */}

                <div
                    className="
                        mt-5
                        grid
                        gap-4
                        sm:grid-cols-2
                    "
                >

                    <SummaryCard
                        icon={BarChart3}
                        label="Average Score"
                        value={`${summary.averagePercentage}%`}
                    />

                    <SummaryCard
                        icon={ClipboardCheck}
                        label="Skills Assessed"
                        value={`${summary.totalSkills}`}
                    />

                </div>

                {/* Skill Results */}

                <section className="mt-8">

                    <div>

                        <h2
                            className="
                                text-xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Skill Results
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            See how you performed across
                            every skill included in this
                            assessment.
                        </p>

                    </div>

                    {skills.length === 0 ? (

                        <div
                            className="
                                mt-5
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-8
                                text-center
                                text-sm
                                text-slate-500
                            "
                        >
                            No skill results are available
                            for this assessment.
                        </div>

                    ) : (

                        <div
                            className="
                                mt-5
                                grid
                                gap-4
                                lg:grid-cols-2
                            "
                        >

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

                </section>

            </div>

        </div>

    );

};

interface SummaryCardProps {

    icon:
    React.ComponentType<{
        size?: number;
        className?: string;
    }>;

    label: string;

    value: string;

}

const SummaryCard = ({

    icon: Icon,

    label,

    value,

}: SummaryCardProps) => {

    return (

        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <div
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        bg-blue-50
                        text-blue-600
                    "
                >

                    <Icon size={18} />

                </div>

                <p
                    className="
                        text-sm
                        font-medium
                        text-slate-500
                    "
                >
                    {label}
                </p>

            </div>

            <p
                className="
                    mt-4
                    text-3xl
                    font-bold
                    tracking-tight
                    text-slate-900
                "
            >
                {value}
            </p>

        </div>

    );

};

const AssessmentDetailLoading = () => {

    return (

        <div className="min-h-screen bg-slate-50">

            <div
                className="
                    mx-auto
                    max-w-6xl
                    px-4
                    py-8
                    sm:px-6
                    sm:py-10
                    lg:px-8
                "
            >

                <div
                    className="
                        h-5
                        w-40
                        animate-pulse
                        rounded
                        bg-slate-200
                    "
                />

                <div
                    className="
                        mt-6
                        h-60
                        animate-pulse
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                    "
                />

                <div
                    className="
                        mt-5
                        grid
                        gap-4
                        sm:grid-cols-2
                    "
                >

                    {[1, 2].map(
                        (item) => (

                            <div
                                key={item}
                                className="
                                    h-32
                                    animate-pulse
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                "
                            />

                        )
                    )}

                </div>

                <div
                    className="
                        mt-8
                        h-7
                        w-40
                        animate-pulse
                        rounded
                        bg-slate-200
                    "
                />

                <div
                    className="
                        mt-5
                        grid
                        gap-4
                        lg:grid-cols-2
                    "
                >

                    {[1, 2, 3, 4].map(
                        (item) => (

                            <div
                                key={item}
                                className="
                                    h-56
                                    animate-pulse
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                "
                            />

                        )
                    )}

                </div>

            </div>

        </div>

    );

};

export default AssessmentDetailPage;