// components/layout/CareerSetupLayout.tsx

import {
  type ReactNode,
} from "react";

import StepProgress
  from "../ui/StepProgress/StepProgress";

interface CareerSetupLayoutProps {

  title: string;

  subtitle: string;

  currentStep: number;

  totalSteps: number;

  children: ReactNode;

}

const CareerSetupLayout = ({

  title,

  subtitle,

  currentStep,

  totalSteps,

  children,

}: CareerSetupLayoutProps) => {

  return (

    <main className="min-h-screen bg-slate-50">

      <div
        className="
                    mx-auto
                    w-full
                    max-w-5xl
                    px-5
                    py-8
                    sm:px-6
                    sm:py-10
                    lg:px-8
                    lg:py-14
                "
      >

        {/* Progress */}

        <div className="mx-auto max-w-4xl">

          <StepProgress
            currentStep={
              currentStep
            }
            totalSteps={
              totalSteps
            }
          />

        </div>


        {/* Setup Card */}

        <section
          className="
                        mx-auto
                        mt-8
                        max-w-4xl
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                        sm:mt-10
                    "
        >

          {/* Header */}

          <div
            className="
                            border-b
                            border-slate-100
                            px-6
                            py-7
                            sm:px-8
                            sm:py-8
                            lg:px-10
                        "
          >

            <p
              className="
                                text-sm
                                font-semibold
                                uppercase
                                tracking-[0.12em]
                                text-indigo-600
                            "
            >

              Career Setup

            </p>

            <h1
              className="
                                mt-3
                                max-w-2xl
                                text-2xl
                                font-bold
                                tracking-tight
                                text-slate-900
                                sm:text-3xl
                            "
            >

              {title}

            </h1>

            <p
              className="
                                mt-3
                                max-w-2xl
                                text-sm
                                leading-6
                                text-slate-600
                                sm:text-base
                                sm:leading-7
                            "
            >

              {subtitle}

            </p>

          </div>


          {/* Content */}

          <div
            className="
                            px-6
                            py-7
                            sm:px-8
                            sm:py-8
                            lg:px-10
                            lg:py-10
                        "
          >

            {children}

          </div>

        </section>

      </div>

    </main>

  );

};

export default CareerSetupLayout;