import {
    Layers,
    RefreshCw,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import CareerSetupLayout
    from "../../../components/layout/CareerSetupLayout";

import NavigationButtons
    from "../../../components/ui/NavigationButton/NavigationButtons";

import SkeletonCard
    from "../../../components/ui/SkeletonCard/SkeletonCard";

import SelectionGrid
    from "../components/SelectionGrid/SelectionGrid";

import {
    useGetCareerDomainsQuery,
} from "../api/careerSetupApi";

import {
    useAppDispatch,
    useAppSelector,
} from "../../../app/hooks";

import {
    setSelectedDomain,
} from "../slice/careerSetupSlice";


const CareerDomainPage = () => {

    const navigate =
        useNavigate();

    const dispatch =
        useAppDispatch();


    /*
    |--------------------------------------------------------------------------
    | Career Setup State
    |--------------------------------------------------------------------------
    */

    const selectedDomainId =
        useAppSelector(
            (state) =>
                state
                    .careerSetup
                    .selectedDomainId
        );


    /*
    |--------------------------------------------------------------------------
    | Career Domains
    |--------------------------------------------------------------------------
    */

    const {

        data,

        isLoading,

        isError,

        isFetching,

        refetch,

    } =
        useGetCareerDomainsQuery();


    /*
    |--------------------------------------------------------------------------
    | Domain Options
    |--------------------------------------------------------------------------
    */

    const domains =
        data?.data.map(
            (domain) => ({

                id:
                    domain.id,

                name:
                    domain.name,

                description:
                    domain.description,

                icon: (
                    <Layers
                        size={28}
                    />
                ),

            })
        ) ?? [];


    /*
    |--------------------------------------------------------------------------
    | Select Domain
    |--------------------------------------------------------------------------
    */

    const handleSelectDomain = (
        domainId: string
    ) => {

        dispatch(
            setSelectedDomain(
                domainId
            )
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Navigation
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {

        navigate(
            "/career-direction"
        );

    };


    const handleContinue = () => {

        if (
            !selectedDomainId
        ) {
            return;
        }

        navigate(
            "/career-role"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <CareerSetupLayout

            currentStep={2}

            totalSteps={4}

            title="Choose Your Career Domain"

            subtitle="Select the area you want to build your career in. CareerSaathi will use this to personalize the roles, skills, assessments, and roadmap that follow."

        >

            {/* Loading */}

            {isLoading && (

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        sm:gap-5
                        md:grid-cols-2
                    "
                >

                    <SkeletonCard />

                    <SkeletonCard />

                    <SkeletonCard />

                    <SkeletonCard />

                </div>

            )}


            {/* Error */}

            {isError && (

                <div
                    className="
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        px-6
                        py-10
                        text-center
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
                            bg-red-100
                            text-red-600
                        "
                    >

                        <RefreshCw
                            size={22}
                        />

                    </div>


                    <h2
                        className="
                            mt-4
                            text-lg
                            font-semibold
                            text-slate-900
                        "
                    >

                        Unable to load career domains

                    </h2>


                    <p
                        className="
                            mx-auto
                            mt-2
                            max-w-md
                            text-sm
                            leading-6
                            text-slate-600
                        "
                    >

                        We couldn't load the available
                        career domains right now. Please
                        try again.

                    </p>


                    <button

                        type="button"

                        onClick={() =>
                            refetch()
                        }

                        disabled={
                            isFetching
                        }

                        className="
                            mt-6
                            inline-flex
                            min-h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-indigo-600
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-indigo-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-indigo-500
                            focus:ring-offset-2
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        <RefreshCw
                            size={16}
                            className={
                                isFetching
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {isFetching
                            ? "Retrying..."
                            : "Try Again"
                        }

                    </button>

                </div>

            )}


            {/* Domains */}

            {!isLoading &&
                !isError && (

                    <>

                        {domains.length > 0 ? (

                            <SelectionGrid

                                items={
                                    domains
                                }

                                selectedId={
                                    selectedDomainId
                                }

                                onSelect={
                                    handleSelectDomain
                                }

                            />

                        ) : (

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-dashed
                                    border-slate-300
                                    bg-slate-50
                                    px-6
                                    py-12
                                    text-center
                                "
                            >

                                <h2
                                    className="
                                        text-lg
                                        font-semibold
                                        text-slate-900
                                    "
                                >

                                    No career domains available

                                </h2>

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        text-slate-500
                                    "
                                >

                                    Career domains haven't been
                                    configured yet.

                                </p>

                            </div>

                        )}


                        <NavigationButtons

                            backLabel="Back"

                            nextLabel="Continue"

                            disableNext={
                                !selectedDomainId
                            }

                            onBack={
                                handleBack
                            }

                            onNext={
                                handleContinue
                            }

                        />

                    </>

                )}

        </CareerSetupLayout>

    );

};

export default CareerDomainPage;