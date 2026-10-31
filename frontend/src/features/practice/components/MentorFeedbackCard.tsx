import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import type { CodingEvaluation } from "../types/practice.types";
import { useOptInAttemptMutation } from "../api/practiceApi";

interface MentorFeedbackCardProps {
  attemptId: string;
  evaluation: CodingEvaluation;
  initialOptedIn: boolean;
  onContinuePractice?: () => void;
}

export const MentorFeedbackCard = ({
  attemptId,
  evaluation,
  initialOptedIn,
  onContinuePractice,
}: MentorFeedbackCardProps) => {
  const [optedIn, setOptedIn] = useState<boolean>(initialOptedIn);
  const [optInMutation, { isLoading: isOptingIn }] = useOptInAttemptMutation();

  const handleToggleOptIn = async () => {
    const nextState = !optedIn;
    try {
      await optInMutation({
        attemptId,
        optIn: nextState,
      }).unwrap();
      setOptedIn(nextState);
    } catch (err) {
      console.error("Failed to update opt-in status:", err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (score >= 60) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    return "text-rose-400 bg-rose-500/10 border-rose-500/30";
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30">
        <div className="flex items-center gap-2 mb-2 text-indigo-400 font-semibold text-sm">
          <Sparkles size={16} />
          <span>Staff Engineer AI Code Review</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {evaluation.mentorFeedback}
        </p>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getScoreColor(evaluation.correctnessScore)}`}>
          <span className="text-2xl font-bold">{evaluation.correctnessScore}%</span>
          <span className="text-xs font-medium text-slate-400 mt-1">Correctness Score</span>
        </div>
        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getScoreColor(evaluation.codeQualityScore)}`}>
          <span className="text-2xl font-bold">{evaluation.codeQualityScore}%</span>
          <span className="text-xs font-medium text-slate-400 mt-1">Code Quality Score</span>
        </div>
      </div>

      {/* Observed Strengths */}
      {evaluation.observedStrengths.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 size={14} />
            <span>Observed Strengths</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {evaluation.observedStrengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Observed Struggles */}
      {evaluation.observedStruggles.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle size={14} />
            <span>Observed Growth Areas</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {evaluation.observedStruggles.map((str, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Anti-Patterns */}
      {evaluation.antiPatterns.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert size={14} />
            <span>Anti-Patterns / Edge Cases</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {evaluation.antiPatterns.map((pat, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{pat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* User Opt-In Agency Card */}
      <div className={`p-4 rounded-xl border transition-all ${
        optedIn
          ? "bg-indigo-950/30 border-indigo-500/50"
          : "bg-slate-900 border-slate-800"
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className={optedIn ? "text-indigo-400" : "text-slate-400"} />
              <h4 className="text-sm font-semibold text-slate-100">
                Include in Career Journey?
              </h4>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                optedIn
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}>
                {optedIn ? "Active in Journey" : "Zero-Stakes Practice"}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {optedIn
                ? "This session's score and feedback are staged for your active career journey. On Day 7, it will adapt your upcoming weekly mission (e.g. reinforcing struggles or confirming topic mastery)."
                : "This session is currently treated as zero-stakes practice and will not alter your roadmap or weekly sprint missions."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleOptIn}
            disabled={isOptingIn}
            className={`shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors border shadow-sm ${
              optedIn
                ? "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
            }`}
          >
            {isOptingIn ? "Updating..." : optedIn ? "Opt Out" : "Opt In to Journey"}
          </button>
        </div>
      </div>

      {onContinuePractice && (
        <button
          type="button"
          onClick={onContinuePractice}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
        >
          <span>Return to Practice Hub</span>
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
};
