const WorkspaceLoading = () => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <div className="h-screen w-64 animate-pulse border-r bg-white" />

            <main className="flex-1 p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="h-52 animate-pulse rounded-xl bg-slate-200" />

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-28 animate-pulse rounded-xl bg-slate-200"
                            />
                        ))}
                    </div>

                    <div className="h-72 animate-pulse rounded-xl bg-slate-200" />
                </div>
            </main>
        </div>
    );
};

export default WorkspaceLoading;