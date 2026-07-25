import {
    Map,
    Sparkles,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";

interface RoadmapGenerationCardProps {
    onGenerate: () => void;

    isGenerating?: boolean;
}

const GenerateRoadmapCard = ({
    onGenerate,
    isGenerating = false,
}: RoadmapGenerationCardProps) => {
    return (
        <section className="rounded-xl border border-indigo-100 bg-white p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Map size={24} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
                Your assessment is complete
            </h2>

            <p className="mt-2 max-w-2xl leading-7 text-slate-600">
                CareerSaathi now understands your
                current skills and target role. Your
                personalized roadmap will prioritize
                skill gaps while considering what you
                already know.
            </p>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                    <Sparkles
                        size={19}
                        className="mt-0.5 shrink-0 text-indigo-600"
                    />

                    <div>
                        <p className="text-sm font-medium text-slate-900">
                            Personalized for your journey
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                            We'll use your target role,
                            available study time, required
                            skills and initial assessment
                            results to create your learning
                            sequence.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <Button
                    loading={isGenerating}
                    disabled={isGenerating}
                    onClick={onGenerate}
                >
                    Generate My Roadmap
                </Button>
            </div>
        </section>
    );
};

export default GenerateRoadmapCard;