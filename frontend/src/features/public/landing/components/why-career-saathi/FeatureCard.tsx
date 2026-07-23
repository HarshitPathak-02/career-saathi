import { type Feature } from "./features";

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
  const Icon = feature.icon;

  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-8
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-xl
      "
    >
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50">
        <Icon className="h-7 w-7 text-blue-600" />
      </div>

      <h3 className="text-xl font-bold text-slate-900">
        {feature.title}
      </h3>

      <p className="mt-4 leading-7 text-slate-600">
        {feature.description}
      </p>
    </div>
  );
};

export default FeatureCard;