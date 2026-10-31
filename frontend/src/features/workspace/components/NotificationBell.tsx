import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  Target,
  ClipboardCheck,
  FileBarChart,
  BarChart3,
  Award,
  Info,
  Clock,
  Loader2,
} from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "../../profile/api/profileApi";
import type { NotificationItem } from "../../profile/types/profile.types";
import { showSuccess, showError } from "../../../shared/lib/toast";

const formatRelativeTime = (isoString: string) => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export default function NotificationBell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetNotificationsQuery(undefined, {
    pollingInterval: 60000, // Poll every minute
  });

  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();

  const notifications = data?.data?.notifications ?? [];
  const unreadCount = data?.data?.unreadCount ?? 0;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
      showSuccess("All notifications marked as read");
    } catch {
      showError("Failed to mark notifications as read");
    }
  };

  const handleItemClick = async (notification: NotificationItem) => {
    const notificationId = notification.id || notification._id;
    if (!notification.isRead && notificationId) {
      try {
        await markRead(notificationId).unwrap();
      } catch {
        // Silently continue
      }
    }
    if (notification.actionUrl) {
      setIsOpen(false);
      navigate(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "MISSION_ASSIGNED":
        return <Target className="h-4 w-4 text-blue-600" />;
      case "ASSESSMENT_READY":
        return <ClipboardCheck className="h-4 w-4 text-emerald-600" />;
      case "WEEKLY_REVIEW_READY":
        return <FileBarChart className="h-4 w-4 text-amber-600" />;
      case "MONTHLY_REPORT_READY":
        return <BarChart3 className="h-4 w-4 text-purple-600" />;
      case "ACHIEVEMENT":
        return <Award className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white shadow-xs">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={isMarkingAll}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                {isMarkingAll ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <CheckCheck className="h-3.5 w-3.5" />
                )}
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center px-4">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-2">
                  <Check className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-slate-800">You're all caught up!</p>
                <p className="text-xs text-slate-400 mt-1">No notifications right now.</p>
              </div>
            ) : (
              notifications.map((n) => {
                const id = n.id || n._id;
                return (
                  <div
                    key={id}
                    onClick={() => handleItemClick(n)}
                    className={`flex items-start gap-3 p-3.5 transition cursor-pointer hover:bg-slate-50 ${
                      !n.isRead ? "bg-blue-50/30" : ""
                    }`}
                  >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-xs font-semibold truncate ${!n.isRead ? "text-slate-900 font-bold" : "text-slate-700"}`}>
                        {n.title}
                      </h4>
                      <span className="shrink-0 flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock className="h-2.5 w-2.5" />
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {n.message}
                    </p>
                  </div>

                  {!n.isRead && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                  )}
                </div>
              );
            })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
