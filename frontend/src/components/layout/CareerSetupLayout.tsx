// components/layout/CareerSetupLayout.tsx

import { type ReactNode } from "react";

interface CareerSetupLayoutProps {
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
}

import StepProgress from "../ui/StepProgress/StepProgress";

const CareerSetupLayout = ({
  title,
  subtitle,
  currentStep,
  totalSteps,
  children,
}: CareerSetupLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center px-6 py-10">
      <div className="w-full max-w-4xl">

        <StepProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
        />

        <div className="mt-8 rounded-2xl bg-white shadow-lg p-8">

          <h1 className="text-3xl font-bold text-slate-900">
            {title}
          </h1>

          <p className="mt-2 text-slate-600">
            {subtitle}
          </p>

          <div className="mt-10">
            {children}
          </div>

        </div>

      </div>
    </div>
  );
};

export default CareerSetupLayout;