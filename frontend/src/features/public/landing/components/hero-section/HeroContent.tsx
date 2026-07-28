import {
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

const HeroContent = () => {

    return (

        <div className="relative z-10 flex-1">

            {/* Eyebrow */}

            <div
                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-indigo-200
                    bg-indigo-50
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-indigo-700
                "
            >

                <span
                    className="
                        h-2
                        w-2
                        rounded-full
                        bg-indigo-600
                    "
                />

                Your personalized career companion

            </div>

            {/* Heading */}

            <h1
                className="
                    mt-7
                    max-w-3xl
                    text-5xl
                    font-bold
                    leading-[1.08]
                    tracking-tight
                    text-slate-950
                    sm:text-6xl
                    lg:text-[4.25rem]
                "
            >

                Turn your career goal into a

                <span className="text-indigo-600">
                    {" "}clear plan you can follow.
                </span>

            </h1>

            {/* Description */}

            <p
                className="
                    mt-7
                    max-w-2xl
                    text-lg
                    leading-8
                    text-slate-600
                "
            >

                CareerSaathi understands where you are,
                where you want to go, and builds a
                personalized path to get you there —
                with focused missions, assessments,
                reflections, and guidance that adapts
                as you improve.

            </p>

            {/* CTAs */}

            <div
                className="
                    mt-9
                    flex
                    flex-wrap
                    items-center
                    gap-4
                "
            >

                <Link
                    to="/register"
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-slate-950
                        px-6
                        py-3.5
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-slate-800
                    "
                >

                    Start Your Career Journey

                    <ArrowRight
                        size={18}
                    />

                </Link>

                <a
                    href="#how-it-works"
                    className="
                        inline-flex
                        items-center
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        px-6
                        py-3.5
                        text-sm
                        font-semibold
                        text-slate-700
                        transition
                        hover:border-slate-400
                        hover:bg-slate-50
                    "
                >

                    See How It Works

                </a>

            </div>

            {/* Trust / Product points */}

            <div
                className="
                    mt-9
                    flex
                    flex-wrap
                    gap-x-6
                    gap-y-3
                    text-sm
                    text-slate-600
                "
            >

                <div className="flex items-center gap-2">

                    <CheckCircle2
                        size={17}
                        className="text-indigo-600"
                    />

                    Personalized roadmap

                </div>

                <div className="flex items-center gap-2">

                    <CheckCircle2
                        size={17}
                        className="text-indigo-600"
                    />

                    Weekly execution system

                </div>

                <div className="flex items-center gap-2">

                    <CheckCircle2
                        size={17}
                        className="text-indigo-600"
                    />

                    Adaptive career guidance

                </div>

            </div>

        </div>

    );

};

export default HeroContent;