import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Target,
} from "lucide-react";

import Progress from "../../../components/ui/Progress/Progress";

import type {
    MissionDetails,
} from "../types/mission.types";

import {
    formatMissionDateRange,
    getMissionStatusClasses,
} from "../utils/mission.utils";

interface MissionHeaderProps {

    mission: MissionDetails;

}

const MissionHeader = ({

    mission,

}: MissionHeaderProps) => {

    return (
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

            <div className="p-6 sm:p-8">

                <div
                    className="
                        flex
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                            "
                        >
                            <Target size={21} />
                        </div>

                        <p
                            className="
                                mt-5
                                text-sm
                                font-semibold
                                text-blue-600
                            "
                        >
                            Weekly Learning Mission
                        </p>

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
                            Mission {mission.missionNumber}
                        </h1>

                        <div
                            className="
                                mt-3
                                flex
                                items-center
                                gap-2
                                text-sm
                                text-slate-500
                            "
                        >
                            <CalendarDays size={16} />

                            {formatMissionDateRange(
                                mission.startDate,
                                mission.endDate,
                            )}
                        </div>

                    </div>

                    <span
                        className={`
                            w-fit
                            rounded-full
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            ${getMissionStatusClasses(
                            mission.status,
                        )}
                        `}
                    >
                        {mission.status}
                    </span>

                </div>

                <div className="mt-8">

                    <div
                        className="
                            mb-2
                            flex
                            items-center
                            justify-between
                        "
                    >
                        <span className="text-sm font-medium text-slate-600">
                            Mission Progress
                        </span>

                        <span className="text-sm font-semibold text-slate-900">
                            {mission.progressPercentage}%
                        </span>
                    </div>

                    <Progress
                        value={
                            mission.progressPercentage
                        }
                    />

                </div>

            </div>

            <div
                className="
                    grid
                    border-t
                    border-slate-200
                    bg-slate-50/70
                    sm:grid-cols-2
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        px-6
                        py-5
                        sm:px-8
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
                            bg-white
                            text-blue-600
                            shadow-sm
                        "
                    >
                        <CheckCircle2 size={18} />
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Completed
                        </p>

                        <p className="mt-0.5 font-semibold text-slate-900">
                            {mission.completedDays}
                            {" / "}
                            {mission.totalDays}
                            {" days"}
                        </p>
                    </div>
                </div>

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        border-t
                        border-slate-200
                        px-6
                        py-5
                        sm:border-l
                        sm:border-t-0
                        sm:px-8
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
                            bg-white
                            text-blue-600
                            shadow-sm
                        "
                    >
                        <Clock3 size={18} />
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Current Day
                        </p>

                        <p className="mt-0.5 font-semibold text-slate-900">
                            Day {mission.currentMissionDay}
                        </p>
                    </div>
                </div>

            </div>

        </section>
    );
};

export default MissionHeader;