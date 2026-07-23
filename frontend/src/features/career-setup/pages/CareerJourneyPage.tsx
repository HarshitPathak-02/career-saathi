import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CareerSetupLayout from "../../../components/layout/CareerSetupLayout";
import NavigationButtons from "../../../components/ui/NavigationButton/NavigationButtons";

import FormField from "../../../components/ui/Form/FormField";
import FormSelect from "../../../components/ui/Form/FormSelect";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import {
    updateCareerJourneyForm,
    resetCareerSetup,
} from "../slice/careerSetupSlice";

import { useCreateCareerJourneyMutation } from "../api/careerSetupApi";

import {
    careerJourneySchema,
    type CareerJourneyFormValues,
} from "../validation/careerJourney.schema";

import {
    TARGET_DURATION_OPTIONS,
    STUDY_HOURS_OPTIONS,
    LANGUAGE_OPTIONS,
} from "../constants/careerJourney";

import { PreferredLanguage } from "../constants/enums";

const CareerJourneyPage = () => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const {
        selectedDomainId,
        selectedRoleId,
        targetCompany,
        targetDurationMonths,
        dailyStudyHours,
        preferredLanguage,
    } = useAppSelector((state) => state.careerSetup);

    const [createCareerJourney] =
        useCreateCareerJourneyMutation();

    useEffect(() => {
        if (!selectedDomainId) {
            navigate("/career-domain", {
                replace: true,
            });

            return;
        }

        if (!selectedRoleId) {
            navigate("/career-role", {
                replace: true,
            });
        }
    }, [navigate, selectedDomainId, selectedRoleId]);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CareerJourneyFormValues>({
        resolver: zodResolver(careerJourneySchema),

        defaultValues: {
            targetCompany,

            targetDurationMonths,

            dailyStudyHours,

            preferredLanguage:
                preferredLanguage ??
                PreferredLanguage.ENGLISH,
        },
    });

    const onSubmit = async (
        values: CareerJourneyFormValues
    ) => {
        if (!selectedDomainId || !selectedRoleId) {
            return;
        }

        try {
            dispatch(
                updateCareerJourneyForm(values)
            );

            const payload = {
                domainId: selectedDomainId,
                roleId: selectedRoleId,
                targetCompany: values.targetCompany || undefined,
                targetDurationMonths: values.targetDurationMonths,
                dailyStudyHours: values.dailyStudyHours,
                preferredLanguage: values.preferredLanguage,
            };

            console.log("Payload:", payload);

            await createCareerJourney({
                domainId: selectedDomainId,

                roleId: selectedRoleId,

                targetCompany:
                    values.targetCompany || undefined,

                targetDurationMonths:
                    values.targetDurationMonths,

                dailyStudyHours:
                    values.dailyStudyHours,

                preferredLanguage:
                    values.preferredLanguage,
            }).unwrap();

            navigate("/workspace", {
                replace: true,
            });

        } catch (error) {
            console.error(
                "Failed to create career journey",
                error
            );
        }
    };

    return (
        <CareerSetupLayout
            title="Career Journey Details"
            subtitle="Tell us about your goal so we can prepare a personalized roadmap."
            currentStep={4}
            totalSteps={4}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <FormField
                    id="targetCompany"
                    label="Target Company (Optional)"
                    placeholder="Google, Microsoft, Amazon..."
                    errorMessage={
                        errors.targetCompany?.message
                    }
                    {...register("targetCompany")}
                />

                <Controller
                    control={control}
                    name="targetDurationMonths"
                    render={({ field }) => (
                        <FormSelect
                            id="targetDurationMonths"
                            label="Target Duration"
                            options={
                                TARGET_DURATION_OPTIONS
                            }
                            value={field.value}
                            onChange={(e) =>
                                field.onChange(
                                    Number(e.target.value)
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
                    control={control}
                    name="dailyStudyHours"
                    render={({ field }) => (
                        <FormSelect
                            id="dailyStudyHours"
                            label="Daily Study Hours"
                            options={
                                STUDY_HOURS_OPTIONS
                            }
                            value={field.value}
                            onChange={(e) =>
                                field.onChange(
                                    Number(e.target.value)
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
                    control={control}
                    name="preferredLanguage"
                    render={({ field }) => (
                        <FormSelect
                            id="preferredLanguage"
                            label="Preferred Language"
                            options={LANGUAGE_OPTIONS}
                            value={field.value}
                            onChange={field.onChange}
                            errorMessage={
                                errors
                                    .preferredLanguage
                                    ?.message
                            }
                        />
                    )}
                />

                <NavigationButtons
                    onBack={() =>
                        navigate("/career-role")
                    }
                    nextLabel="Create Journey"
                    onNext={handleSubmit(onSubmit)}
                />
            </form>
        </CareerSetupLayout>
    );
};

export default CareerJourneyPage;