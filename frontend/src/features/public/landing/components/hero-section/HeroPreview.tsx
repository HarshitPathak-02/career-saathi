const HeroPreview = () => {
  return (
    <div className="flex-1">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h3 className="text-xl font-semibold">
          Today's Mission
        </h3>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-slate-100 p-4">
            ✅ Learn Node.js Middleware
          </div>

          <div className="rounded-xl bg-slate-100 p-4">
            📚 Complete Express Routing
          </div>

          <div className="rounded-xl bg-slate-100 p-4">
            💻 Solve 2 JavaScript Problems
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-2 flex justify-between text-sm">
            <span>Mission Progress</span>
            <span>67%</span>
          </div>

          <div className="h-3 rounded-full bg-slate-200">
            <div className="h-3 w-2/3 rounded-full bg-blue-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPreview;