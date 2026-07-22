import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 px-10 py-20 text-center text-white">

          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
            Start Today
          </span>

          <h2 className="mt-6 text-4xl font-bold">
            Ready to Build Your Tech Career?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Join CareerSaathi and let AI guide you with personalized
            roadmaps, daily missions, and interview preparation.
          </p>

          <Link
            to="/register"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:scale-105"
          >
            Start Your Journey
            <ArrowRight size={20} />
          </Link>

        </div>
      </div>
    </section>
  );
};

export default CTASection;