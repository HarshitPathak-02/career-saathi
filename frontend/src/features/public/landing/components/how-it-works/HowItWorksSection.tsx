import StepCard from "./StepCard";
import { STEPS } from "./steps";

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            How It Works
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Your Career Journey,
            <br />
            Guided by AI
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            CareerSaathi creates a personalized roadmap, assigns daily
            missions, tracks your progress, and helps you become
            interview-ready—all in one place.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              isLast={index === STEPS.length - 1}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;