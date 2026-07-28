import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    Controller,
    useForm,
} from "react-hook-form";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

import {
    AlertCircle,
} from "lucide-react";

import CareerSetupLayout
    from "../../../components/layout/CareerSetupLayout";

import NavigationButtons
    from "../../../components/ui/NavigationButton/NavigationButtons";

import FormField
    from "../../../components/ui/Form/FormField";

import FormSelect
    from "../../../components/ui/Form/FormSelect";

import {
    useAppDispatch,
    useAppSelector,
} from "../../../app/hooks";

import {
    updateCareerJourneyForm,
} from "../slice/careerSetupSlice";

import {
    useCreateCareerJourneyMutation,
} from "../api/careerSetupApi";

import {
    careerJourneySchema,
    type CareerJourneyFormValues,
} from "../validation/careerJourney.schema";

import {
    TARGET_DURATION_OPTIONS,
    STUDY_HOURS_OPTIONS,
    LANGUAGE_OPTIONS,
} from "../constants/careerJourney";

import {
    PreferredLanguage,
} from "../constants/enums";


const CareerJourneyPage = () => {

    const navigate =
        useNavigate();

    const dispatch =
        useAppDispatch();


    /*
    |--------------------------------------------------------------------------
    | Career Setup State
    |--------------------------------------------------------------------------
    */

    const {

        selectedDomainId,

        selectedRoleId,

        targetCompany,

        targetDurationMonths,

        dailyStudyHours,

        preferredLanguage,

    } =
        useAppSelector(
            (state) =>
                state.careerSetup
        );


    /*
    |--------------------------------------------------------------------------
    | Local State
    |--------------------------------------------------------------------------
    */

    const [
        submitError,
        setSubmitError,
    ] =
        useState<string | null>(
            null
        );


    /*
    |--------------------------------------------------------------------------
    | Create Career Journey
    |--------------------------------------------------------------------------
    */

    const [

        createCareerJourney,

        {
            isLoading:
            isCreatingJourney,
        },

    ] =
        useCreateCareerJourneyMutation();


    /*
    |--------------------------------------------------------------------------
    | Route Guard
    |--------------------------------------------------------------------------
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

            return;

        }

        if (
            !selectedRoleId
        ) {

            navigate(
                "/career-role",
                {
                    replace: true,
                }
            );

        }

    }, [
        navigate,
        selectedDomainId,
        selectedRoleId,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Form
    |--------------------------------------------------------------------------
    */

    const {

        control,

        register,

        handleSubmit,

        formState: {
            errors,
        },

    } =
        useForm<CareerJourneyFormValues>({

            resolver:
                zodResolver(
                    careerJourneySchema
                ),

            mode:
                "onTouched",

            defaultValues: {

                targetCompany,

                targetDurationMonths,

                dailyStudyHours,

                preferredLanguage:
                    preferredLanguage ??
                    PreferredLanguage.ENGLISH,

            },

        });


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const onSubmit = async (
        values: CareerJourneyFormValues
    ) => {

        if (
            !selectedDomainId ||
            !selectedRoleId ||
            isCreatingJourney
        ) {
            return;
        }

        setSubmitError(
            null
        );

        try {

            /*
            |------------------------------------------------------------------
            | Preserve Setup State
            |------------------------------------------------------------------
            */

            dispatch(
                updateCareerJourneyForm(
                    values
                )
            );


            /*
            |------------------------------------------------------------------
            | Create Career Journey
            |------------------------------------------------------------------
            */

            await createCareerJourney({

                domainId:
                    selectedDomainId,

                roleId:
                    selectedRoleId,

                targetCompany:
                    values.targetCompany?.trim()
                        ? values.targetCompany.trim()
                        : undefined,

                targetDurationMonths:
                    values.targetDurationMonths,

                dailyStudyHours:
                    values.dailyStudyHours,

                preferredLanguage:
                    values.preferredLanguage,

            }).unwrap();


            /*
            |------------------------------------------------------------------
            | Continue To Workspace
            |------------------------------------------------------------------
            */

            navigate(
                "/workspace",
                {
                    replace: true,
                }
            );

        } catch (error) {

            console.error(
                "Failed to create career journey",
                error
            );

            setSubmitError(
                "We couldn't create your career journey. Please try again."
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Navigation
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {

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

            title="Complete Your Career Setup"

            subtitle="Tell us about your target and learning preferences. CareerSaathi will use these details to personalize your assessment, roadmap, missions, and learning pace."

            currentStep={4}

            totalSteps={4}

        >

            <form
                onSubmit={
                    handleSubmit(
                        onSubmit
                    )
                }
            >

                {/* Form Fields */}

                <div className="space-y-6">

                    <FormField

                        id="targetCompany"

                        label="Target Company"

                        placeholder="e.g. Google, Microsoft, Amazon"

                        errorMessage={
                            errors
                                .targetCompany
                                ?.message
                        }

                        {...register(
                            "targetCompany"
                        )}

                    />


                    <Controller

                        control={
                            control
                        }

                        name="targetDurationMonths"

                        render={({
                            field,
                        }) => (

                            <FormSelect

                                id="targetDurationMonths"

                                label="Target Duration"

                                options={
                                    TARGET_DURATION_OPTIONS
                                }

                                value={
                                    field.value
                                }

                                onChange={(
                                    event
                                ) =>
                                    field.onChange(
                                        Number(
                                            event
                                                .target
                                                .value
                                        )
                                    )
                                }

                                errorMessage={
                                    errors
                                        .targetDurationMonths
                                        ?.message
                                }

                            />

                        )}

                    />


                    <Controller

                        control={
                            control
                        }

                        name="dailyStudyHours"

                        render={({
                            field,
                        }) => (

                            <FormSelect

                                id="dailyStudyHours"

                                label="Daily Study Hours"

                                options={
                                    STUDY_HOURS_OPTIONS
                                }

                                value={
                                    field.value
                                }

                                onChange={(
                                    event
                                ) =>
                                    field.onChange(
                                        Number(
                                            event
                                                .target
                                                .value
                                        )
                                    )
                                }

                                errorMessage={
                                    errors
                                        .dailyStudyHours
                                        ?.message
                                }

                            />

                        )}

                    />


                    <Controller

                        control={
                            control
                        }

                        name="preferredLanguage"

                        render={({
                            field,
                        }) => (

                            <FormSelect

                                id="preferredLanguage"

                                label="Preferred Language"

                                options={
                                    LANGUAGE_OPTIONS
                                }

                                value={
                                    field.value
                                }

                                onChange={
                                    field.onChange
                                }

                                errorMessage={
                                    errors
                                        .preferredLanguage
                                        ?.message
                                }

                            />

                        )}

                    />

                </div>


                {/* Submission Error */}

                {submitError && (

                    <div
                        className="
                            mt-6
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            p-4
                        "
                        role="alert"
                    >

                        <AlertCircle
                            size={19}
                            className="
                                mt-0.5
                                shrink-0
                                text-red-600
                            "
                        />

                        <div>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-red-900
                                "
                            >

                                Career journey could not be created

                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    leading-6
                                    text-red-700
                                "
                            >

                                {submitError}

                            </p>

                        </div>

                    </div>

                )}


                {/* Navigation */}

                <NavigationButtons

                    onBack={
                        handleBack
                    }

                    nextLabel={
                        isCreatingJourney
                            ? "Creating Journey..."
                            : "Create My Journey"
                    }

                    disableNext={
                        isCreatingJourney
                    }

                    onNext={
                        handleSubmit(
                            onSubmit
                        )
                    }

                />

            </form>

        </CareerSetupLayout>

    );

};

export default CareerJourneyPage;