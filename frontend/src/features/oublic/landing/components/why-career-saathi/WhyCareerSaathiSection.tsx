import FeatureCard from "./FeatureCard";
import { FEATURES } from "./features";

const WhyCareerSaathiSection = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Why CareerSaathi?
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Everything You Need to Become
            <br />
            Job Ready
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Stop switching between YouTube, ChatGPT, notes and random
            roadmaps. CareerSaathi brings everything together into one
            personalized learning experience.
          </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
            />
          ))}

        </div>

      </div>
    </section>
  );
};

export default WhyCareerSaathiSection;