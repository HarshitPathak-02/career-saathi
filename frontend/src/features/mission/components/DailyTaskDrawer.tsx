import {
    Clock3,
    CheckCircle2,
    Circle,
    XCircle,
    X,
    BookOpen,
    Video,
    FileText,
    ExternalLink,
    GraduationCap,
    Sparkles,
} from "lucide-react";

import type {
    DailyTask,
} from "../types/daily-task.types";

import {
    DailyTaskStatus,
} from "../types/daily-task.types";

interface DailyTaskDrawerProps {

    task: DailyTask | null;

    currentMissionDay: number;

    open: boolean;

    isCompleting?: boolean;

    onClose: () => void;

    onComplete?: (taskId: string) => void;

    onStartWeeklyReview?: () => void;

}

const DailyTaskDrawer = ({

    task,

    currentMissionDay,

    open,

    isCompleting = false,

    onClose,

    onComplete,

    onStartWeeklyReview,

}: DailyTaskDrawerProps) => {

    if (!open || !task) {

        return null;

    }

    /*
    |--------------------------------------------------------------------------
    | Task State
    |--------------------------------------------------------------------------
    */

    const isPending =
        task.status ===
        DailyTaskStatus.PENDING;

    const isAvailable =
        task.dayNumber <=
        currentMissionDay;

    const isWeeklyReview =
        task.dayNumber === 7;

    const canCompleteRegularTask =
        isPending &&
        isAvailable &&
        !isWeeklyReview;

    const canStartWeeklyReview =
        isPending &&
        isAvailable &&
        isWeeklyReview;

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    const renderStatus = () => {

        switch (task.status) {

            case DailyTaskStatus.COMPLETED:

                return (
                    <span
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            bg-emerald-50
                            px-3
                            py-1.5
                            text-sm
                            font-semibold
                            text-emerald-700
                        "
                    >
                        <CheckCircle2
                            size={16}
                        />

                        Completed
                    </span>
                );

            case DailyTaskStatus.SKIPPED:

                return (
                    <span
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            bg-slate-100
                            px-3
                            py-1.5
                            text-sm
                            font-semibold
                            text-slate-600
                        "
                    >
                        <XCircle
                            size={16}
                        />

                        Skipped
                    </span>
                );

            default:

                return (
                    <span
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            bg-blue-50
                            px-3
                            py-1.5
                            text-sm
                            font-semibold
                            text-blue-700
                        "
                    >
                        <Circle
                            size={16}
                        />

                        Pending
                    </span>
                );

        }

    };

    const renderResourceIcon = (type: string) => {
        switch (type) {
            case "VIDEO":
                return <Video size={16} className="text-red-500" />;
            case "PDF":
            case "CHEATSHEET":
                return <FileText size={16} className="text-emerald-600" />;
            case "DOCUMENTATION":
            case "ARTICLE":
                return <BookOpen size={16} className="text-blue-500" />;
            case "COURSE":
                return <GraduationCap size={16} className="text-amber-500" />;
            default:
                return <Sparkles size={16} className="text-purple-500" />;
        }
    };

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (
        <>

            {/* Overlay */}

            <div
                onClick={onClose}
                className="
                    fixed
                    inset-0
                    z-40
                    bg-slate-950/40
                    backdrop-blur-[2px]
                "
            />

            {/* Drawer */}

            <aside
                className="
                    fixed
                    bottom-0
                    right-0
                    top-0
                    z-50
                    flex
                    w-full
                    flex-col
                    bg-white
                    shadow-2xl
                    sm:max-w-xl
                "
            >

                {/* Header */}

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-5
                        border-b
                        border-slate-200
                        px-5
                        py-5
                        sm:px-7
                        sm:py-6
                    "
                >

                    <div className="min-w-0">

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-blue-600
                            "
                        >
                            Day {task.dayNumber}
                        </p>

                        <h2
                            className="
                                mt-1
                                text-xl
                                font-bold
                                tracking-tight
                                text-slate-900
                                sm:text-2xl
                            "
                        >
                            {task.title}
                        </h2>

                    </div>

                    <button
                        type="button"
                        aria-label="Close task details"
                        onClick={onClose}
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            text-slate-500
                            transition
                            hover:bg-slate-50
                            hover:text-slate-900
                        "
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Scrollable Content */}

                <div
                    className="
                        flex-1
                        overflow-y-auto
                        px-5
                        py-6
                        sm:px-7
                    "
                >

                    {/* Status */}

                    <div>
                        {renderStatus()}
                    </div>

                    {/* Description */}

                    <section className="mt-7">

                        <h3
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                            "
                        >
                            What you'll work on
                        </h3>

                        <p
                            className="
                                mt-2
                                text-sm
                                leading-7
                                text-slate-600
                            "
                        >
                            {task.description}
                        </p>

                    </section>

                    {/* Topics */}

                    <section className="mt-7">

                        <h3
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                            "
                        >
                            Topics to cover
                        </h3>

                        <div className="mt-3 space-y-2">

                            {task.topics.map(
                                (topic, index) => (

                                    <div
                                        key={`${topic}-${index}`}
                                        className="
                                            flex
                                            items-start
                                            gap-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-50/70
                                            px-4
                                            py-3
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-6
                                                w-6
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-white
                                                text-xs
                                                font-semibold
                                                text-slate-600
                                                shadow-sm
                                            "
                                        >
                                            {index + 1}
                                        </div>

                                        <p
                                            className="
                                                pt-0.5
                                                text-sm
                                                leading-5
                                                text-slate-700
                                            "
                                        >
                                            {topic}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                    {/* Estimated Time */}

                    <section
                        className="
                            mt-7
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-50
                                text-blue-600
                            "
                        >
                            <Clock3 size={18} />
                        </div>

                        <div>

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Estimated Time
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                "
                            >
                                {task.estimatedMinutes} minutes
                            </p>

                        </div>

                    </section>

                    {/* Learning Resources & Study Materials */}
                    <section className="mt-7">

                        <div className="flex items-center justify-between">
                            <h3
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                "
                            >
                                <BookOpen size={16} className="text-blue-600" />
                                Recommended Resources
                            </h3>

                            {task.resources && task.resources.length > 0 && (
                                <span
                                    className="
                                        rounded-full
                                        bg-slate-100
                                        px-2.5
                                        py-0.5
                                        text-xs
                                        font-medium
                                        text-slate-600
                                    "
                                >
                                    {task.resources.length} materials
                                </span>
                            )}
                        </div>

                        {task.resources && task.resources.length > 0 ? (
                            <div className="mt-3.5 space-y-2.5">
                                {task.resources.map((resource, idx) => (
                                    <a
                                        key={`${resource.url}-${idx}`}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            group
                                            flex
                                            items-start
                                            justify-between
                                            gap-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-3.5
                                            shadow-sm
                                            transition
                                            hover:border-blue-300
                                            hover:bg-slate-50/50
                                            hover:shadow
                                        "
                                    >
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div
                                                className="
                                                    mt-0.5
                                                    flex
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-slate-50
                                                    border
                                                    border-slate-100
                                                    group-hover:border-blue-100
                                                    group-hover:bg-blue-50
                                                    transition
                                                "
                                            >
                                                {renderResourceIcon(resource.type)}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <span className="text-[11px] font-semibold text-slate-500">
                                                        {resource.provider}
                                                    </span>

                                                    {resource.isCareerSaathiOfficial && (
                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1
                                                                rounded-md
                                                                bg-emerald-50
                                                                px-1.5
                                                                py-0.5
                                                                text-[10px]
                                                                font-semibold
                                                                text-emerald-700
                                                                border
                                                                border-emerald-200/60
                                                            "
                                                        >
                                                            CareerSaathi PDF
                                                        </span>
                                                    )}

                                                    {resource.isPartner && (
                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1
                                                                rounded-md
                                                                bg-amber-50
                                                                px-1.5
                                                                py-0.5
                                                                text-[10px]
                                                                font-semibold
                                                                text-amber-800
                                                                border
                                                                border-amber-200/60
                                                            "
                                                        >
                                                            Verified Partner
                                                        </span>
                                                    )}

                                                    {resource.estimatedMinutes && (
                                                        <span className="text-[10px] text-slate-400">
                                                            • {resource.estimatedMinutes}m read/watch
                                                        </span>
                                                    )}
                                                </div>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        font-semibold
                                                        text-slate-800
                                                        line-clamp-1
                                                        group-hover:text-blue-600
                                                        transition
                                                    "
                                                >
                                                    {resource.title}
                                                </p>

                                                {resource.description && (
                                                    <p
                                                        className="
                                                            mt-0.5
                                                            text-xs
                                                            leading-relaxed
                                                            text-slate-500
                                                            line-clamp-2
                                                        "
                                                    >
                                                        {resource.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className="
                                                shrink-0
                                                pt-1
                                                text-slate-400
                                                group-hover:text-blue-600
                                                transition
                                            "
                                        >
                                            <ExternalLink size={15} />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div
                                className="
                                    mt-3
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-slate-200
                                    bg-slate-50/60
                                    p-4
                                    text-center
                                "
                            >
                                <p className="text-xs text-slate-500">
                                    Curated video tutorials, documentation links, and CareerSaathi revision guides will appear here.
                                </p>
                            </div>
                        )}

                    </section>

                </div>

                {/* Footer */}

                <div
                    className="
                        border-t
                        border-slate-200
                        bg-white
                        px-5
                        py-5
                        sm:px-7
                    "
                >

                    {/* Regular Day 1 - 6 */}

                    {canCompleteRegularTask && (

                        <button
                            type="button"
                            disabled={isCompleting}
                            onClick={() =>
                                onComplete?.(
                                    task.taskId
                                )
                            }
                            className="
        w-full
        rounded-xl
        bg-blue-600
        px-5
        py-3
        text-sm
        font-semibold
        text-white
        transition
        hover:bg-blue-700
        disabled:cursor-not-allowed
        disabled:opacity-60
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:ring-offset-2
    "
                        >
                            {isCompleting
                                ? "Completing Task..."
                                : "Complete Today's Task"
                            }
                        </button>

                    )}

                    {/* Day 7 - Weekly Review */}

                    {canStartWeeklyReview && (

                        <button
                            type="button"
                            onClick={() =>
                                onStartWeeklyReview?.()
                            }
                            className="
                                w-full
                                rounded-xl
                                bg-blue-600
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-blue-700
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500
                                focus:ring-offset-2
                            "
                        >
                            Start Weekly Review
                        </button>

                    )}

                    {/* Future Task */}

                    {isPending &&
                        !isAvailable && (

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-4
                                    py-3
                                    text-center
                                    text-sm
                                    text-slate-600
                                "
                            >
                                This task will unlock on{" "}
                                <span
                                    className="
                                        font-semibold
                                        text-slate-900
                                    "
                                >
                                    Day {task.dayNumber}
                                </span>.
                            </div>

                        )}

                    {/* Completed */}

                    {task.status ===
                        DailyTaskStatus.COMPLETED && (

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-emerald-100
                                    bg-emerald-50
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-emerald-700
                                "
                            >
                                <CheckCircle2
                                    size={17}
                                />

                                Task completed
                            </div>

                        )}

                    {/* Skipped */}

                    {task.status ===
                        DailyTaskStatus.SKIPPED && (

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >
                                <XCircle
                                    size={17}
                                />

                                This task was skipped
                            </div>

                        )}

                </div>

            </aside>

        </>
    );

};

export default DailyTaskDrawer;