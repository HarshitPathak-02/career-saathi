import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  Clock,
  CheckCircle2,
  Search,
  ArrowRight,
  Zap,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { useGetWorkspaceQuery } from "../../workspace/api/workspaceApi";
import { useGetPracticeHubQuery } from "../api/practiceApi";
import type { ChallengeDifficulty } from "../types/practice.types";

export const PracticeHubPage = () => {
  const {
    data: workspaceResponse,
    isLoading: workspaceLoading,
    isFetching: workspaceFetching,
    isError: workspaceError,
    refetch: refetchWorkspace,
  } = useGetWorkspaceQuery();
  const careerJourneyId = workspaceResponse?.data?.careerJourney?.id ?? "";

  const {
    data: hubResponse,
    isLoading: hubLoading,
    isFetching: hubFetching,
    isError: hubError,
    refetch: refetchHub,
  } = useGetPracticeHubQuery(careerJourneyId, {
    skip: !careerJourneyId,
  });

  const hubData = hubResponse?.data;

  const [selectedSkillId, setSelectedSkillId] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const challenges = hubData?.challenges ?? [];
  const filteredChallenges = challenges.filter((c) => {
    if (selectedSkillId !== "ALL" && c.skillCatalogId !== selectedSkillId) {
      return false;
    }
    if (selectedDifficulty !== "ALL" && c.difficulty !== selectedDifficulty) {
      return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (!c.title.toLowerCase().includes(query)) {
        return false;
      }
    }
    return true;
  });

  const recentAttemptsMap = new Map<string, { status: string; passed: boolean; optedIn: boolean }>();
  if (hubData?.recentAttempts) {
    for (const attempt of hubData.recentAttempts) {
      if (!recentAttemptsMap.has(attempt.challengeId)) {
        recentAttemptsMap.set(attempt.challengeId, {
          status: attempt.status,
          passed: (attempt.correctnessScore ?? 0) >= 70,
          optedIn: attempt.optedInToJourney,
        });
      }
    }
  }

  const getDifficultyBadge = (difficulty: ChallengeDifficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "MEDIUM":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "HARD":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const isPageLoading =
    workspaceLoading ||
    workspaceFetching ||
    (Boolean(careerJourneyId) && (hubLoading || hubFetching));

  if (isPageLoading && !hubData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading Practice Ground...</p>
        </div>
      </div>
    );
  }

  if (workspaceError || (!careerJourneyId && !isPageLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300 p-6">
        <div className="max-w-md text-center p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <AlertCircle size={36} className="text-amber-400 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              No Active Career Journey
            </h3>
            <p className="text-xs text-slate-400">
              Please setup or activate your career journey first so we can tailor practice challenges directly to your roadmap.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => refetchWorkspace()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
            <Link
              to="/workspace"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Go to Workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (hubError || !hubData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300 p-6">
        <div className="max-w-md text-center p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <AlertCircle size={36} className="text-rose-400 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              Could Not Load Practice Challenges
            </h3>
            <p className="text-xs text-slate-400">
              There was an issue loading the practice ground. Please try again.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => refetchHub()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
            <Link
              to="/workspace"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Go to Workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-8 space-y-8">
      {/* Hero / Philosophy Banner */}
      <div className="p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <Code2 size={14} />
              <span>Observational Coding Ground</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Practice Workspace & Code Lab
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Solve real engineering challenges scoped directly to your career journey. By default, sessions are zero-stakes practice. You can optionally include your performance to adapt upcoming weekly missions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xl font-bold text-indigo-400">
                {hubData.skills.length}
              </span>
              <span className="block text-[11px] text-slate-400 mt-0.5">
                Journey Skills
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xl font-bold text-emerald-400">
                {hubData.challenges.length}
              </span>
              <span className="block text-[11px] text-slate-400 mt-0.5">
                Challenges Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Weak Focus Areas */}
      {hubData.recommendedTopics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Zap size={14} />
            <span>Recommended Focus Topics (Based on Recent Performance)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {hubData.recommendedTopics.map((topic) => (
              <div
                key={topic.topicId}
                className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-100">
                    {topic.name}
                  </h4>
                  <span className="text-[11px] text-amber-400 font-medium">
                    Mastery: {topic.masteryScore}%
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
                  Needs Practice
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Skill Filter */}
          <button
            type="button"
            onClick={() => setSelectedSkillId("ALL")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedSkillId === "ALL"
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            All Skills ({hubData.challenges.length})
          </button>
          {hubData.skills.map((skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => setSelectedSkillId(skill.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedSkillId === skill.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {skill.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            aria-label="Filter by challenge difficulty"
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-800 text-slate-300 rounded-lg border border-slate-700 outline-none"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          {/* Search box */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-800 text-slate-200 placeholder-slate-500 rounded-lg border border-slate-700 outline-none w-48 focus:w-60 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredChallenges.length} challenges</span>
        </div>

        {filteredChallenges.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-sm text-slate-400">
              No challenges match your selected filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.map((challenge) => {
              const attempt = recentAttemptsMap.get(challenge.id);
              const skillName =
                hubData.skills.find((s) => s.id === challenge.skillCatalogId)
                  ?.name ?? "Skill";

              return (
                <div
                  key={challenge.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDifficultyBadge(
                          challenge.difficulty
                        )}`}
                      >
                        {challenge.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                        <Clock size={12} />
                        {challenge.estimatedMinutes}m
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {challenge.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                          {skillName}
                        </span>
                        {attempt && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              attempt.passed
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            <CheckCircle2 size={10} />
                            {attempt.passed ? "Solved" : "Attempted"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {attempt?.optedIn ? "Staged in Journey" : "Zero-Stakes"}
                    </span>
                    <Link
                      to={`/practice/coding/${challenge.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
                    >
                      <span>{attempt ? "Review Code" : "Solve Challenge"}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Practice Activity Section */}
      {hubData.recentAttempts.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-800">
          <h2 className="text-sm font-bold text-slate-200">
            Recent Practice Submissions
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Challenge</th>
                  <th className="py-3 px-4">Correctness</th>
                  <th className="py-3 px-4">Code Quality</th>
                  <th className="py-3 px-4">Journey Status</th>
                  <th className="py-3 px-4">Evaluated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {hubData.recentAttempts.map((attempt) => {
                  const challenge = hubData.challenges.find(
                    (c) => c.id === attempt.challengeId
                  );
                  return (
                    <tr key={attempt.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-semibold text-white">
                        {challenge ? (
                          <Link
                            to={`/practice/coding/${challenge.slug}`}
                            className="hover:text-indigo-400 transition-colors"
                          >
                            {challenge.title}
                          </Link>
                        ) : (
                          "Practice Challenge"
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-emerald-400">
                          {attempt.correctnessScore ?? "-"}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-indigo-400">
                          {attempt.codeQualityScore ?? "-"}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            attempt.optedInToJourney
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {attempt.optedInToJourney ? "Included in Journey" : "Zero-Stakes"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {attempt.evaluatedAt
                          ? new Date(attempt.evaluatedAt).toLocaleDateString()
                          : "Pending"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default PracticeHubPage;
