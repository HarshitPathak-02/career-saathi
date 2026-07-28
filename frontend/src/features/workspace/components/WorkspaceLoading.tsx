const WorkspaceLoading = () => {

    return (

        <div
            className="
                min-h-screen
                bg-slate-50
                lg:flex
            "
        >

            {/* Desktop Sidebar Skeleton */}

            <aside
                className="
                    fixed
                    inset-y-0
                    left-0
                    hidden
                    w-64
                    border-r
                    border-slate-200
                    bg-white
                    lg:block
                "
            >

                <div
                    className="
                        h-[72px]
                        border-b
                        border-slate-200
                        p-5
                    "
                >

                    <div
                        className="
                            h-8
                            w-40
                            animate-pulse
                            rounded-lg
                            bg-slate-200
                        "
                    />

                </div>

                <div
                    className="
                        space-y-3
                        p-4
                    "
                >

                    {[1, 2, 3, 4, 5].map(
                        (item) => (

                            <div
                                key={item}
                                className="
                                    h-11
                                    animate-pulse
                                    rounded-xl
                                    bg-slate-100
                                "
                            />

                        )
                    )}

                </div>

            </aside>

            {/* Content */}

            <main
                className="
                    min-w-0
                    flex-1
                    lg:ml-64
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        space-y-5
                        px-4
                        py-5
                        sm:space-y-6
                        sm:px-6
                        sm:py-7
                        lg:px-8
                        lg:py-8
                    "
                >

                    {/* Header */}

                    <div
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                        "
                    >

                        <div
                            className="
                                p-6
                                sm:p-8
                            "
                        >

                            <div
                                className="
                                    h-4
                                    w-32
                                    animate-pulse
                                    rounded
                                    bg-slate-200
                                "
                            />

                            <div
                                className="
                                    mt-4
                                    h-8
                                    w-64
                                    max-w-full
                                    animate-pulse
                                    rounded-lg
                                    bg-slate-200
                                "
                            />

                            <div
                                className="
                                    mt-4
                                    h-4
                                    w-full
                                    max-w-xl
                                    animate-pulse
                                    rounded
                                    bg-slate-100
                                "
                            />

                        </div>

                        <div
                            className="
                                grid
                                gap-3
                                border-t
                                border-slate-200
                                bg-slate-50
                                p-5
                                sm:grid-cols-2
                                lg:grid-cols-5
                            "
                        >

                            {[1, 2, 3, 4, 5].map(
                                item => (

                                    <div
                                        key={item}
                                        className="
                                            h-20
                                            animate-pulse
                                            rounded-xl
                                            bg-white
                                        "
                                    />

                                )
                            )}

                        </div>

                    </div>

                    {/* Overview */}

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-3
                            sm:gap-4
                            xl:grid-cols-4
                        "
                    >

                        {[1, 2, 3, 4].map(
                            item => (

                                <div
                                    key={item}
                                    className="
                                        h-28
                                        animate-pulse
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        sm:h-32
                                    "
                                />

                            )
                        )}

                    </div>

                    {/* Stage */}

                    <div
                        className="
                            h-80
                            animate-pulse
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                        "
                    />

                </div>

            </main>

        </div>

    );

};

export default WorkspaceLoading;