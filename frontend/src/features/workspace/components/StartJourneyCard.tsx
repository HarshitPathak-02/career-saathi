import { Rocket } from "lucide-react";

import Button from "../../../components/ui/Button/Button";

const StartJourneyCard = () => {
    const handleStartJourney = () => {
        // Mission generation/start journey API
        // will be connected in the mission slice.
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
                <Rocket size={24} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
                Your roadmap is ready
            </h2>

            <p className="mt-2 max-w-2xl text-slate-600">
                Your personalized roadmap has been prepared.
                Start your journey and CareerSaathi will
                create your first mission and daily targets.
            </p>

            <div className="mt-6">
                <Button onClick={handleStartJourney}>
                    Start My Journey
                </Button>
            </div>
        </section>
    );
};

export default StartJourneyCard;