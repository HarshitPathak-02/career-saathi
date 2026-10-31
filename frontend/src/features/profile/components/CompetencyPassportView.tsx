import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Zap,
  TrendingUp,
  AlertCircle,
  FileText,
  Code2,
  Mic,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type {
  CompetencyPassportResponse,
  CompetencyPassportSkill,
} from "../types/profile.types";
import { EmptyState } from "../../../components/ui/EmptyState";
import { SkeletonCard, SkeletonText } from "../../../components/ui/Skeleton";

interface Props {
  passport?: CompetencyPassportResponse;
  isLoading: boolean;
}

export const CompetencyPassportView: React.FC<Props> = ({ passport, isLoading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <SkeletonText lines={4} />
        </div>
      </div>
    );
  }

  if (!passport || passport.skills.length === 0) {
    return (
      <EmptyState
        icon={Award}
        title="No Competency Evidence Yet"
        description="Your skills and competencies will be recorded here as you take mock interviews, solve coding challenges, and complete missions."
        primaryAction={{
          label: "Go to Practice Ground",
          to: "/practice",
          icon: Zap,
        }}
      />
    );
  }

  const { summary, categories, skills, topStrengths, areasForGrowth } = passport;

  const filteredSkills =
    selectedCategory === "ALL"
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case "EXPERT":
      case "ADVANCED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "INTERMEDIATE":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "BASIC":
      case "BEGINNER":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-emerald-500";
    if (score >= 40) return "bg-blue-500";
    if (score > 0) return "bg-amber-500";
    return "bg-slate-200";
  };

  return (
    <div className="space-y-6">
      {/* 4 Summary Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Skills Tracked
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {summary.totalSkills}
            </span>
            <span className="text-xs text-slate-500">catalog competencies</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Mastered (≥70%)
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-emerald-600">
              {summary.masteredCount}
            </span>
            <span className="text-xs text-slate-500">
              {summary.totalSkills > 0
                ? `${Math.round((summary.masteredCount / summary.totalSkills) * 100)}% of role`
                : "0%"}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            In Progress
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-blue-600">
              {summary.inProgressCount}
            </span>
            <span className="text-xs text-slate-500">actively developing</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
            Average Mastery
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-purple-600">
              {summary.averageScore}%
            </span>
            <span className="text-xs text-slate-500">overall journey score</span>
          </div>
        </div>
      </div>

      {/* Strengths & Growth Areas Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Strengths */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
          <div className="flex items-center gap-2 text-emerald-800">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h4 className="font-semibold text-sm">Key Strengths</h4>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {topStrengths.length > 0 ? (
              topStrengths.map((s) => (
                <span
                  key={s.skillCatalogId}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs"
                >
                  <Sparkles className="h-3 w-3 text-emerald-500" />
                  {s.name} ({s.currentScore}%)
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500">
                Complete practice drills or missions to uncover strengths.
              </p>
            )}
          </div>
        </div>

        {/* Areas for Growth */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <h4 className="font-semibold text-sm">Focus Growth Areas</h4>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {areasForGrowth.length > 0 ? (
              areasForGrowth.map((s) => (
                <span
                  key={s.skillCatalogId}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-white px-3 py-1 text-xs font-medium text-amber-900 shadow-2xs"
                >
                  {s.name} ({s.currentScore > 0 ? `${s.currentScore}%` : "Not started"})
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500">
                All tracked skills have reached foundational proficiency!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory("ALL")}
          className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-medium transition ${
            selectedCategory === "ALL"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All Skills ({skills.length})
        </button>
        {categories.map((cat) => {
          const count = skills.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-medium transition ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.replace(/_/g, " ")} ({count})
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSkills.map((skill: CompetencyPassportSkill) => (
          <div
            key={skill.skillCatalogId}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-semibold text-slate-900 text-sm">{skill.name}</h5>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">
                    {skill.category.replace(/_/g, " ")}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-lg border px-2 py-0.5 text-[10px] font-semibold ${getLevelBadgeClass(
                    skill.currentLevel
                  )}`}
                >
                  {skill.currentLevel.replace(/_/g, " ")}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium">Mastery Score</span>
                  <span className="font-bold text-slate-900">{skill.currentScore}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full transition-all duration-500 ${getScoreColor(
                      skill.currentScore
                    )}`}
                    style={{ width: `${Math.max(skill.currentScore, 4)}%` }}
                  />
                </div>
              </div>

              {skill.description && (
                <p className="mt-3 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                  {skill.description}
                </p>
              )}

              {/* Evidence sources */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
                <span className="text-[10px] text-slate-400 font-medium">Evidence:</span>
                {skill.evidenceCount === 0 ? (
                  <span className="text-[10px] text-slate-400 italic">None yet</span>
                ) : (
                  skill.evidenceSources.map((source, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                    >
                      {source === "MOCK_INTERVIEW" && <Mic className="h-2.5 w-2.5 text-blue-500" />}
                      {source === "CODING_PRACTICE" && <Code2 className="h-2.5 w-2.5 text-purple-500" />}
                      {source === "RESUME" && <FileText className="h-2.5 w-2.5 text-emerald-500" />}
                      {source === "ASSESSMENT" && <Award className="h-2.5 w-2.5 text-amber-500" />}
                      {source.replace(/_/g, " ")}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[11px] text-slate-400">
                {skill.evidenceCount} observation{skill.evidenceCount === 1 ? "" : "s"}
              </span>
              <Link
                to="/practice"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Practice
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetencyPassportView;
