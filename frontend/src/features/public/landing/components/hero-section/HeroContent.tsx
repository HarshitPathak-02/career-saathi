import { Link } from "react-router-dom";

const HeroContent = () => {
    return (
        <div className="flex-1">
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                🚀 AI Career Mentor
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900">
                Stop Wondering What to Learn Next. Let AI Guide Your Tech Career.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                CareerSaathi creates personalized roadmaps, daily missions, interview
                preparation, and progress tracking so you always know what to learn
                next.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
                <Link
                    to="/register"
                    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                    Start Your Journey
                </Link>

                <a
                    href="#how-it-works"
                    className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                    Learn More
                </a>
            </div>
        </div>
    );
};

export default HeroContent;