import {
    CalendarClock,
    CheckCircle2,
    Sparkles,
} from "lucide-react";

interface NextMissionPendingCardProps {

    nextMissionAvailableAt:
    string | null;

}

const NextMissionPendingCard = ({
    nextMissionAvailableAt,
}: NextMissionPendingCardProps) => {

    const formattedDate =
        nextMissionAvailableAt
            ? new Date(
                nextMissionAvailableAt
            ).toLocaleDateString(
                undefined,
                {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                }
            )
            : null;

    return (

        <section
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-8
                shadow-sm
            "
        >

            <div
                className="
                    mx-auto
                    max-w-2xl
                    text-center
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-full
                        bg-green-100
                        text-green-600
                    "
                >

                    <CheckCircle2
                        size={32}
                    />

                </div>

                <h2
                    className="
                        mt-5
                        text-2xl
                        font-bold
                        text-slate-900
                    "
                >

                    This Week Is Complete

                </h2>

                <p
                    className="
                        mx-auto
                        mt-3
                        max-w-xl
                        leading-7
                        text-slate-600
                    "
                >

                    You've completed your weekly
                    mission, assessment, and reflection.

                    Your progress has been reviewed and
                    will be used to prepare your next
                    learning mission.

                </p>

                <div
                    className="
                        mt-7
                        rounded-xl
                        border
                        border-indigo-100
                        bg-indigo-50
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            font-semibold
                            text-indigo-700
                        "
                    >

                        <CalendarClock
                            size={20}
                        />

                        Next Mission

                    </div>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-slate-600
                        "
                    >

                        Your next weekly mission will
                        automatically become available

                        {formattedDate
                            ? ` on ${formattedDate}.`
                            : " tomorrow."}

                    </p>

                </div>

                <div
                    className="
                        mt-6
                        flex
                        items-center
                        justify-center
                        gap-2
                        text-sm
                        text-slate-500
                    "
                >

                    <Sparkles
                        size={17}
                    />

                    Your next mission will adapt to
                    this week's progress.

                </div>

            </div>

        </section>

    );

};

export default NextMissionPendingCard;