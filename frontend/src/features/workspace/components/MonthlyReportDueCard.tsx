import {
    CalendarDays,
    FileText,
    Loader2,
    Sparkles,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useGenerateMonthlyReportMutation,
    useGetMonthlyReportDueStatusQuery,
} from "../../monthly-reports/api/monthlyReportApi";


interface MonthlyReportDueCardProps {

    careerJourneyId:
    string;

}


const formatDate = (
    value: string
) => {

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    ).format(
        new Date(value)
    );

};


const MonthlyReportDueCard = ({

    careerJourneyId,

}: MonthlyReportDueCardProps) => {


    const navigate =
        useNavigate();


    /*
    |--------------------------------------------------------------------------
    | Monthly Report Due Status
    |--------------------------------------------------------------------------
    */

    const {

        data:
        dueStatusResponse,

        isLoading:
        isDueStatusLoading,

        isError:
        isDueStatusError,

    } =
        useGetMonthlyReportDueStatusQuery(
            careerJourneyId
        );


    /*
    |--------------------------------------------------------------------------
    | Generate Monthly Report
    |--------------------------------------------------------------------------
    */

    const [

        generateMonthlyReport,

        {
            isLoading:
            isGenerating,

            isError:
            isGenerationError,
        },

    ] =
        useGenerateMonthlyReportMutation();


    const dueStatus =
        dueStatusResponse?.data;


    /*
    |--------------------------------------------------------------------------
    | Generate Handler
    |--------------------------------------------------------------------------
    */

    const handleGenerateReport =
        async () => {

            if (
                !dueStatus?.due ||
                dueStatus.reportNumber === null
            ) {
                return;
            }


            try {

                const response =
                    await generateMonthlyReport(
                        careerJourneyId
                    ).unwrap();


                navigate(
                    `/monthly-reports/${response.data.reportNumber}`
                );

            } catch {

                /*
                 * Error state is handled
                 * through isGenerationError.
                 */

            }

        };


    /*
    |--------------------------------------------------------------------------
    | Nothing To Display
    |--------------------------------------------------------------------------
    */

    if (
        isDueStatusLoading ||
        isDueStatusError ||
        !dueStatus?.due ||
        dueStatus.reportNumber === null ||
        !dueStatus.periodStart ||
        !dueStatus.periodEnd
    ) {

        return null;

    }


    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <section
            className="
                overflow-hidden
                rounded-2xl
                border
                border-indigo-200
                bg-white
                shadow-sm
            "
        >

            <div
                className="
                    bg-linear-to-r
                    from-indigo-50
                    via-white
                    to-violet-50
                    p-5
                    sm:p-6
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-5
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
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-indigo-100
                                text-indigo-600
                            "
                        >

                            <FileText
                                size={21}
                            />

                        </div>


                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-indigo-600
                                "
                            >

                                <Sparkles
                                    size={14}
                                />

                                Progress review ready

                            </div>


                            <h2
                                className="
                                    mt-1.5
                                    text-lg
                                    font-bold
                                    text-slate-900
                                "
                            >

                                Monthly Report{" "}
                                {dueStatus.reportNumber} is ready

                            </h2>


                            <div
                                className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-slate-500
                                "
                            >

                                <CalendarDays
                                    size={15}
                                />

                                <span>

                                    {formatDate(
                                        dueStatus.periodStart
                                    )}

                                    {" – "}

                                    {formatDate(
                                        dueStatus.periodEnd
                                    )}

                                </span>

                            </div>


                            <p
                                className="
                                    mt-2
                                    max-w-2xl
                                    text-sm
                                    leading-6
                                    text-slate-600
                                "
                            >

                                Your 28-day learning cycle is complete.
                                Generate your progress report to review
                                your consistency, skills, assessments,
                                roadmap progress and personalized AI
                                recommendations.

                            </p>

                        </div>

                    </div>


                    <button
                        type="button"

                        onClick={
                            handleGenerateReport
                        }

                        disabled={
                            isGenerating
                        }

                        className="
                            inline-flex
                            shrink-0
                            items-center
                            justify-center
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
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        {isGenerating ? (

                            <>

                                <Loader2
                                    size={17}
                                    className="
                                        animate-spin
                                    "
                                />

                                Generating...

                            </>

                        ) : (

                            <>

                                <Sparkles
                                    size={17}
                                />

                                Generate Report

                            </>

                        )}

                    </button>

                </div>


                {isGenerationError && (

                    <div
                        className="
                            mt-4
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-700
                        "
                    >

                        We couldn't generate your monthly
                        report. Please try again.

                    </div>

                )}

            </div>

        </section>

    );

};


export default MonthlyReportDueCard;