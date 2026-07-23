import { useNavigate } from "react-router-dom";
import { Compass, Target } from "lucide-react";

import CareerSetupLayout from "../../../components/layout/CareerSetupLayout";
import NavigationButtons from "../../../components/ui/NavigationButton/NavigationButtons";

import SelectionGrid from "../components/SelectionGrid/SelectionGrid";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCareerDirection } from "../slice/careerSetupSlice";

const careerDirections = [
  {
    id: "known",
    name: "I Know What To Do",
    description:
      "I already know the career path I want to pursue and just need a structured roadmap.",
    icon: <Target size={40} className="text-indigo-600" />,
  },
  {
    id: "unknown",
    name: "I Don't Know What To Do",
    description:
      "AI career guidance will help you discover the best career path.",
    icon: <Compass size={40} className="text-slate-400" />,
    badge: "Coming Soon",
    disabled: true,
  },
] as const;

const CareerDirectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedDirection = useAppSelector(
    (state) => state.careerSetup.selectedDirection
  );

  const handleContinue = () => {
    if (!selectedDirection) return;

    switch (selectedDirection) {
      case "known":
        navigate("/career-domain");
        break;

      case "unknown":
        break;

      default:
        break;
    }
  };

  return (
    <CareerSetupLayout
      currentStep={1}
      totalSteps={4}
      title="Let's understand your career journey"
      subtitle="Choose the option that best describes your current situation."
    >
      <SelectionGrid
        items={[...careerDirections]}
        selectedId={selectedDirection}
        onSelect={(id) =>
          dispatch(setCareerDirection(id as "known" | "unknown"))
        }
      />

      <NavigationButtons
        backLabel="Back"
        nextLabel="Continue"
        disableNext={!selectedDirection}
        onBack={() => navigate("/")}
        onNext={handleContinue}
      />
    </CareerSetupLayout>
  );
};

export default CareerDirectionPage;