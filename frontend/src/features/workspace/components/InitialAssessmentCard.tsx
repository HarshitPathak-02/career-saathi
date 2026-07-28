import {
    ArrowRight,
    Brain,
    CheckCircle2,
    ClipboardCheck,
    Route,
    Sparkles,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import Button from "../../../components/ui/Button/Button";

const InitialAssessmentCard = () => {

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
                    overflow-hidden
                    px-5
                    py-7
                    sm:px-7
                    sm:py-8
                    lg:px-8
                    lg:py-9
                "
            >

                {/* Background Accent */}

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

                    {/* Badge */}

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-blue-100
                            bg-blue-50
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-blue-700
                        "
                    >

                        <Sparkles size={14} />

                        Your First Step

                    </div>

                    {/* Main Content */}

                    <div
                        className="
                            mt-5
                            flex
                            flex-col
                            gap-5
                            lg:flex-row
                            lg:items-start
                            lg:justify-between
                        "
                    >

                        <div className="max-w-2xl">

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

                                <ClipboardCheck size={24} />

                            </div>

                            <h2
                                className="
                                    mt-5
                                    text-xl
                                    font-bold
                                    tracking-tight
                                    text-slate-900
                                    sm:text-2xl
                                "
                            >

                                Let's understand where you currently stand

                            </h2>

                            <p
                                className="
                                    mt-3
                                    text-sm
                                    leading-6
                                    text-slate-600
                                    sm:text-base
                                    sm:leading-7
                                "
                            >

                                Before building your roadmap,
                                CareerSaathi needs to understand
                                your current knowledge and skill
                                level. Your assessment helps us
                                identify what you already know,
                                where your gaps are, and what you
                                should focus on next.

                            </p>

                        </div>

                    </div>

                    {/* What Happens */}

                    <div
                        className="
                            mt-7
                            grid
                            gap-3
                            md:grid-cols-3
                        "
                    >

                        <AssessmentPoint
                            icon={Brain}
                            title="Understand Your Skills"
                            description="Identify your current knowledge across the skills required for your target role."
                        />

                        <AssessmentPoint
                            icon={CheckCircle2}
                            title="Find Your Skill Gaps"
                            description="Separate what you already know from the areas that need more attention."
                        />

                        <AssessmentPoint
                            icon={Route}
                            title="Personalize Your Roadmap"
                            description="Use your results to build a learning path around your actual starting point."
                        />

                    </div>

                    {/* Footer */}

                    <div
                        className="
                            mt-7
                            flex
                            flex-col
                            gap-4
                            border-t
                            border-slate-200
                            pt-6
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                "
                            >

                                Ready to establish your starting point?

                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-slate-500
                                    sm:text-sm
                                "
                            >

                                Your responses will be used to personalize
                                the next stage of your CareerSaathi journey.

                            </p>

                        </div>

                        <Button
                            onClick={() =>
                                navigate(
                                    "/initial-assessment"
                                )
                            }
                            className="
                                w-full
                                shrink-0
                                sm:w-auto
                            "
                        >

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                "
                            >

                                Take Initial Assessment

                                <ArrowRight size={17} />

                            </span>

                        </Button>

                    </div>

                </div>

            </div>

        </section>

    );

};

interface AssessmentPointProps {

    icon:
    React.ComponentType<{
        size?: number;
        className?: string;
    }>;

    title: string;

    description: string;

}

const AssessmentPoint = ({

    icon: Icon,

    title,

    description,

}: AssessmentPointProps) => {

    return (

        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50/70
                p-4
                sm:p-5
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

                <Icon size={18} />

            </div>

            <h3
                className="
                    mt-4
                    text-sm
                    font-semibold
                    text-slate-900
                "
            >

                {title}

            </h3>

            <p
                className="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-500
                "
            >

                {description}

            </p>

        </div>

    );

};

export default InitialAssessmentCard;