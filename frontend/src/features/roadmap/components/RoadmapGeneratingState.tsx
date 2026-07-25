import {
    Brain,
    CheckCircle2,
    Map,
    Sparkles,
} from "lucide-react";

const RoadmapGeneratingState = () => {
    return (
        <section className="rounded-xl border border-indigo-100 bg-white p-8">
            <div className="mx-auto max-w-xl text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Sparkles
                        size={26}
                        className="animate-pulse"
                    />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-slate-900">
                    Building your personalized roadmap
                </h2>

                <p className="mt-2 leading-7 text-slate-600">
                    CareerSaathi is analyzing your
                    assessment and preparing a learning
                    sequence for your target role.
                </p>
            </div>

            <div className="mx-auto mt-8 max-w-lg space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                    <CheckCircle2
                        size={19}
                        className="shrink-0 text-emerald-600"
                    />

                    <span className="text-sm text-slate-700">
                        Initial assessment analyzed
                    </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                    <CheckCircle2
                        size={19}
                        className="shrink-0 text-emerald-600"
                    />

                    <span className="text-sm text-slate-700">
                        Required role skills identified
                    </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                    <Brain
                        size={19}
                        className="shrink-0 animate-pulse text-indigo-600"
                    />

                    <span className="text-sm font-medium text-indigo-900">
                        Prioritizing your skill gaps...
                    </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                    <Map
                        size={19}
                        className="shrink-0 text-slate-400"
                    />

                    <span className="text-sm text-slate-500">
                        Creating learning sequence
                    </span>
                </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
                This may take a few moments. Please keep
                this page open.
            </p>
        </section>
    );
};

export default RoadmapGeneratingState;