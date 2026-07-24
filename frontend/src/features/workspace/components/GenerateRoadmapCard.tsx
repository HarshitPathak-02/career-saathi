import { Map } from "lucide-react";

import Button from "../../../components/ui/Button/Button";

const GenerateRoadmapCard = () => {
    const handleGenerateRoadmap = () => {
        // Roadmap generation API will be connected
        // when we implement the roadmap vertical slice.
    };

    return (
        <section
            className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-8
      "
        >
            <div
                className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-xl
          bg-indigo-50
          text-indigo-600
        "
            >
                <Map size={24} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
                Your assessment is complete
            </h2>

            <p className="mt-2 max-w-2xl text-slate-600">
                We now understand your current skill level.
                Generate your personalized career roadmap
                based on your target role, available study
                time, and assessment results.
            </p>

            <div className="mt-6">
                <Button onClick={handleGenerateRoadmap}>
                    Generate My Roadmap
                </Button>
            </div>
        </section>
    );
};

export default GenerateRoadmapCard;