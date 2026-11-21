import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Menu,
  ChevronRight,
  ArrowLeft,
  LayoutDashboard,
  User,
  Map,
  ClipboardCheck,
  Code2,
  FileBarChart,
  BarChart3,
  Target,
  Award,
} from "lucide-react";

import WorkspaceSidebar from "../features/workspace/components/WorkspaceSidebar";
import { useAppSelector } from "../app/hooks";
import { useGetWorkspaceQuery } from "../features/workspace/api/workspaceApi";
import logo from "../assets/logo.png";

interface PageMeta {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const getPageMeta = (pathname: string): PageMeta => {
  if (pathname === "/workspace") {
    return { title: "Workspace", icon: LayoutDashboard };
  }
  if (pathname.startsWith("/roadmap")) {
    return { title: "Roadmap", icon: Map };
  }
  if (pathname.startsWith("/assessments")) {
    return { title: "Assessments", icon: ClipboardCheck };
  }
  if (pathname.startsWith("/practice")) {
    return { title: "Practice Ground", icon: Code2 };
  }
  if (pathname.startsWith("/missions")) {
    return { title: "Missions", icon: Target };
  }
  if (pathname.startsWith("/weekly-reports")) {
    return { title: "Weekly Reports", icon: FileBarChart };
  }
  if (pathname.startsWith("/monthly-reports")) {
    return { title: "Monthly Reports", icon: BarChart3 };
  }
  if (pathname.startsWith("/readiness")) {
    return { title: "Job Readiness", icon: Award };
  }
  if (pathname.startsWith("/profile")) {
    return { title: "Profile", icon: User };
  }
  if (pathname.startsWith("/weekly-review")) {
    return { title: "Weekly Review", icon: FileBarChart };
  }
  return { title: "Workspace", icon: LayoutDashboard };
};

const AppLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const { user } = useAppSelector((state) => state.auth);
  const { data: workspaceResponse } = useGetWorkspaceQuery();
  const activeRole = workspaceResponse?.data?.careerJourney?.targetRole;

  const pageMeta = getPageMeta(location.pathname);
  const PageIcon = pageMeta.icon;
  const isWorkspaceHome = location.pathname === "/workspace";

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Persistent Left Sidebar */}
      <WorkspaceSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Universal Top Application Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8 shadow-2xs">
          {/* Left: Mobile Hamburger & Desktop Breadcrumb Navigation */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open Navigation Menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden shadow-2xs"
            >
              <Menu size={20} />
            </button>

            {/* Mobile Logo Brand */}
            <Link to="/workspace" className="flex items-center gap-2 lg:hidden">
              <img src={logo} alt="CareerSaathi Logo" className="h-7 w-auto object-contain" />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {pageMeta.title}
              </span>
            </Link>

            {/* Desktop Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="hidden lg:flex items-center gap-2 text-sm">
              <Link
                to="/workspace"
                className={`flex items-center gap-1.5 transition-colors ${
                  isWorkspaceHome
                    ? "font-bold text-slate-900"
                    : "font-medium text-slate-500 hover:text-blue-600"
                }`}
              >
                <LayoutDashboard size={16} className={isWorkspaceHome ? "text-blue-600" : "text-slate-400"} />
                <span>Workspace</span>
              </Link>

              {!isWorkspaceHome && (
                <>
                  <ChevronRight size={15} className="text-slate-300" />
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <PageIcon size={16} className="text-blue-600" />
                    <span>{pageMeta.title}</span>
                  </div>
                </>
              )}
            </nav>
          </div>

          {/* Right: Quick Back Button (on subpages), Target Role, and Profile */}
          <div className="flex items-center gap-3">
            {/* Universal Return to Workspace Button on every subpage */}
            {!isWorkspaceHome && (
              <Link
                to="/workspace"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-600 shadow-2xs"
              >
                <ArrowLeft size={13} className="text-slate-500" />
                <span>Return to Workspace</span>
              </Link>
            )}

            {/* Target Role Tag (Desktop) */}
            {activeRole && (
              <span className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Target: {activeRole}</span>
              </span>
            )}

            {/* User Profile Pill */}
            {user && (
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-xl p-1.5 pr-3 text-xs font-medium text-slate-700 transition hover:bg-slate-100 border border-transparent hover:border-slate-200"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white shadow-2xs">
                  {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline font-semibold text-slate-800">
                  {user.fullName?.split(" ")[0]}
                </span>
              </Link>
            )}
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
