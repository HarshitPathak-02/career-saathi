import { ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";

const InitialAssessmentCard = () => {
    const navigate = useNavigate();

    return (
        <section
            className="
        rounded-xl
        border
        border-indigo-100
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
                <ClipboardCheck size={24} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
                Let's understand where you currently stand
            </h2>

            <p className="mt-2 max-w-2xl text-slate-600">
                Before starting your journey, CareerSaathi
                needs to understand your current skill level.
                Complete your initial assessment so we can
                build a roadmap around your strengths and
                skill gaps.
            </p>

            <div className="mt-6">
                <Button
                    onClick={() =>
                        navigate("/initial-assessment")
                    }
                >
                    Take Initial Assessment
                </Button>
            </div>
        </section>
    );
};

export default InitialAssessmentCard;