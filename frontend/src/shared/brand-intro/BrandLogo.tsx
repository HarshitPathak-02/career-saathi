import { GraduationCap } from "lucide-react";

const BrandLogo = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
        <GraduationCap
          className="h-12 w-12 text-blue-500"
          strokeWidth={2.2}
        />
      </div>

      <h1 className="mt-8 text-7xl font-bold tracking-tight text-white">
        CareerSaathi
      </h1>

      <p className="mt-3 text-lg text-slate-400">
        Unburden Your Future. Get Your Direction.
      </p>
    </div>
  );
};

export default BrandLogo;