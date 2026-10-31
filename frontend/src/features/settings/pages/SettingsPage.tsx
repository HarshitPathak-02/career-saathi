import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  KeyRound,
  Shield,
  Clock,
  Bell,
  LogOut,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useMeQuery } from "../../auth/api/authApi";
import { useGetWorkspaceQuery } from "../../workspace/api/workspaceApi";
import { useChangeUserPasswordMutation } from "../../profile/api/profileApi";
import LogoutModal from "../components/LogoutConfirmationModal";
import { logout as logoutAction } from "../../auth/slice/authSlice";
import { useDispatch } from "react-redux";
import { showSuccess, showError } from "../../../shared/lib/toast";

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logoutUser } = useAuth();

  const { data: meData } = useMeQuery();
  const { data: workspaceData } = useGetWorkspaceQuery();

  const user = meData?.data;
  const careerJourney = workspaceData?.data?.careerJourney;

  // Password state
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Notification mock preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(true);
  const [assessmentAlertsEnabled, setAssessmentAlertsEnabled] = useState(true);

  const [changePassword, { isLoading: isChangingPassword }] =
    useChangeUserPasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onChangePasswordSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();

      showSuccess("Password updated successfully!");
      reset();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to change password. Please check your current password.";
      showError(errorMsg);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      dispatch(logoutAction());
      navigate("/login", { replace: true });
    } catch {
      showError("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link
            to="/workspace"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Workspace</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Account & Preferences Settings
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your credentials, study goals, notifications, and active session.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {/* Section 1: Security & Password */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Security & Password
                </h2>
                <p className="text-xs text-slate-500">
                  Ensure your account uses a secure password of at least 8 characters.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onChangePasswordSubmit)}
              className="mt-6 space-y-5"
            >
              {/* Current Password */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    {...register("currentPassword", {
                      required: "Current password is required",
                    })}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      {...register("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                      placeholder="At least 8 characters"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Please confirm your new password",
                        validate: (value) =>
                          value === getValues("newPassword") || "Passwords do not match",
                      })}
                      placeholder="Re-type new password"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Section 2: Study Commitment */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Active Journey Commitment
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your pace and study schedule for your active career target.
                  </p>
                </div>
              </div>

              <Link
                to="/profile?tab=journeys"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Switch Journey
              </Link>
            </div>

            {careerJourney ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Target Role</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {careerJourney.targetRole}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Domain</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {careerJourney.targetDomain}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Daily Study Hours</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {careerJourney.dailyStudyHours} hrs / day
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-xs text-slate-500">
                No active career journey configured yet.
              </p>
            )}
          </section>

          {/* Section 3: In-App & Notification Preferences */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Notification Preferences
                </h2>
                <p className="text-xs text-slate-500">
                  Control how you receive updates about missions, reviews, and achievements.
                </p>
              </div>
            </div>

            <div className="mt-6 divide-y divide-slate-100 space-y-4">
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">In-App Notifications</p>
                  <p className="text-xs text-slate-500">
                    Receive live notifications inside the workspace header bell.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsEnabled(!notificationsEnabled);
                    showSuccess(`In-app notifications ${!notificationsEnabled ? "enabled" : "disabled"}`);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notificationsEnabled ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notificationsEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">Assessment & Readiness Alerts</p>
                  <p className="text-xs text-slate-500">
                    Get alerted when a mock interview or coding milestone is evaluated.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAssessmentAlertsEnabled(!assessmentAlertsEnabled);
                    showSuccess(`Assessment alerts ${!assessmentAlertsEnabled ? "enabled" : "disabled"}`);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    assessmentAlertsEnabled ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      assessmentAlertsEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">Weekly Progress Digest</p>
                  <p className="text-xs text-slate-500">
                    Receive summary notifications when weekly reviews and monthly reports are generated.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmailDigestEnabled(!emailDigestEnabled);
                    showSuccess(`Weekly digest notifications ${!emailDigestEnabled ? "enabled" : "disabled"}`);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    emailDigestEnabled ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      emailDigestEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Section 4: Account Actions & Logout */}
          <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Account Session
                </h2>
                <p className="text-xs text-slate-500">
                  Signed in as <strong className="text-slate-700">{user?.email}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      <LogoutModal
        open={showLogoutModal}
        loading={isLoggingOut}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
