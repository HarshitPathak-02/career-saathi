import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Code2 } from "lucide-react";

import CareerSetupLayout from "../../../components/layout/CareerSetupLayout";
import NavigationButtons from "../../../components/ui/NavigationButton/NavigationButtons";
import SkeletonCard from "../../../components/ui/SkeletonCard/SkeletonCard";

import SelectionGrid from "../components/SelectionGrid/SelectionGrid";

import { useGetCareerRolesQuery } from "../api/careerSetupApi";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { setSelectedRole } from "../slice/careerSetupSlice";

const CareerRolePage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const selectedDomainId = useAppSelector(
        (state) => state.careerSetup.selectedDomainId
    );

    const selectedRoleId = useAppSelector(
        (state) => state.careerSetup.selectedRoleId
    );

    useEffect(() => {
        if (!selectedDomainId) {
            navigate("/career-domain", {
                replace: true,
            });
        }
    }, [selectedDomainId, navigate]);

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetCareerRolesQuery(selectedDomainId!, {
        skip: !selectedDomainId,
    });

    const roles =
        data?.data.map((role) => ({
            id: role.id,
            name: role.name,
            description: role.description,
            icon: (
                <Code2
                    size={40}
                    className="text-indigo-600"
                />
            ),
        })) ?? [];

    const handleContinue = () => {
        if (!selectedRoleId) return;

        navigate("/career-journey");
    };

    return (
        <CareerSetupLayout
            currentStep={3}
            totalSteps={4}
            title="Choose Your Career Role"
            subtitle="Select the role you want CareerSaathi to prepare you for."
        >
            {isLoading && (
                <div className="grid gap-6 md:grid-cols-2">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            )}

            {isError && (
                <div className="flex flex-col items-center gap-4 py-20">
                    <p className="text-red-600">
                        Unable to load career roles.
                    </p>

                    <button
                        onClick={refetch}
                        className="rounded-lg bg-indigo-600 px-5 py-2 text-white"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    <SelectionGrid
                        items={roles}
                        selectedId={selectedRoleId}
                        onSelect={(id) =>
                            dispatch(setSelectedRole(id))
                        }
                    />

                    <NavigationButtons
                        backLabel="Back"
                        nextLabel="Continue"
                        disableNext={!selectedRoleId}
                        onBack={() => navigate("/career-domain")}
                        onNext={handleContinue}
                    />
                </>
            )}
        </CareerSetupLayout>
    );
};

export default CareerRolePage;