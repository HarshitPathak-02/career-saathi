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
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80">
        <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold text-sm">
          <Sparkles size={16} />
          <span>Staff Engineer AI Code Review</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          {evaluation.mentorFeedback}
        </p>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center shadow-xs ${getScoreColor(evaluation.correctnessScore)}`}>
          <span className="text-2xl font-bold font-mono">{evaluation.correctnessScore}%</span>
          <span className="text-xs font-medium text-slate-600 mt-1">Correctness Score</span>
        </div>
        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center shadow-xs ${getScoreColor(evaluation.codeQualityScore)}`}>
          <span className="text-2xl font-bold font-mono">{evaluation.codeQualityScore}%</span>
          <span className="text-xs font-medium text-slate-600 mt-1">Code Quality Score</span>
        </div>
      </div>

      {/* Observed Strengths */}
      {evaluation.observedStrengths.length > 0 && (
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>Observed Strengths</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {evaluation.observedStrengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Observed Struggles */}
      {evaluation.observedStruggles.length > 0 && (
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle size={14} className="text-amber-500" />
            <span>Observed Growth Areas</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {evaluation.observedStruggles.map((str, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Anti-Patterns */}
      {evaluation.antiPatterns.length > 0 && (
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert size={14} className="text-rose-500" />
            <span>Anti-Patterns / Edge Cases</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {evaluation.antiPatterns.map((pat, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{pat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* User Opt-In Agency Card */}
      <div className={`p-4 rounded-xl border transition-all ${
        optedIn
          ? "bg-blue-50/60 border-blue-200"
          : "bg-slate-50 border-slate-200"
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className={optedIn ? "text-blue-600" : "text-slate-400"} />
              <h4 className="text-sm font-semibold text-slate-900">
                Include in Career Journey?
              </h4>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                optedIn
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-slate-200 text-slate-700"
              }`}>
                {optedIn ? "Active in Journey" : "Zero-Stakes Practice"}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {optedIn
                ? "This session's score and feedback are staged for your active career journey. On Day 7, it will adapt your upcoming weekly mission (e.g. reinforcing struggles or confirming topic mastery)."
                : "This session is currently treated as zero-stakes practice and will not alter your roadmap or weekly sprint missions."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleOptIn}
            disabled={isOptingIn}
            className={`shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors border shadow-xs ${
              optedIn
                ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
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
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
        >
          <span>Return to Practice Hub</span>
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
};
