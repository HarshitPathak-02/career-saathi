import {
    Navigate,
    useNavigate,
} from "react-router-dom";

import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Clock3,
    Map,
    Route,
    Target,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";

import {
    useGetWorkspaceQuery,
} from "../../workspace/api/workspaceApi";

import {
    useGetRoadmapByCareerJourneyQuery,
    useGetRoadmapItemsQuery,
} from "../api/roadmapApi";

const RoadmapPage = () => {

    const navigate =
        useNavigate();

    const {
        data: workspaceResponse,
        isLoading: workspaceLoading,
        isError: workspaceError,
        refetch: refetchWorkspace,
    } = useGetWorkspaceQuery();

    const workspace =
        workspaceResponse?.data;

    const careerJourneyId =
        workspace?.careerJourney.id ?? "";

    const {
        data: roadmap,
        isLoading: roadmapLoading,
        isError: roadmapError,
        refetch: refetchRoadmap,
    } = useGetRoadmapByCareerJourneyQuery(
        careerJourneyId,
        {
            skip: !careerJourneyId,
        }
    );

    const roadmapId =
        roadmap?.id ?? "";

    const {
        data: roadmapItems,
        isLoading: itemsLoading,
        isError: itemsError,
        refetch: refetchItems,
    } = useGetRoadmapItemsQuery(
        roadmapId,
        {
            skip: !roadmapId,
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Workspace Loading
    |--------------------------------------------------------------------------
    */

    if (workspaceLoading) {

        return (

            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-50
                    px-6
                "
            >

                <div className="text-center">

                    <div
                        className="
                            mx-auto
                            h-10
                            w-10
                            animate-spin
                            rounded-full
                            border-4
                            border-slate-200
                            border-t-blue-600
                        "
                    />

                    <p
                        className="
                            mt-4
                            text-sm
                            font-medium
                            text-slate-600
                        "
                    >
                        Loading your roadmap...
                    </p>

                </div>

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Workspace Error
    |--------------------------------------------------------------------------
    */

    if (
        workspaceError ||
        !workspace
    ) {

        return (

            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-50
                    px-6
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
                        p-8
                        text-center
                        shadow-sm
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-semibold
                            text-slate-900
                        "
                    >
                        Unable to load your journey
                    </h2>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-slate-600
                        "
                    >
                        We couldn't retrieve your career
                        journey. Please try again.
                    </p>

                    <Button
                        className="mt-5"
                        onClick={() =>
                            refetchWorkspace()
                        }
                    >
                        Retry
                    </Button>

                </div>

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Roadmap Not Available Yet
    |--------------------------------------------------------------------------
    */

    if (
        workspace.workspaceState ===
        "initial_assessment"
    ) {

        return (
            <Navigate
                to="/workspace"
                replace
            />
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Roadmap Loading
    |--------------------------------------------------------------------------
    */

    if (
        roadmapLoading ||
        itemsLoading
    ) {

        return (

            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-50
                    px-6
                "
            >

                <div className="text-center">

                    <div
                        className="
                            mx-auto
                            h-10
                            w-10
                            animate-spin
                            rounded-full
                            border-4
                            border-slate-200
                            border-t-blue-600
                        "
                    />

                    <p
                        className="
                            mt-4
                            text-sm
                            font-medium
                            text-slate-600
                        "
                    >
                        Loading your personalized roadmap...
                    </p>

                </div>

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Roadmap Error
    |--------------------------------------------------------------------------
    */

    if (
        roadmapError ||
        itemsError ||
        !roadmap
    ) {

        return (

            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-50
                    px-6
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
                        p-8
                        text-center
                        shadow-sm
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-semibold
                            text-slate-900
                        "
                    >
                        Unable to load roadmap
                    </h2>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-slate-600
                        "
                    >
                        We couldn't retrieve your
                        personalized roadmap.
                    </p>

                    <Button
                        className="mt-5"
                        onClick={() => {

                            refetchRoadmap();

                            if (roadmapId) {
                                refetchItems();
                            }

                        }}
                    >
                        Retry
                    </Button>

                </div>

            </div>

        );

    }

    const items =
        roadmapItems ?? [];

    const progressPercentage =
        roadmap.totalItems > 0
            ? Math.round(
                (
                    roadmap.completedItems /
                    roadmap.totalItems
                ) * 100
            )
            : 0;

    return (

        <div
            className="
                min-h-screen
                bg-slate-50
            "
        >

            <div
                className="
                    mx-auto
                    max-w-6xl
                    px-4
                    py-6
                    sm:px-6
                    sm:py-8
                    lg:px-8
                    lg:py-10
                "
            >

                {/* Roadmap Header */}

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
                            px-5
                            py-7
                            sm:px-7
                            sm:py-8
                            lg:px-8
                        "
                    >

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-20
                                -top-24
                                h-64
                                w-64
                                rounded-full
                                bg-blue-50
                                blur-3xl
                            "
                        />

                        <div className="relative">

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                "
                            >
                                <Route size={17} />

                                Personalized Career Roadmap
                            </div>

                            <h1
                                className="
                                    mt-3
                                    max-w-3xl
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-slate-900
                                    sm:text-3xl
                                "
                            >
                                {roadmap.title}
                            </h1>

                            <div
                                className="
                                    mt-3
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-x-2
                                    gap-y-1
                                    text-sm
                                    text-slate-600
                                    sm:text-base
                                "
                            >

                                <span>
                                    {roadmap.targetRole}
                                </span>

                                <span className="text-slate-300">
                                    •
                                </span>

                                <span>
                                    {roadmap.targetDomain}
                                </span>

                            </div>

                            <p
                                className="
                                    mt-4
                                    max-w-2xl
                                    text-sm
                                    leading-6
                                    text-slate-600
                                    sm:text-base
                                    sm:leading-7
                                "
                            >
                                Your roadmap is organized in
                                the sequence CareerSaathi
                                recommends for reaching your
                                target role. Complete each
                                stage as your journey
                                progresses.
                            </p>

                        </div>

                    </div>

                    {/* Roadmap Overview */}

                    <div
                        className="
                            border-t
                            border-slate-200
                            bg-slate-50/70
                            px-5
                            py-5
                            sm:px-7
                            lg:px-8
                        "
                    >

                        <div
                            className="
                                grid
                                gap-3
                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            <RoadmapStat
                                icon={Clock3}
                                label="Estimated Duration"
                                value={`${roadmap.estimatedWeeks} weeks`}
                            />

                            <RoadmapStat
                                icon={Map}
                                label="Learning Stages"
                                value={`${roadmap.totalItems}`}
                            />

                            <RoadmapStat
                                icon={CheckCircle2}
                                label="Completed"
                                value={`${roadmap.completedItems} / ${roadmap.totalItems}`}
                            />

                            <RoadmapStat
                                icon={Target}
                                label="Overall Progress"
                                value={`${progressPercentage}%`}
                            />

                        </div>

                        <div className="mt-5">

                            <div
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >

                                <span
                                    className="
                                        text-xs
                                        font-medium
                                        text-slate-500
                                    "
                                >
                                    Roadmap Progress
                                </span>

                                <span
                                    className="
                                        text-xs
                                        font-semibold
                                        text-blue-600
                                    "
                                >
                                    {progressPercentage}%
                                </span>

                            </div>

                            <div
                                className="
                                    h-2
                                    overflow-hidden
                                    rounded-full
                                    bg-slate-200
                                "
                            >

                                <div
                                    className="
                                        h-full
                                        rounded-full
                                        bg-blue-600
                                        transition-all
                                        duration-500
                                    "
                                    style={{
                                        width:
                                            `${progressPercentage}%`,
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </section>

                {/* Learning Path */}

                <section
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        px-5
                        py-6
                        shadow-sm
                        sm:px-7
                        sm:py-8
                        lg:px-8
                    "
                >

                    <div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-blue-600
                            "
                        >
                            Your Learning Path
                        </p>

                        <h2
                            className="
                                mt-1
                                text-xl
                                font-bold
                                text-slate-900
                                sm:text-2xl
                            "
                        >
                            The path from where you are to
                            where you want to be
                        </h2>

                        <p
                            className="
                                mt-2
                                max-w-2xl
                                text-sm
                                leading-6
                                text-slate-600
                            "
                        >
                            Each stage builds on the previous
                            one. CareerSaathi uses this path
                            to plan your weekly missions and
                            daily learning tasks.
                        </p>

                    </div>

                    <div
                        className="
                            mt-8
                            space-y-0
                        "
                    >

                        {items.map(
                            (
                                item,
                                index
                            ) => {

                                const isLast =
                                    index ===
                                    items.length - 1;

                                const isCompleted =
                                    item.status ===
                                    "COMPLETED";

                                return (

                                    <div
                                        key={item.id}
                                        className="
                                            relative
                                            flex
                                            gap-4
                                            sm:gap-5
                                        "
                                    >

                                        {/* Timeline */}

                                        <div
                                            className="
                                                flex
                                                w-10
                                                shrink-0
                                                flex-col
                                                items-center
                                            "
                                        >

                                            <div
                                                className={`
                                                    relative
                                                    z-10
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    border
                                                    text-sm
                                                    font-bold

                                                    ${isCompleted
                                                        ? `
                                                            border-blue-600
                                                            bg-blue-600
                                                            text-white
                                                        `
                                                        : `
                                                            border-blue-200
                                                            bg-blue-50
                                                            text-blue-600
                                                        `
                                                    }
                                                `}
                                            >

                                                {isCompleted
                                                    ? (
                                                        <Check
                                                            size={18}
                                                        />
                                                    )
                                                    : item.order
                                                }

                                            </div>

                                            {!isLast && (

                                                <div
                                                    className="
                                                        min-h-8
                                                        w-px
                                                        flex-1
                                                        bg-slate-200
                                                    "
                                                />

                                            )}

                                        </div>

                                        {/* Item */}

                                        <div
                                            className={`
                                                mb-5
                                                min-w-0
                                                flex-1
                                                rounded-xl
                                                border
                                                p-5
                                                sm:p-6

                                                ${isCompleted
                                                    ? `
                                                        border-blue-100
                                                        bg-blue-50/30
                                                    `
                                                    : `
                                                        border-slate-200
                                                        bg-white
                                                    `
                                                }
                                            `}
                                        >

                                            <div
                                                className="
                                                    flex
                                                    flex-col
                                                    gap-3
                                                    sm:flex-row
                                                    sm:items-start
                                                    sm:justify-between
                                                "
                                            >

                                                <div>

                                                    <div
                                                        className="
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            gap-2
                                                        "
                                                    >

                                                        <h3
                                                            className="
                                                                font-semibold
                                                                text-slate-900
                                                            "
                                                        >
                                                            {item.title}
                                                        </h3>

                                                        <span
                                                            className="
                                                                rounded-full
                                                                bg-slate-100
                                                                px-2.5
                                                                py-1
                                                                text-[11px]
                                                                font-semibold
                                                                uppercase
                                                                tracking-wide
                                                                text-slate-500
                                                            "
                                                        >
                                                            {item.type.replaceAll(
                                                                "_",
                                                                " "
                                                            )}
                                                        </span>

                                                        {isCompleted && (

                                                            <span
                                                                className="
                                                                    rounded-full
                                                                    bg-emerald-50
                                                                    px-2.5
                                                                    py-1
                                                                    text-[11px]
                                                                    font-semibold
                                                                    text-emerald-700
                                                                "
                                                            >
                                                                Completed
                                                            </span>

                                                        )}

                                                    </div>

                                                    <p
                                                        className="
                                                            mt-2
                                                            text-sm
                                                            leading-6
                                                            text-slate-600
                                                        "
                                                    >
                                                        {item.description}
                                                    </p>

                                                </div>

                                                <div
                                                    className="
                                                        flex
                                                        shrink-0
                                                        items-center
                                                        gap-1.5
                                                        text-xs
                                                        font-medium
                                                        text-slate-500
                                                    "
                                                >

                                                    <Clock3
                                                        size={15}
                                                    />

                                                    {item.estimatedHours}{" "}
                                                    hours

                                                </div>

                                            </div>

                                            {item.aiReason && (

                                                <div
                                                    className="
                                                        mt-5
                                                        rounded-xl
                                                        border
                                                        border-blue-100
                                                        bg-blue-50/60
                                                        p-4
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            text-xs
                                                            font-semibold
                                                            text-blue-700
                                                        "
                                                    >
                                                        Why CareerSaathi
                                                        included this
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-1.5
                                                            text-sm
                                                            leading-6
                                                            text-slate-700
                                                        "
                                                    >
                                                        {item.aiReason}
                                                    </p>

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                </section>

            </div>

        </div>

    );

};

interface RoadmapStatProps {

    icon:
    React.ComponentType<{
        size?: number;
        className?: string;
    }>;

    label: string;

    value: string;

}

const RoadmapStat = ({

    icon: Icon,

    label,

    value,

}: RoadmapStatProps) => {

    return (

        <div
            className="
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
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-50
                    text-blue-600
                "
            >
                <Icon size={18} />
            </div>

            <div className="min-w-0">

                <p
                    className="
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-400
                    "
                >
                    {label}
                </p>

                <p
                    className="
                        mt-1
                        font-semibold
                        text-slate-900
                    "
                >
                    {value}
                </p>

            </div>

        </div>

    );

};

export default RoadmapPage;