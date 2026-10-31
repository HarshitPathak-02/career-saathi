import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { useOptInInterviewMutation } from "../api/practiceApi";
import type { InterviewEvaluation } from "../types/practice.types";

interface InterviewDiagnosticCardProps {
  sessionId: string;
  skillName: string;
  evaluation: InterviewEvaluation;
  initialOptedIn: boolean;
  isOfficialReadinessMock?: boolean;
  mockInterviewNumber?: number | null;
}

export const InterviewDiagnosticCard = ({
  sessionId,
  skillName,
  evaluation,
  initialOptedIn,
  isOfficialReadinessMock = false,
  mockInterviewNumber,
}: InterviewDiagnosticCardProps) => {
  const [optedIn, setOptedIn] = useState<boolean>(initialOptedIn);
  const [optInMutation, { isLoading: isUpdatingOptIn }] =
    useOptInInterviewMutation();

  const handleToggleOptIn = async (newVal: boolean) => {
    try {
      await optInMutation({ sessionId, optIn: newVal }).unwrap();
      setOptedIn(newVal);
    } catch (err) {
      console.error("Failed to update interview opt-in status:", err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 60) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 lg:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
            <Award size={14} />
            <span>
              {isOfficialReadinessMock
                ? `Official Mock Interview ${mockInterviewNumber ? `#${mockInterviewNumber}` : ""} Completed`
                : "Interview Drill Completed"}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">
            {skillName} {isOfficialReadinessMock ? "Official Diagnosis" : "Technical Screen Diagnosis"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Evaluated by Staff Engineer AI Mentor across 3 technical scenarios & follow-ups.
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center gap-4 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 shrink-0">
          <div className="text-right">
            <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Overall Score
            </span>
            <span className="text-2xl font-black text-white font-mono">
              {evaluation.overallScore}%
            </span>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border ${getScoreColor(
              evaluation.overallScore
            )}`}
          >
            {evaluation.overallScore >= 70 ? (
              <CheckCircle2 size={24} />
            ) : (
              <AlertTriangle size={24} />
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Conceptual Depth
            </span>
            <span className="text-lg font-bold text-white mt-0.5 block">
              {evaluation.conceptualDepthScore}%
            </span>
            <span className="text-[11px] text-slate-500">
              Foundational mechanics & edge cases
            </span>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getScoreColor(
              evaluation.conceptualDepthScore
            )}`}
          >
            {evaluation.conceptualDepthScore >= 70 ? "Strong Depth" : "Needs Study"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Communication & Structure
            </span>
            <span className="text-lg font-bold text-white mt-0.5 block">
              {evaluation.communicationScore}%
            </span>
            <span className="text-[11px] text-slate-500">
              Logical articulation & clarity
            </span>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getScoreColor(
              evaluation.communicationScore
            )}`}
          >
            {evaluation.communicationScore >= 70 ? "Clear & Articulate" : "Developing"}
          </span>
        </div>
      </div>

      {/* Mentor Feedback Card */}
      <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={15} />
          <span>Staff Engineer Feedback</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {evaluation.mentorFeedback}
        </p>
      </div>

      {/* Observations: Strengths & Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Strengths */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 size={14} />
            <span>Observed Strengths</span>
          </div>
          {evaluation.observedStrengths.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No specific strengths logged.</p>
          ) : (
            <ul className="space-y-2">
              {evaluation.observedStrengths.map((str, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-300 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Gaps & Misconceptions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Zap size={14} />
            <span>Knowledge Gaps & Misconceptions</span>
          </div>
          {evaluation.observedGaps.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No significant gaps detected.</p>
          ) : (
            <ul className="space-y-2">
              {evaluation.observedGaps.map((gap, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-300 bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-xl"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Anti-Patterns (if any) */}
      {evaluation.antiPatterns && evaluation.antiPatterns.length > 0 && (
        <div className="space-y-2 p-4 rounded-xl bg-rose-500/5 border border-rose-500/15">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Flame size={14} />
            <span>Anti-Patterns Detected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {evaluation.antiPatterns.map((ap, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20"
              >
                {ap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Career Journey Opt-In Box */}
      {isOfficialReadinessMock ? (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-emerald-200 text-xs">
          <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
          <span>
            This official milestone interview has been recorded into your Job Readiness portfolio (Slot {mockInterviewNumber}/3).
          </span>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck size={16} className="text-indigo-400" />
                <span>Include this performance in your Career Journey?</span>
              </div>
              <p className="text-[11px] text-slate-400 max-w-xl">
                By default, this interview session is zero-stakes. When included, weak topic scores (&lt;70%) will automatically adapt your upcoming Day 7 weekly missions with focused revision tasks.
              </p>
            </div>

            <button
              type="button"
              disabled={isUpdatingOptIn}
              onClick={() => handleToggleOptIn(!optedIn)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 shadow-sm ${
                optedIn
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  optedIn ? "bg-white animate-pulse" : "bg-slate-500"
                }`}
              />
              <span>{optedIn ? "Included in Journey" : "Include in Journey"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Return to Hub */}
      <div className="pt-4 flex justify-end">
        <Link
          to={isOfficialReadinessMock ? "/readiness" : "/practice"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
        >
          <span>
            {isOfficialReadinessMock
              ? "Return to Job Readiness Battery"
              : "Return to Practice Ground"}
          </span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
