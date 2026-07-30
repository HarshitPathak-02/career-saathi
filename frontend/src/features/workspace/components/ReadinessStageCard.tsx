import {
    ArrowRight,
    CheckCircle2,
    Target,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";


const ReadinessStageCard = () => {

    const navigate =
        useNavigate();


    const handleCheckReadiness =
        () => {

            navigate(
                "/readiness"
            );

        };


    return (

        <section
            className="
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
                    flex-col
                    items-start
                    gap-6
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div
                    className="
                        flex
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
                            bg-green-50
                            text-green-600
                        "
                    >

                        <CheckCircle2
                            size={24}
                        />

                    </div>


                    <div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-green-600
                            "
                        >
                            Roadmap Completed
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
                            Time to test your
                            interview readiness
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
                            You've completed your
                            current learning roadmap.
                            The next step is to validate
                            your skills through mock
                            interviews and determine
                            whether you're ready to
                            start applying.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={
                        handleCheckReadiness
                    }
                    className="
                        inline-flex
                        shrink-0
                        items-center
                        gap-2
                        rounded-xl
                        bg-indigo-600
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-indigo-700
                    "
                >

                    <Target
                        size={17}
                    />

                    Check Readiness

                    <ArrowRight
                        size={16}
                    />

                </button>

            </div>

        </section>

    );

};


export default ReadinessStageCard;