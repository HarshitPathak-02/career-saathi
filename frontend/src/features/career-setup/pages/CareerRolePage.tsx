import {
    useEffect,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    Code2,
    RefreshCw,
} from "lucide-react";

import CareerSetupLayout
    from "../../../components/layout/CareerSetupLayout";

import NavigationButtons
    from "../../../components/ui/NavigationButton/NavigationButtons";

import SkeletonCard
    from "../../../components/ui/SkeletonCard/SkeletonCard";

import SelectionGrid
    from "../components/SelectionGrid/SelectionGrid";

import {
    useGetCareerRolesQuery,
} from "../api/careerSetupApi";

import {
    useAppDispatch,
    useAppSelector,
} from "../../../app/hooks";

import {
    setSelectedRole,
} from "../slice/careerSetupSlice";


const CareerRolePage = () => {

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

    const selectedRoleId =
        useAppSelector(
            (state) =>
                state
                    .careerSetup
                    .selectedRoleId
        );


    /*
    |--------------------------------------------------------------------------
    | Route Guard
    |--------------------------------------------------------------------------
    |
    | A career role depends on a selected career domain.
    | If the domain is missing, return the user to Step 2.
    |
    */

    useEffect(() => {

        if (
            !selectedDomainId
        ) {

            navigate(
                "/career-domain",
                {
                    replace: true,
                }
            );

        }

    }, [
        selectedDomainId,
        navigate,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Career Roles
    |--------------------------------------------------------------------------
    */

    const {

        data,

        isLoading,

        isError,

        isFetching,

        refetch,

    } =
        useGetCareerRolesQuery(
            selectedDomainId ?? "",
            {
                skip:
                    !selectedDomainId,
            }
        );


    /*
    |--------------------------------------------------------------------------
    | Role Options
    |--------------------------------------------------------------------------
    */

    const roles =
        data?.data.map(
            (role) => ({

                id:
                    role.id,

                name:
                    role.name,

                description:
                    role.description,

                icon: (
                    <Code2
                        size={28}
                    />
                ),

            })
        ) ?? [];


    /*
    |--------------------------------------------------------------------------
    | Select Role
    |--------------------------------------------------------------------------
    */

    const handleSelectRole = (
        roleId: string
    ) => {

        dispatch(
            setSelectedRole(
                roleId
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
            "/career-domain"
        );

    };


    const handleContinue = () => {

        if (
            !selectedRoleId
        ) {
            return;
        }

        navigate(
            "/career-journey"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <CareerSetupLayout

            currentStep={3}

            totalSteps={4}

            title="Choose Your Career Role"

            subtitle="Select the role you want to work toward. CareerSaathi will use your target role to identify the skills you need and build your personalized career journey."

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

                        Unable to load career roles

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
                        roles for your selected career
                        domain. Please try again.

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


            {/* Roles */}

            {!isLoading &&
                !isError &&
                selectedDomainId && (

                    <>

                        {roles.length > 0 ? (

                            <SelectionGrid

                                items={
                                    roles
                                }

                                selectedId={
                                    selectedRoleId
                                }

                                onSelect={
                                    handleSelectRole
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

                                <Code2
                                    size={28}
                                    className="
                                        mx-auto
                                        text-slate-400
                                    "
                                />

                                <h2
                                    className="
                                        mt-4
                                        text-lg
                                        font-semibold
                                        text-slate-900
                                    "
                                >

                                    No career roles available

                                </h2>

                                <p
                                    className="
                                        mx-auto
                                        mt-2
                                        max-w-md
                                        text-sm
                                        leading-6
                                        text-slate-500
                                    "
                                >

                                    There are currently no roles
                                    configured for this career
                                    domain. You can go back and
                                    choose another domain.

                                </p>

                            </div>

                        )}


                        {/* Navigation */}

                        <NavigationButtons

                            backLabel="Back"

                            nextLabel="Continue"

                            disableNext={
                                !selectedRoleId
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

export default CareerRolePage;