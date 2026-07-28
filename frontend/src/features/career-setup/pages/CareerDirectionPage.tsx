import {
  Compass,
  Target,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import CareerSetupLayout
  from "../../../components/layout/CareerSetupLayout";

import NavigationButtons
  from "../../../components/ui/NavigationButton/NavigationButtons";

import SelectionGrid
  from "../components/SelectionGrid/SelectionGrid";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import {
  setCareerDirection,
} from "../slice/careerSetupSlice";


/*
|--------------------------------------------------------------------------
| Career Direction Options
|--------------------------------------------------------------------------
*/

const careerDirections = [

  {
    id: "known",

    name:
      "I Have a Career Goal",

    description:
      "I already know the role or career path I want to pursue and need a structured plan to reach it.",

    icon: (
      <Target
        size={32}
        className="text-indigo-600"
      />
    ),
  },

  {
    id: "unknown",

    name:
      "I'm Exploring My Options",

    description:
      "I'm not sure which career path is right for me and want guidance based on my interests and strengths.",

    icon: (
      <Compass
        size={32}
        className="text-slate-400"
      />
    ),

    badge:
      "Coming Soon",

    disabled:
      true,
  },

] as const;


/*
|--------------------------------------------------------------------------
| Career Direction Page
|--------------------------------------------------------------------------
*/

const CareerDirectionPage = () => {

  const navigate =
    useNavigate();

  const dispatch =
    useAppDispatch();


  /*
  |--------------------------------------------------------------------------
  | Career Setup State
  |--------------------------------------------------------------------------
  */

  const selectedDirection =
    useAppSelector(
      (state) =>
        state
          .careerSetup
          .selectedDirection
    );


  /*
  |--------------------------------------------------------------------------
  | Continue
  |--------------------------------------------------------------------------
  */

  const handleContinue = () => {

    if (!selectedDirection) {
      return;
    }

    switch (selectedDirection) {

      case "known":

        navigate(
          "/career-domain"
        );

        break;

      case "unknown":

        /*
         * Career discovery flow
         * will be implemented later.
         */

        break;

      default:
        break;

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Select Direction
  |--------------------------------------------------------------------------
  */

  const handleSelectDirection = (
    id: string
  ) => {

    dispatch(
      setCareerDirection(
        id as
        | "known"
        | "unknown"
      )
    );

  };


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <CareerSetupLayout

      currentStep={1}

      totalSteps={4}

      title="Let's Start With Your Career Direction"

      subtitle="
                Tell us where you currently stand.
                CareerSaathi will use this to shape
                the right journey for you.
            "

    >

      {/* Direction Selection */}

      <SelectionGrid

        items={[
          ...careerDirections,
        ]}

        selectedId={
          selectedDirection
        }

        onSelect={
          handleSelectDirection
        }

      />


      {/* Navigation */}

      <NavigationButtons

        backLabel="Back"

        nextLabel="Continue"

        disableNext={
          !selectedDirection
        }

        onBack={() =>
          navigate("/")
        }

        onNext={
          handleContinue
        }

      />

    </CareerSetupLayout>

  );

};

export default CareerDirectionPage;