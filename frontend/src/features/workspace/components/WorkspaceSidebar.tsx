import {
    BarChart3,
    ClipboardCheck,
    FileBarChart,
    LayoutDashboard,
    Map,
    Settings,
    Target,
    User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";
import SettingsPopover from "../../settings/components/SettingsPopover";
import { useLogoutMutation } from "../../auth/api/authApi";
import LogoutModal from "../../settings/components/LogoutConfirmationModal";
import { logout as logoutAction } from '../../auth/slice/authSlice'
import { useDispatch } from "react-redux";
import logo from '../../../assets/logo.png'
import { useAuth } from "../../auth/hooks/useAuth";

interface WorkspaceSidebarProps {

    mobileOpen: boolean;

    onMobileClose: () => void;

}

interface SidebarItem {

    label: string;

    icon:
    React.ComponentType<{
        size?: number;
        className?: string;
    }>;

    path?: string;

    disabled?: boolean;

    badge?: string;

}

const sidebarItems:
    SidebarItem[] = [

        {
            label: "Workspace",
            icon: LayoutDashboard,
            path: "/workspace",
        },

        {
            label: "Missions",
            icon: Target,
            path: "/missions",
        },

        {
            label: "Roadmap",
            icon: Map,
            disabled: false,
            path: "/roadmap",
        },

        {
            label: "Assessments",
            icon: ClipboardCheck,
            disabled: false,
            path: "/assessments",
        },

        {
            label: "Weekly Reports",
            icon: FileBarChart,
            disabled: false,
            path: "/weekly-reports",
        },

        {
            label: "Monthly Reports",
            icon: BarChart3,
            path: "/monthly-reports",
            disabled: false,
        },

    ];

const WorkspaceSidebar = ({

    mobileOpen,

    onMobileClose,

}: WorkspaceSidebarProps) => {

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const dispatch = useDispatch();

    const [showSettings, setShowSettings] =
        useState(false);

    const [showLogoutModal, setShowLogoutModal] =
        useState(false);

    const [
        logout,
        {
            isLoading: isLoggingOut,
        },
    ] = useLogoutMutation();

    const { logoutUser } = useAuth();


    const settingsRef =
        useRef<HTMLDivElement>(null);

    /*
    |--------------------------------------------------------------------------
    | Navigation
    |--------------------------------------------------------------------------
    */

    const handleNavigate = (
        path?: string
    ) => {

        if (!path) {
            return;
        }

        navigate(path);

        onMobileClose();

    };

    const handleLogout = async () => {
        try {
            await logoutUser()

            console.log("Logout API completed");

            dispatch(logoutAction());

            console.log("After logout action");

            navigate("/login", { replace: true });

            console.log("Navigate called");

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;
            if (!target.closest("[data-settings-menu]")) {
                setShowSettings(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Sidebar Content
    |--------------------------------------------------------------------------
    */

    const sidebarContent = (

        <div
            data-settings-menu
            className="
                flex
                h-full
                flex-col
                bg-white
            "
        >

            {/* Brand */}

            <div
                className="
                    flex
                    h-18
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-slate-200
                    px-5
                    mt-9
                "
            >
                <img src={logo} alt="CareerSaathi LogoF" />

            </div>

            {/* Navigation */}

            <div
                className="
                    flex-1
                    overflow-y-auto
                    px-3
                    py-10
                "
            >

                <p
                    className="
                        px-3
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-slate-400
                    "
                >
                    Your Journey
                </p>

                <nav
                    className="
                        mt-3
                        space-y-1
                    "
                >

                    {sidebarItems.map(
                        (item) => {

                            const Icon =
                                item.icon;

                            const isActive =
                                !!item.path &&
                                (
                                    location.pathname ===
                                    item.path ||

                                    (
                                        item.path !==
                                        "/workspace" &&

                                        location.pathname
                                            .startsWith(
                                                `${item.path}/`
                                            )
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
                                    onClick={() =>
                                        handleNavigate(
                                            item.path
                                        )
                                    }
                                    className={`
                                        relative
                                        group
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        px-3
                                        py-2.5
                                        text-left
                                        text-sm
                                        font-medium
                                        transition-colors
                                        duration-200

                                        ${isActive
                                            ? `
                                                    text-blue-600
                                                `
                                            : `
                                                    text-slate-600
                                                    hover:text-slate-900
                                                `
                                        }
                                    `}
                                >

                                    {isActive && (

                                        <span
                                            className="
                                                absolute
                                                left-0
                                                top-1/2
                                                h-6
                                                w-1
                                                -translate-y-1/2
                                                rounded-r-full
                                                bg-blue-600
                                            "
                                        />

                                    )}

                                    <Icon
                                        size={19}
                                        className={
                                            isActive
                                                ? "text-blue-600"
                                                : "text-slate-400 transition group-hover:text-slate-600"
                                        }
                                    />

                                    <span
                                        className="
                                            min-w-0
                                            flex-1
                                        "
                                    >
                                        {item.label}
                                    </span>

                                    {item.badge && (

                                        <span
                                            className="
                                                rounded-full
                                                bg-slate-100
                                                px-2
                                                py-0.5
                                                text-[10px]
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-500
                                            "
                                        >
                                            {item.badge}
                                        </span>

                                    )}

                                </button>

                            );

                        }
                    )}

                </nav>

            </div>

            {/* Bottom */}

            <div
                ref={settingsRef}
                className="
        relative
        shrink-0
        border-t
        border-slate-200
        p-3
    "
            >

                <button
                    type="button"
                    className="
                        flex
                        w-full
                        items-center
                        gap-3
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        text-slate-600
                        transition-colors
                        duration-200
                        hover:text-slate-900
                    "
                    onClick={() => navigate('/profile')}
                >

                    <User
                        size={19}
                        className="text-slate-400"
                    />

                    Profile

                </button>

                <button
                    type="button"
                    onClick={() =>
                        setShowSettings(
                            previous => !previous
                        )
                    }
                    className="
        mt-1
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        text-sm
        font-medium
        text-slate-600
        transition
        hover:bg-slate-50
        hover:text-slate-900
    "
                >

                    <Settings
                        size={19}
                        className="text-slate-400"
                    />

                    Settings

                </button>
                {showSettings && (

                    <SettingsPopover

                        onLogout={() => {

                            console.log("Logout clicked");

                            setShowSettings(false);

                            setShowLogoutModal(true);

                        }}


                    />

                )}

            </div>
            <LogoutModal

                open={showLogoutModal}

                loading={isLoggingOut}

                onClose={() =>
                    setShowLogoutModal(false)
                }

                onConfirm={handleLogout}

            />

        </div>

    );

    return (

        <>

            {/* Desktop */}

            <aside
                className="
                    fixed
                    inset-y-0
                    left-0
                    z-40
                    hidden
                    w-64
                    border-r
                    border-slate-200
                    lg:block
                "
            >
                {sidebarContent}
            </aside>

            {/* Mobile / Tablet Overlay */}

            <div
                className={`
                    fixed
                    inset-0
                    z-50
                    lg:hidden

                    ${mobileOpen
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                    }
                `}
                aria-hidden={
                    !mobileOpen
                }
            >

                <div
                    onClick={
                        onMobileClose
                    }
                    className={`
                        absolute
                        inset-0
                        bg-slate-950/40
                        backdrop-blur-[2px]
                        transition-opacity
                        duration-300

                        ${mobileOpen
                            ? "opacity-100"
                            : "opacity-0"
                        }
                    `}
                />

                <aside
                    className={`
                        absolute
                        inset-y-0
                        left-0
                        w-[85%]
                        max-w-72
                        border-r
                        border-slate-200
                        bg-white
                        shadow-2xl
                        transition-transform
                        duration-300
                        ease-out

                        ${mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                        }
                    `}
                >
                    {sidebarContent}
                </aside>

            </div>

        </>

    );

};

export default WorkspaceSidebar;