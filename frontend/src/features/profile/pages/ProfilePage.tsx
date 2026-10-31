import { useSearchParams, Link } from "react-router-dom";
import {
  Award,
  User as UserIcon,
  Compass,
  FileText,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import {
  useMeQuery,
  useUpdateProfileMutation,
} from "../../auth/api/authApi";
import { useGetWorkspaceQuery } from "../../workspace/api/workspaceApi";
import { useGetCompetencyPassportQuery } from "../api/profileApi";

import { CompetencyPassportView } from "../components/CompetencyPassportView";
import CareerJourneySwitcher from "../components/CareerJourneySwitcher";
import ProfileAvatar from "../components/ProfileAvatar";
import UpdateProfileForm from "../form/UpdateProfileForm";
import AccountInformationCard from "../components/AccountInformationCard";
import { ResumeSkillsCard } from "../../resume";

type ProfileTab = "passport" | "profile" | "journeys" | "resume";

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as ProfileTab;
  const activeTab: ProfileTab =
    tabParam && ["passport", "profile", "journeys", "resume"].includes(tabParam)
      ? tabParam
      : "passport";

  const handleTabChange = (tab: ProfileTab) => {
    setSearchParams({ tab });
  };

  const {
    data: meData,
    isLoading: isMeLoading,
    isError: isMeError,
    refetch: refetchMe,
  } = useMeQuery();

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const { data: workspaceData } = useGetWorkspaceQuery();
  const careerJourneyId = workspaceData?.data?.careerJourney?.id;

  const {
    data: passportData,
    isLoading: isPassportLoading,
  } = useGetCompetencyPassportQuery(careerJourneyId ?? "", {
    skip: !careerJourneyId,
  });

  if (isMeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (isMeError || !meData?.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Failed to load profile
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            We were unable to load your account information. Please check your connection and try again.
          </p>
          <button
            onClick={() => refetchMe()}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const user = meData.data;

  const tabs: { id: ProfileTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "passport", label: "Competency Passport", icon: Award },
    { id: "profile", label: "Personal Information", icon: UserIcon },
    { id: "journeys", label: "Career Journeys", icon: Compass },
    { id: "resume", label: "Resume & Skills", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            to="/workspace"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Workspace</span>
          </Link>
        </div>

        {/* Top Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                Learner Profile & Passport
              </span>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {user.fullName}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {user.headline || user.email}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Role: {user.role}
              </span>
              {user.emailVerified && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "passport" && (
            <div className="space-y-6">
              <CompetencyPassportView
                passport={passportData?.data}
                isLoading={isPassportLoading}
              />
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <ProfileAvatar user={user} />
                <UpdateProfileForm
                  user={user}
                  loading={isUpdating}
                  onSubmit={updateProfile}
                />
              </div>
              <AccountInformationCard user={user} />
            </div>
          )}

          {activeTab === "journeys" && (
            <CareerJourneySwitcher />
          )}

          {activeTab === "resume" && (
            <div className="space-y-6">
              {careerJourneyId ? (
                <ResumeSkillsCard careerJourneyId={careerJourneyId} />
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                  <p className="text-sm text-slate-500">
                    No active career journey found to display resume skills.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
