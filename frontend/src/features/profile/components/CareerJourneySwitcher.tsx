import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass,
  CheckCircle2,
  Clock,
  Building2,
  Briefcase,
  PlusCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  useGetAllCareerJourneysQuery,
  useSwitchActiveCareerJourneyMutation,
} from "../api/profileApi";
import { showSuccess, showError } from "../../../shared/lib/toast";

export default function CareerJourneySwitcher() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetAllCareerJourneysQuery();
  const [switchActiveJourney, { isLoading: isSwitching }] =
    useSwitchActiveCareerJourneyMutation();
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  const journeys = data?.data ?? [];

  const handleSwitch = async (journeyId: string) => {
    try {
      setSwitchingId(journeyId);
      await switchActiveJourney(journeyId).unwrap();
      showSuccess("Switched active career journey successfully!");
      refetch();
    } catch {
      showError("Failed to switch career journey. Please try again.");
    } finally {
      setSwitchingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-800">
          Failed to load your career journeys.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Career Journeys ({journeys.length})
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your career paths, switch your active workspace focus, or start a new direction.
          </p>
        </div>
        <button
          onClick={() => navigate("/career-direction")}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Career Direction</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {journeys.map((journey) => {
          const isActive = journey.isCurrentlyActive || journey.status === "ACTIVE";
          const isBusy = switchingId === journey.id && isSwitching;

          return (
            <div
              key={journey.id}
              className={`relative rounded-2xl border p-6 transition-all ${
                isActive
                  ? "border-blue-500 bg-gradient-to-br from-blue-50/50 to-white shadow-sm ring-1 ring-blue-500"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {journey.targetRole}
                    </h3>
                    <p className="text-xs text-slate-500">{journey.targetDomain}</p>
                  </div>
                </div>

                {isActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Active Focus
                  </span>
                ) : (
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      journey.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {journey.status}
                  </span>
                )}
              </div>

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                {journey.targetCompany && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>Target Company: <strong className="text-slate-800">{journey.targetCompany}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                  <span>Timeline: {journey.targetDurationMonths} months</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Commitment: {journey.dailyStudyHours} hrs/day</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">
                  Created {new Date(journey.createdAt).toLocaleDateString()}
                </span>

                {isActive ? (
                  <button
                    onClick={() => navigate("/workspace")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <span>Go to Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    disabled={isBusy || isSwitching}
                    onClick={() => handleSwitch(journey.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isBusy ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Switching...</span>
                      </>
                    ) : (
                      <span>Switch Active</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
