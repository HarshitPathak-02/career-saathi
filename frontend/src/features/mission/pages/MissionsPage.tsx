import {
    AlertCircle,
    RefreshCw,
    Target,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import MissionCard from "../components/MissionCard";
import EmptyMissionState from "../components/EmptyMissionState";

import {
    useGetMissionHistoryQuery,
} from "../api/missionApi";

import {
    useGetActiveCareerJourneyQuery,
} from "../../career-setup/api/careerSetupApi";

const MissionsPage = () => {

    const navigate =
        useNavigate();

    /*
    |----------------------------------------------------------------------
    | Active Career Journey
    |----------------------------------------------------------------------
    */

    const {
        data: careerJourneyResponse,
        isLoading: isCareerJourneyLoading,
        isError: isCareerJourneyError,
        refetch: refetchCareerJourney,
    } = useGetActiveCareerJourneyQuery();

    const activeCareerJourney =
        careerJourneyResponse?.data;

    /*
    |----------------------------------------------------------------------
    | Mission History
    |----------------------------------------------------------------------
    */

    const {
        data: missionHistoryResponse,
        isLoading: isMissionLoading,
        isError: isMissionError,
        refetch: refetchMissions,
    } = useGetMissionHistoryQuery(
        activeCareerJourney?._id ?? "",
        {
            skip: !activeCareerJourney,
        },
    );

    const missions =
        missionHistoryResponse?.data ?? [];

    /*
    |----------------------------------------------------------------------
    | Loading
    |----------------------------------------------------------------------
    */

    if (
        isCareerJourneyLoading ||
        isMissionLoading
    ) {
        return (
            <MissionsLoading />
        );
    }

    /*
    |----------------------------------------------------------------------
    | Error
    |----------------------------------------------------------------------
    */

    if (
        isCareerJourneyError ||
        isMissionError
    ) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

                <div className="mx-auto max-w-6xl">

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            px-6
                            py-14
                            text-center
                            shadow-sm
                        "
                    >
                        <div
                            className="
                                mx-auto
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-red-50
                                text-red-600
                            "
                        >
                            <AlertCircle size={23} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            Unable to load your missions
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                            We couldn't retrieve your mission history.
                            Please try again.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                refetchCareerJourney();

                                if (activeCareerJourney) {
                                    refetchMissions();
                                }
                            }}
                            className="
                                mt-6
                                inline-flex
                                items-center
                                gap-2
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
                            <RefreshCw size={17} />

                            Try Again
                        </button>
                    </div>

                </div>

            </div>
        );
    }

    /*
    |----------------------------------------------------------------------
    | No Career Journey / Missions
    |----------------------------------------------------------------------
    */

    if (
        !activeCareerJourney ||
        !missions ||
        missions.length === 0
    ) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

                <div className="mx-auto max-w-6xl">

                    <EmptyMissionState />

                </div>

            </div>
        );
    }

    /*
    |----------------------------------------------------------------------
    | UI
    |----------------------------------------------------------------------
    */

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
                {/* Header */}

                <div
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                        sm:p-8
                    "
                >
                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-50
                            text-blue-600
                        "
                    >
                        <Target size={23} />
                    </div>

                    <p
                        className="
                            mt-5
                            text-sm
                            font-semibold
                            text-blue-600
                        "
                    >
                        Weekly Learning Missions
                    </p>

                    <h1
                        className="
                            mt-2
                            text-2xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            sm:text-3xl
                        "
                    >
                        Your Missions
                    </h1>

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
                        Follow your weekly learning plan,
                        complete daily targets and track
                        your progress throughout your
                        CareerSaathi journey.
                    </p>
                </div>

                {/* Mission History */}

                <section className="mt-8">

                    <div>
                        <h2
                            className="
                                text-lg
                                font-bold
                                text-slate-900
                                sm:text-xl
                            "
                        >
                            Mission History
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Review your current and previous
                            weekly missions.
                        </p>
                    </div>

                    <div className="mt-5 space-y-4">

                        {missions.map(
                            (mission) => (
                                <MissionCard
                                    key={mission.id}
                                    mission={mission}
                                    onClick={() =>
                                        navigate(
                                            `/missions/${mission.id}`,
                                        )
                                    }
                                />
                            )
                        )}

                    </div>

                </section>

            </div>

        </div>
    );
};

const MissionsLoading = () => {

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
                <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

                <div
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        sm:p-8
                    "
                >
                    <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />

                    <div className="mt-5 h-4 w-40 animate-pulse rounded bg-slate-200" />

                    <div className="mt-3 h-8 w-64 animate-pulse rounded bg-slate-200" />

                    <div className="mt-4 h-4 max-w-xl animate-pulse rounded bg-slate-200" />

                    <div className="mt-2 h-4 max-w-md animate-pulse rounded bg-slate-200" />
                </div>

                <div className="mt-8">

                    <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />

                    <div className="mt-5 space-y-4">

                        {[1, 2, 3].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="
                                        h-40
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

        </div>
    );
};

export default MissionsPage;