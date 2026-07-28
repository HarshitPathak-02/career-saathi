import {
    ArrowRight,
    Target,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

const EmptyMissionState = () => {

    const navigate =
        useNavigate();

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

            <div
                className="
                    relative
                    px-5
                    py-14
                    text-center
                    sm:px-8
                    sm:py-16
                "
            >

                {/* Background Decoration */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-0
                        h-56
                        w-56
                        -translate-x-1/2
                        rounded-full
                        bg-blue-50
                        blur-3xl
                    "
                />

                <div
                    className="
                        relative
                        mx-auto
                        max-w-lg
                    "
                >

                    {/* Icon */}

                    <div
                        className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-blue-50
                            text-blue-600
                        "
                    >
                        <Target size={26} />
                    </div>

                    {/* Content */}

                    <p
                        className="
                            mt-5
                            text-sm
                            font-semibold
                            text-blue-600
                        "
                    >
                        Your Mission Journey
                    </p>

                    <h2
                        className="
                            mt-2
                            text-xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            sm:text-2xl
                        "
                    >
                        No missions yet
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-3
                            max-w-md
                            text-sm
                            leading-6
                            text-slate-600
                            sm:text-base
                            sm:leading-7
                        "
                    >
                        Your weekly learning missions will
                        appear here once your CareerSaathi
                        journey begins.
                    </p>

                    {/* Guidance */}

                    <div
                        className="
                            mx-auto
                            mt-7
                            max-w-md
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50/70
                            px-4
                            py-4
                            text-left
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                            "
                        >
                            What should I do next?
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-slate-600
                            "
                        >
                            Return to your workspace to see
                            the next step required to start
                            your learning missions.
                        </p>

                    </div>

                    {/* Action */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/workspace")
                        }
                        className="
                            mt-7
                            inline-flex
                            items-center
                            justify-center
                            gap-2
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
                        Go to Workspace

                        <ArrowRight
                            size={17}
                        />
                    </button>

                </div>

            </div>

        </section>
    );

};

export default EmptyMissionState;