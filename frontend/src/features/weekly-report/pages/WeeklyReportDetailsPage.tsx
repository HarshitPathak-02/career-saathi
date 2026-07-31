import {
    Brain,
    CheckCircle2,
    Clock3,
    Lightbulb,
    MessageSquareText,
    Target,
    TrendingDown,
    TrendingUp,
    Trophy,
    Zap,
    Book
} from "lucide-react";

import {
    useParams,
} from "react-router-dom";

import {
    useGetWeeklyReportDetailsQuery,
} from "../api/weeklyReportApi";

export default function WeeklyReportDetailsPage() {

    const {
        reportId,
    } = useParams();

    const {
        data: response,
        isLoading,
        isError,
        error,
    } =
        useGetWeeklyReportDetailsQuery(
            reportId ?? "",
            {
                skip: !reportId,
            }
        );

    /*
    |--------------------------------------------------------------------------
    | Invalid Report
    |--------------------------------------------------------------------------
    */

    if (!reportId) {

        return (

            <div className="p-6">

                Invalid weekly report.

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (isLoading) {

        return (

            <div
                className="
                    flex
                    min-h-100
                    items-center
                    justify-center
                "
            >

                <p className="text-sm text-slate-500">

                    Loading weekly report...

                </p>

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (
        isError ||
        !response?.data
    ) {

        console.error(
            "Weekly report error:",
            error,
        );

        return (

            <div className="p-6">

                <div
                    className="
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        p-5
                    "
                >

                    <h2 className="font-semibold text-red-900">

                        Weekly report unavailable

                    </h2>

                    <p className="mt-1 text-sm text-red-700">

                        We could not load this weekly report.

                    </p>

                </div>

            </div>

        );

    }

    const report =
        response.data;

    const {
        assessment,
        reflection,
        summary,
        mentorFeedback,
        recommendation,
        skills,
    } = report;

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    const formatEnum = (
        value: string | null
    ) => {

        if (!value) {
            return "Not provided";
        }

        return value
            .toLowerCase()
            .split("_")
            .map(
                word =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");

    };

    const formatDate = (
        value: string
    ) => {

        return new Date(
            value
        ).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );

    };

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div
            className="
                mx-auto
                max-w-6xl
                space-y-8
                p-6
                pb-16
            "
        >
            <section>

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        md:flex-row
                        md:items-end
                        md:justify-between
                    "
                >

                    <div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                uppercase
                                tracking-wide
                                text-indigo-600
                            "
                        >

                            Week {assessment.weekNumber}

                        </p>

                        <h1
                            className="
                                mt-1
                                text-3xl
                                font-bold
                                tracking-tight
                                text-slate-900
                            "
                        >

                            Weekly Progress Report

                        </h1>

                        <p className="mt-2 text-sm text-slate-500">

                            Generated {formatDate(report.generatedAt)}

                        </p>

                    </div>

                    <div
                        className="
                            rounded-full
                            bg-green-50
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-green-700
                        "
                    >

                        {formatEnum(report.status)}

                    </div>

                </div>

            </section>


            {/* -------------------------------------------------------------- */}
            {/* Weekly Summary */}
            {/* -------------------------------------------------------------- */}

            <section
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-7
                    shadow-sm
                "
            >

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-indigo-50
                            text-indigo-600
                        "
                    >

                        <Brain size={21} />

                    </div>

                    <h2 className="text-xl font-semibold text-slate-900">

                        Weekly Summary

                    </h2>

                </div>

                <p
                    className="
                        mt-5
                        leading-7
                        text-slate-600
                    "
                >

                    {summary.summary}

                </p>

            </section>


            {/* -------------------------------------------------------------- */}
            {/* Weekly Overview */}
            {/* -------------------------------------------------------------- */}

            <section>

                <h2 className="text-xl font-semibold text-slate-900">

                    Week Overview

                </h2>

                <div
                    className="
                        mt-4
                        grid
                        gap-4
                        sm:grid-cols-2
                        lg:grid-cols-4
                    "
                >

                    {/* Tasks */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                        "
                    >

                        <CheckCircle2
                            size={22}
                            className="text-green-600"
                        />

                        <p className="mt-4 text-sm text-slate-500">

                            Tasks

                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">

                            {reflection.learningReflection.completedAllTasks
                                ? "Completed"
                                : "Incomplete"}

                        </p>

                    </div>


                    {/* Confidence */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                        "
                    >

                        <Brain
                            size={22}
                            className="text-indigo-600"
                        />

                        <p className="mt-4 text-sm text-slate-500">

                            Confidence

                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">

                            {
                                reflection
                                    .learningReflection
                                    .confidenceRating
                            } / 5

                        </p>

                    </div>


                    {/* Overall Week */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                        "
                    >

                        <Trophy
                            size={22}
                            className="text-amber-500"
                        />

                        <p className="mt-4 text-sm text-slate-500">

                            Overall Week

                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">

                            {formatEnum(
                                reflection
                                    .mentorCheckIn
                                    .overallWeek
                            )}

                        </p>

                    </div>


                    {/* Motivation */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                        "
                    >

                        <Zap
                            size={22}
                            className="text-orange-500"
                        />

                        <p className="mt-4 text-sm text-slate-500">

                            Motivation

                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">

                            {formatEnum(
                                reflection
                                    .mentorCheckIn
                                    .motivationLevel
                            )}

                        </p>

                    </div>

                </div>

            </section>


            {/* -------------------------------------------------------------- */}
            {/* Skill Performance */}
            {/* -------------------------------------------------------------- */}

            <section
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-7
                    shadow-sm
                "
            >

                <div>

                    <h2 className="text-xl font-semibold text-slate-900">

                        Skill Performance

                    </h2>

                    <p className="mt-1 text-sm text-slate-500">

                        Your assessment results for the skills covered this week.

                    </p>

                </div>

                {skills.length === 0 ? (

                    <p className="mt-6 text-sm text-slate-500">

                        No skill assessment results available.

                    </p>

                ) : (

                    <div className="mt-7 space-y-7">

                        {skills.map(
                            skill => (

                                <div
                                    key={
                                        skill.userSkillId
                                    }
                                >

                                    <div
                                        className="
                                            flex
                                            items-end
                                            justify-between
                                            gap-4
                                        "
                                    >

                                        <div>

                                            <p className="font-semibold text-slate-900">

                                                {skill.skillName}

                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">

                                                {skill.obtainedMarks}
                                                {" / "}
                                                {skill.totalMarks}
                                                {" marks"}

                                            </p>

                                        </div>

                                        <div className="text-right">

                                            <p className="text-lg font-bold text-slate-900">

                                                {skill.percentage}%

                                            </p>

                                            {skill.improvementPercentage !== null && (

                                                <div
                                                    className={`
                                                        mt-1
                                                        flex
                                                        items-center
                                                        justify-end
                                                        gap-1
                                                        text-xs
                                                        font-medium
                                                        ${skill.improvementPercentage >= 0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                        }
                                                    `}
                                                >

                                                    {skill.improvementPercentage >= 0
                                                        ? <TrendingUp size={14} />
                                                        : <TrendingDown size={14} />
                                                    }

                                                    {skill.improvementPercentage > 0
                                                        ? "+"
                                                        : ""
                                                    }

                                                    {skill.improvementPercentage}%

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                    <div
                                        className="
                                            mt-3
                                            h-3
                                            overflow-hidden
                                            rounded-full
                                            bg-slate-100
                                        "
                                    >

                                        <div
                                            className="
                                                h-full
                                                rounded-full
                                                bg-indigo-600
                                                transition-all
                                                duration-500
                                            "
                                            style={{
                                                width:
                                                    `${Math.min(
                                                        Math.max(
                                                            skill.percentage,
                                                            0
                                                        ),
                                                        100
                                                    )}%`,
                                            }}
                                        />

                                    </div>

                                    {skill.improvementPercentage === null && (

                                        <p className="mt-2 text-xs text-slate-400">

                                            First weekly assessment — improvement tracking begins next week.

                                        </p>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* -------------------------------------------------------------- */}
            {/* Achievements + Improvements */}
            {/* -------------------------------------------------------------- */}

            <section
                className="
                    grid
                    gap-6
                    lg:grid-cols-2
                "
            >

                {/* Achievements */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-green-200
                        bg-green-50/40
                        p-7
                    "
                >

                    <div className="flex items-center gap-3">

                        <Trophy
                            size={22}
                            className="text-green-600"
                        />

                        <h2 className="text-xl font-semibold text-slate-900">

                            Achievements

                        </h2>

                    </div>

                    <div className="mt-5 space-y-3">

                        {summary.achievements.map(
                            (
                                achievement,
                                index
                            ) => (

                                <div
                                    key={index}
                                    className="flex items-start gap-3"
                                >

                                    <CheckCircle2
                                        size={18}
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-green-600
                                        "
                                    />

                                    <p className="text-sm leading-6 text-slate-700">

                                        {achievement}

                                    </p>

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* Improvements */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-amber-200
                        bg-amber-50/40
                        p-7
                    "
                >

                    <div className="flex items-center gap-3">

                        <Target
                            size={22}
                            className="text-amber-600"
                        />

                        <h2 className="text-xl font-semibold text-slate-900">

                            Areas to Improve

                        </h2>

                    </div>

                    <div className="mt-5 space-y-3">

                        {summary.improvements.map(
                            (
                                improvement,
                                index
                            ) => (

                                <div
                                    key={index}
                                    className="flex items-start gap-3"
                                >

                                    <Target
                                        size={17}
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-amber-600
                                        "
                                    />

                                    <p className="text-sm leading-6 text-slate-700">

                                        {improvement}

                                    </p>

                                </div>

                            )
                        )}

                    </div>

                </div>

            </section>


            {/* -------------------------------------------------------------- */}
            {/* Learning Reflection */}
            {/* -------------------------------------------------------------- */}

            <section
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-7
                "
            >

                <div className="flex items-center gap-3">

                    <MessageSquareText
                        size={22}
                        className="text-indigo-600"
                    />

                    <div>

                        <h2 className="text-xl font-semibold text-slate-900">

                            Your Reflection

                        </h2>

                        <p className="mt-1 text-sm text-slate-500">

                            What you shared at the end of the week.

                        </p>

                    </div>

                </div>

                <div
                    className="
                        mt-6
                        grid
                        gap-5
                        md:grid-cols-2
                    "
                >

                    <div>

                        <p className="text-sm text-slate-500">

                            Main Difficulty

                        </p>

                        <p className="mt-1 font-semibold text-slate-900">

                            {formatEnum(
                                reflection
                                    .learningReflection
                                    .difficultyType
                            )}

                        </p>

                    </div>

                    {!reflection.learningReflection.completedAllTasks && (

                        <div>

                            <p className="text-sm text-slate-500">

                                Reason for Incomplete Tasks

                            </p>

                            <p className="mt-1 font-semibold text-slate-900">

                                {formatEnum(
                                    reflection
                                        .learningReflection
                                        .reason
                                )}

                            </p>

                        </div>

                    )}

                    <div>

                        <p className="text-sm text-slate-500">

                            External Factors

                        </p>

                        <p className="mt-1 font-medium text-slate-800">

                            {
                                reflection
                                    .mentorCheckIn
                                    .externalFactors ||
                                "None reported"
                            }

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Career Concern

                        </p>

                        <p className="mt-1 font-medium text-slate-800">

                            {
                                reflection
                                    .mentorCheckIn
                                    .careerConcern ||
                                "None reported"
                            }

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Help Needed

                        </p>

                        <p className="mt-1 font-medium text-slate-800">

                            {
                                reflection
                                    .mentorCheckIn
                                    .helpNeeded ||
                                "None reported"
                            }

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Additional Comments

                        </p>

                        <p className="mt-1 font-medium text-slate-800">

                            {
                                reflection
                                    .additionalComments ||
                                "No additional comments"
                            }

                        </p>

                    </div>

                </div>

            </section>


            {/* -------------------------------------------------------------- */}
            {/* Mentor Feedback */}
            {/* -------------------------------------------------------------- */}

            <section
                className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-indigo-200
                    bg-indigo-50/40
                "
            >

                <div className="p-7">

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-indigo-100
                                text-indigo-600
                            "
                        >

                            <Lightbulb size={21} />

                        </div>

                        <h2 className="text-xl font-semibold text-slate-900">

                            AI Mentor Feedback

                        </h2>

                    </div>

                    <p className="mt-5 leading-7 text-slate-700">

                        {mentorFeedback.advice}

                    </p>

                </div>

                <div
                    className="
                        border-t
                        border-indigo-200
                        bg-indigo-100/40
                        px-7
                        py-5
                    "
                >

                    <p className="text-sm font-semibold text-indigo-900">

                        Mentor Message

                    </p>

                    <p className="mt-2 leading-6 text-indigo-800">

                        {mentorFeedback.motivationMessage}

                    </p>

                </div>

            </section>


            {/* -------------------------------------------------------------- */}
            {/* Next Week Recommendations */}
            {/* -------------------------------------------------------------- */}

            <section
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-7
                    shadow-sm
                "
            >

                <div className="flex items-center gap-3">

                    <Target
                        size={22}
                        className="text-indigo-600"
                    />

                    <div>

                        <h2 className="text-xl font-semibold text-slate-900">

                            Next Week Recommendations

                        </h2>

                        <p className="mt-1 text-sm text-slate-500">

                            Your personalized focus for the next mission.

                        </p>

                    </div>

                </div>


                {/* Recommendation Stats */}

                <div
                    className="
                        mt-7
                        grid
                        gap-4
                        sm:grid-cols-2
                        lg:grid-cols-3
                    "
                >

                    <div
                        className="
                            rounded-xl
                            bg-slate-50
                            p-5
                        "
                    >

                        <p className="text-sm text-slate-500">

                            Recommended Difficulty

                        </p>

                        <p className="mt-2 text-lg font-bold text-slate-900">

                            {formatEnum(
                                recommendation
                                    .recommendedDifficulty
                            )}

                        </p>

                    </div>

                    <div
                        className="
                            rounded-xl
                            bg-slate-50
                            p-5
                        "
                    >

                        <div className="flex items-center gap-2 text-slate-500">

                            <Clock3 size={17} />

                            <p className="text-sm">

                                Study Time

                            </p>

                        </div>

                        <p className="mt-2 text-lg font-bold text-slate-900">

                            {
                                recommendation
                                    .recommendedStudyHours
                            } hours

                        </p>

                    </div>

                    <div
                        className="
                            rounded-xl
                            bg-slate-50
                            p-5
                        "
                    >

                        <p className="text-sm text-slate-500">

                            Revision Priority

                        </p>

                        <p className="mt-2 text-lg font-bold text-slate-900">

                            {recommendation.prioritizeRevision
                                ? "High Priority"
                                : "Normal"}

                        </p>

                    </div>

                </div>


                {/* Weak Skills */}

                <div className="mt-8">

                    <h3 className="font-semibold text-slate-900">

                        Weak Skills

                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">

                        {recommendation.weakSkills.map(
                            skill => (

                                <span
                                    key={skill}
                                    className="
                                        rounded-full
                                        bg-red-50
                                        px-3
                                        py-1.5
                                        text-sm
                                        font-medium
                                        text-red-700
                                    "
                                >

                                    {skill}

                                </span>

                            )
                        )}

                    </div>

                </div>


                {/* Revision Topics */}

                <div className="mt-8">

                    <h3 className="font-semibold text-slate-900">

                        Topics to Revise

                    </h3>

                    <div className="mt-3 space-y-3">

                        {recommendation.revisionTopics.map(
                            (
                                topic,
                                index
                            ) => (

                                <div
                                    key={index}
                                    className="
                                        flex
                                        items-start
                                        gap-3
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        p-4
                                    "
                                >

                                    <BookOpenIcon />

                                    <p className="text-sm leading-6 text-slate-700">

                                        {topic}

                                    </p>

                                </div>

                            )
                        )}

                    </div>

                </div>

            </section>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Small Local Icon
|--------------------------------------------------------------------------
*/

function BookOpenIcon() {

    return (

        <div
            className="
                mt-0.5
                flex
                h-6
                w-6
                shrink-0
                items-center
                justify-center
                text-xs
                font-bold
                text-indigo-600
            "
        >

            <Book />

        </div>

    );

}