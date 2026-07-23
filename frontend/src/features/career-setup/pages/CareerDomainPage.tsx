import { Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CareerSetupLayout from "../../../components/layout/CareerSetupLayout";
import NavigationButtons from "../../../components/ui/NavigationButton/NavigationButtons";
import SkeletonCard from "../../../components/ui/SkeletonCard/SkeletonCard";

import SelectionGrid from "../components/SelectionGrid/SelectionGrid";

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
import { useEffect } from "react";

const CareerDomainPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const selectedDomainId = useAppSelector(
        (state) => state.careerSetup.selectedDomainId
    );

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetCareerDomainsQuery();

    const handleContinue = () => {
        if (!selectedDomainId) return;

        navigate("/career-role");
    };

    const domains =
        data?.data.map((domain) => ({
            id: domain.id,
            name: domain.name,
            description: domain.description,
            icon: (
                <Layers
                    size={40}
                    className="text-indigo-600"
                />
            ),
        })) ?? [];

    useEffect(() => {
        console.log("Domains:", domains)
    }, [])

    return (
        <CareerSetupLayout
            currentStep={2}
            totalSteps={4}
            title="Choose Your Career Domain"
            subtitle="Select the domain you want to build your career in."
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
                        We couldn't load career domains.
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
                        items={domains}
                        selectedId={selectedDomainId}
                        onSelect={(id) => {
                            console.log("id:", id)
                            dispatch(setSelectedDomain(id))
                        }}
                    />

                    <NavigationButtons
                        backLabel="Back"
                        nextLabel="Continue"
                        disableNext={!selectedDomainId}
                        onBack={() =>
                            navigate("/career-direction")
                        }
                        onNext={handleContinue}
                    />
                </>
            )}
        </CareerSetupLayout>
    );
};

export default CareerDomainPage;