import {
    CalendarDays,
    MessageSquareText,
} from "lucide-react";

import {
    useGetMockInterviewHistoryQuery,
} from "../../mock-interviews/api/mockInterviewApi";


interface MockInterviewHistoryProps {

    careerJourneyId:
    string;

}


export default function MockInterviewHistory({

    careerJourneyId,

}: MockInterviewHistoryProps) {

    const {
        data,
        isLoading,
        isError,
    } =
        useGetMockInterviewHistoryQuery(
            careerJourneyId
        );


    if (isLoading) {

        return (

            <div
                className="
                    h-48
                    animate-pulse
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                "
            />

        );

    }


    if (isError) {

        return (

            <div
                className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50
                    p-5
                    text-sm
                    text-red-700
                "
            >
                Unable to load mock interview history.
            </div>

        );

    }


    const interviews =
        data?.data ?? [];


    if (
        interviews.length === 0
    ) {

        return null;

    }


    return (

        <section
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >

            {/* Header */}

            <div>

                <h2
                    className="
                        text-lg
                        font-bold
                        text-slate-900
                    "
                >
                    Mock Interview History
                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    Interview results submitted for
                    your readiness evaluation.
                </p>

            </div>


            {/* Interviews */}

            <div
                className="
                    mt-6
                    space-y-4
                "
            >

                {interviews.map(
                    interview => (

                        <div
                            key={
                                interview.id
                            }
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                p-5
                            "
                        >

                            {/* Top */}

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
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <span
                                            className="
                                                font-bold
                                                text-slate-900
                                            "
                                        >
                                            Mock Interview #
                                            {
                                                interview
                                                    .interviewNumber
                                            }
                                        </span>


                                        <span
                                            className="
                                                rounded-full
                                                bg-indigo-50
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-semibold
                                                capitalize
                                                text-indigo-700
                                            "
                                        >
                                            {
                                                interview
                                                    .interviewType
                                            }
                                        </span>

                                    </div>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                        "
                                    >
                                        {
                                            interview
                                                .platform
                                        }
                                    </p>

                                </div>


                                <div
                                    className="
                                        text-left
                                        sm:text-right
                                    "
                                >

                                    <p
                                        className="
                                            text-2xl
                                            font-bold
                                            text-slate-900
                                        "
                                    >
                                        {
                                            interview
                                                .overallScore
                                        }

                                        <span
                                            className="
                                                text-sm
                                                font-medium
                                                text-slate-400
                                            "
                                        >
                                            /100
                                        </span>

                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Overall score
                                    </p>

                                </div>

                            </div>


                            {/* Scores */}

                            <div
                                className="
                                    mt-5
                                    grid
                                    grid-cols-3
                                    gap-3
                                "
                            >

                                <Score
                                    label="Technical"
                                    value={
                                        interview
                                            .technicalScore
                                    }
                                />

                                <Score
                                    label="Problem Solving"
                                    value={
                                        interview
                                            .problemSolvingScore
                                    }
                                />

                                <Score
                                    label="Communication"
                                    value={
                                        interview
                                            .communicationScore
                                    }
                                />

                            </div>


                            {/* Footer */}

                            <div
                                className="
                                    mt-5
                                    flex
                                    flex-col
                                    gap-3
                                    border-t
                                    border-slate-100
                                    pt-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        text-slate-400
                                    "
                                >

                                    <CalendarDays
                                        size={14}
                                    />

                                    {
                                        new Date(
                                            interview
                                                .interviewedAt
                                        ).toLocaleDateString()
                                    }

                                </div>


                                {interview.feedback && (

                                    <div
                                        className="
                                            flex
                                            items-start
                                            gap-2
                                            text-sm
                                            leading-6
                                            text-slate-600
                                        "
                                    >

                                        <MessageSquareText
                                            size={16}
                                            className="
                                                mt-1
                                                shrink-0
                                                text-slate-400
                                            "
                                        />

                                        <p>
                                            {
                                                interview
                                                    .feedback
                                            }
                                        </p>

                                    </div>

                                )}

                            </div>

                        </div>

                    )
                )}

            </div>

        </section>

    );

}


function Score({

    label,
    value,

}: {

    label:
    string;

    value:
    number;

}) {

    return (

        <div
            className="
                rounded-xl
                bg-slate-50
                p-3
            "
        >

            <p
                className="
                    text-xs
                    text-slate-500
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-1
                    font-bold
                    text-slate-900
                "
            >
                {value}

                <span
                    className="
                        text-xs
                        font-medium
                        text-slate-400
                    "
                >
                    /100
                </span>

            </p>

        </div>

    );

}