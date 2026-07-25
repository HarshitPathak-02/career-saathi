import {
    ClipboardCheck,
    FileBarChart,
    Map,
    Settings,
    Target,
    User,
} from "lucide-react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

interface SidebarItem {
    label: string;

    icon: React.ReactNode;

    path?: string;

    disabled?: boolean;
}

const sidebarItems: SidebarItem[] = [
    {
        label: "Missions",
        icon: <Target size={20} />,
        path: "/missions",
    },

    {
        label: "Roadmap",
        icon: <Map size={20} />,
        path: "/roadmap",
    },

    {
        label: "Assessments",
        icon: <ClipboardCheck size={20} />,
        path: "/assessments",
    },

    {
        label: "Weekly Reports",
        icon: <FileBarChart size={20} />,
        disabled: true,
    },

    {
        label: "Monthly Reports",
        icon: <FileBarChart size={20} />,
        disabled: true,
    },
];

const WorkspaceSidebar = () => {

    const navigate =
        useNavigate();

    const location =
        useLocation();

    return (
        <aside
            className="
                flex
                h-screen
                w-64
                flex-col
                border-r
                border-slate-200
                bg-white
            "
        >

            <div className="border-b px-6 py-5">

                <button
                    type="button"
                    onClick={() =>
                        navigate("/workspace")
                    }
                    className="text-xl font-bold text-indigo-600"
                >
                    CareerSaathi
                </button>

            </div>

            <nav className="flex-1 space-y-2 p-4">

                {sidebarItems.map(
                    (item) => {

                        const isActive =
                            !!item.path &&
                            (
                                location.pathname ===
                                item.path ||
                                location.pathname.startsWith(
                                    `${item.path}/`
                                )
                            );

                        return (
                            <button
                                key={
                                    item.label
                                }
                                type="button"
                                disabled={
                                    item.disabled
                                }
                                onClick={() => {
                                    if (
                                        item.path
                                    ) {
                                        navigate(
                                            item.path
                                        );
                                    }
                                }}
                                className={`
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-lg
                                    px-4
                                    py-3
                                    text-left
                                    text-sm
                                    font-medium
                                    transition

                                    ${isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-700 hover:bg-slate-100"
                                    }

                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                `}
                            >
                                {item.icon}

                                <span>
                                    {item.label}
                                </span>
                            </button>
                        );
                    }
                )}

            </nav>

            <div className="space-y-2 border-t p-4">

                <button
                    type="button"
                    className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-4
                        py-3
                        text-sm
                        text-slate-700
                        hover:bg-slate-100
                    "
                >
                    <User size={20} />

                    Profile
                </button>

                <button
                    type="button"
                    className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-4
                        py-3
                        text-sm
                        text-slate-700
                        hover:bg-slate-100
                    "
                >
                    <Settings size={20} />

                    Settings
                </button>

            </div>

        </aside>
    );
};

export default WorkspaceSidebar;