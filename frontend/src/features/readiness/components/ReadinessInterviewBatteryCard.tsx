import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  AlertCircle,
  Loader2,
  HelpCircle,
} from "lucide-react";

import {
  useGetReadinessBatteryQuery,
  useStartOfficialMockInterviewMutation,
} from "../../mock-interviews/api/mockInterviewApi";
import type { ReadinessBatterySlot } from "../../mock-interviews/types/mock-interview.types";

interface ReadinessInterviewBatteryCardProps {
  careerJourneyId: string;
  onOpenManualModal?: () => void;
}

export const ReadinessInterviewBatteryCard = ({
  careerJourneyId,
  onOpenManualModal,
}: ReadinessInterviewBatteryCardProps) => {
  const navigate = useNavigate();
  const [startingSlotNumber, setStartingSlotNumber] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    data: batteryResponse,
    isLoading: isBatteryLoading,
  } = useGetReadinessBatteryQuery(careerJourneyId, {
    skip: !careerJourneyId,
  });

  const [startOfficialInterview] = useStartOfficialMockInterviewMutation();

  const battery = batteryResponse?.data;
  const slots = battery?.slots ?? [];
  const completedCount = battery?.completedCount ?? 0;
  const totalRequired = battery?.totalRequired ?? 3;
  const progressPercent = Math.round((completedCount / totalRequired) * 100);

  const handleStartOrResume = async (slot: ReadinessBatterySlot) => {
    setErrorMsg(null);
    if (slot.status === "IN_PROGRESS" && slot.sessionId) {
      navigate(`/practice/interview/${slot.sessionId}`);
      return;
    }

    try {
      setStartingSlotNumber(slot.interviewNumber);
      const res = await startOfficialInterview({
        careerJourneyId,
        interviewNumber: slot.interviewNumber,
      }).unwrap();

      const sessionId = res.data?.id;
      if (sessionId) {
        navigate(`/practice/interview/${sessionId}`);
      }
    } catch (err: unknown) {
      const maybeError = err as { data?: { message?: string } } | undefined;
      setErrorMsg(
        maybeError?.data?.message ||
          "Failed to start the official mock interview. Please try again."
      );
    } finally {
      setStartingSlotNumber(null);
    }
  };

  if (isBatteryLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-center space-x-3 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Loading official mock interview battery...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-br from-blue-50/70 via-white to-slate-50 p-6 sm:p-8 text-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
              <Sparkles className="h-3.5 w-3.5" />
              Official Milestone Assessment
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              CareerSaathi AI Mock Interview Battery
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Take 3 live, turn-based technical mock interviews directly with our AI interviewer.
              Your answers will be observed, evaluated, and automatically scored to compute your Job Readiness.
            </p>
          </div>

          <div className="flex flex-col items-start rounded-xl bg-white p-4 border border-slate-200 shadow-xs sm:items-end">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Battery Progress
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">{completedCount}</span>
              <span className="text-sm font-semibold text-slate-500">/{totalRequired}</span>
            </div>
            <span className="mt-0.5 text-xs font-medium text-blue-600">{progressPercent}% Completed</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="mx-6 mt-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:mx-8">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 3 Slots List */}
      <div className="divide-y divide-slate-100 p-6 sm:p-8">
        <div className="grid gap-4 sm:gap-6">
          {slots.map((slot) => {
            const isCompleted = slot.status === "COMPLETED";
            const isInProgress = slot.status === "IN_PROGRESS";
            const isLocked = slot.status === "LOCKED";
            const isStarting = startingSlotNumber === slot.interviewNumber;

            return (
              <div
                key={slot.interviewNumber}
                className={`group relative overflow-hidden rounded-xl border p-5 sm:p-6 transition-all duration-200 ${
                  isCompleted
                    ? "border-emerald-200 bg-emerald-50/20"
                    : isInProgress
                    ? "border-blue-300 bg-blue-50/30 ring-1 ring-blue-200"
                    : isLocked
                    ? "border-slate-200 bg-slate-50/50 opacity-75"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs"
                }`}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left info */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold shadow-xs ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isInProgress
                          ? "bg-blue-600 text-white animate-pulse"
                          : isLocked
                          ? "bg-slate-200 text-slate-500"
                          : "bg-slate-100 text-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-colors"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : isLocked ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <span>#{slot.interviewNumber}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Interview {slot.interviewNumber} of 3
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 uppercase">
                          {slot.type}
                        </span>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Completed
                          </span>
                        )}
                        {isInProgress && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                            <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                            Session Active
                          </span>
                        )}
                        {isLocked && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-200/80 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                            Locked
                          </span>
                        )}
                      </div>

                      <h3 className="mt-1 text-base sm:text-lg font-bold text-slate-900">
                        {slot.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        {slot.description}
                      </p>

                      {/* Completed Score Badges */}
                      {isCompleted && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-100/80 px-3 py-1 text-xs font-bold text-emerald-900">
                            <Award className="h-3.5 w-3.5 text-emerald-700" />
                            Overall Score: {slot.overallScore}/100
                          </div>
                          {slot.technicalScore !== null && (
                            <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs border border-slate-200">
                              Technical: {slot.technicalScore}%
                            </span>
                          )}
                          {slot.communicationScore !== null && (
                            <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs border border-slate-200">
                              Communication: {slot.communicationScore}%
                            </span>
                          )}
                        </div>
                      )}

                      {isCompleted && slot.feedback && (
                        <p className="mt-2.5 line-clamp-2 text-xs italic text-slate-500">
                          "{slot.feedback}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="flex items-center gap-3 lg:shrink-0">
                    {isCompleted ? (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Score Recorded
                      </span>
                    ) : isLocked ? (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Lock className="h-3.5 w-3.5" /> Complete prior interview
                      </span>
                    ) : (
                      <button
                        onClick={() => handleStartOrResume(slot)}
                        disabled={isStarting}
                        className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          isInProgress
                            ? "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
                            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                        }`}
                      >
                        {isStarting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Starting...
                          </>
                        ) : isInProgress ? (
                          <>
                            <RotateCcw className="h-4 w-4" />
                            Resume Interview
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 fill-current" />
                            Start Official Interview
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer fallback info */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row text-xs text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-slate-400" />
            <span>
              Each official interview consists of 3 scenario questions and 3 dynamic follow-ups (6 turns).
            </span>
          </div>

          {onOpenManualModal && (
            <button
              type="button"
              onClick={onOpenManualModal}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Or enter external interview score manually
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadinessInterviewBatteryCard;
