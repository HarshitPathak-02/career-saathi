const SkeletonCard = () => {
    return (
        <div className="animate-pulse rounded-xl border p-6">

            <div className="h-10 w-10 rounded-full bg-slate-200" />

            <div className="mt-6 h-5 w-40 rounded bg-slate-200" />

            <div className="mt-4 h-4 w-full rounded bg-slate-200" />

            <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />

        </div>
    );
};

export default SkeletonCard;