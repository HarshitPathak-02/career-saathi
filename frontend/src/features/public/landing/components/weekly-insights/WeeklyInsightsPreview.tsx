import weeklySummaryImage
    from "../../assets/weekly-report-summary.png";

import skillPerformanceImage
    from "../../assets/weekly-report-skills.png";

import achievementsImage
    from "../../assets/weekly-report-ach.png";

import recommendationsImage
    from "../../assets/weekly-report-recom.png";

const WeeklyInsightsPreview = () => {

    return (

        <div
            className="
                relative
                mx-auto
                mt-16
                max-w-7xl
                lg:mt-20
            "
        >

            {/* Background */}

            <div
                className="
                    absolute
                    inset-x-20
                    top-16
                    bottom-10
                    rounded-[3rem]
                    bg-indigo-50/70
                    blur-3xl
                "
            />

            {/* Screenshot Grid */}

            <div
                className="
                    relative
                    grid
                    gap-5
                    lg:grid-cols-12
                    lg:gap-6
                "
            >

                {/* Weekly Summary */}

                <div
                    className="
                        group
                        lg:col-span-7
                    "
                >

                    <div
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-2
                            shadow-lg
                            shadow-slate-900/5
                            transition
                            duration-300
                            group-hover:-translate-y-1
                            group-hover:shadow-xl
                        "
                    >

                        <img
                            src={weeklySummaryImage}
                            alt="CareerSaathi weekly progress summary"
                            className="
                                w-full
                                rounded-xl
                                object-cover
                            "
                        />

                    </div>

                    <div className="mt-4 px-1">

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                            "
                        >

                            Weekly Progress Overview

                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >

                            Understand how the week went beyond
                            simply counting completed tasks.

                        </p>

                    </div>

                </div>


                {/* Skill Performance */}

                <div
                    className="
                        group
                        lg:col-span-5
                        lg:mt-16
                    "
                >

                    <div
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-2
                            shadow-lg
                            shadow-slate-900/5
                            transition
                            duration-300
                            group-hover:-translate-y-1
                            group-hover:shadow-xl
                        "
                    >

                        <img
                            src={skillPerformanceImage}
                            alt="CareerSaathi skill performance analysis"
                            className="
                                w-full
                                rounded-xl
                                object-cover
                            "
                        />

                    </div>

                    <div className="mt-4 px-1">

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                            "
                        >

                            Skill-by-Skill Progress

                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >

                            See assessment scores and improvement
                            across the skills you're building.

                        </p>

                    </div>

                </div>


                {/* Achievements */}

                <div
                    className="
                        group
                        lg:col-span-5
                        lg:-mt-4
                    "
                >

                    <div
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-2
                            shadow-lg
                            shadow-slate-900/5
                            transition
                            duration-300
                            group-hover:-translate-y-1
                            group-hover:shadow-xl
                        "
                    >

                        <img
                            src={achievementsImage}
                            alt="CareerSaathi achievements and areas to improve"
                            className="
                                w-full
                                rounded-xl
                                object-cover
                            "
                        />

                    </div>

                    <div className="mt-4 px-1">

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                            "
                        >

                            Strengths & Improvement Areas

                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >

                            Know what's working and where your
                            effort should go next.

                        </p>

                    </div>

                </div>


                {/* Recommendations */}

                <div
                    className="
                        group
                        lg:col-span-7
                        lg:mt-8
                    "
                >

                    <div
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-2
                            shadow-lg
                            shadow-slate-900/5
                            transition
                            duration-300
                            group-hover:-translate-y-1
                            group-hover:shadow-xl
                        "
                    >

                        <img
                            src={recommendationsImage}
                            alt="CareerSaathi personalized next week recommendations"
                            className="
                                w-full
                                rounded-xl
                                object-cover
                            "
                        />

                    </div>

                    <div className="mt-4 px-1">

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                            "
                        >

                            Personalized Next-Week Recommendations

                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >

                            Weak skills, revision topics, difficulty,
                            and study priorities feed into what
                            happens next.

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default WeeklyInsightsPreview;