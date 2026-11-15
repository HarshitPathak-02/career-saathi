import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Code2,
  Clock,
  CheckCircle2,
  Search,
  ArrowRight,
  ArrowLeft,
  Zap,
  AlertCircle,
  RefreshCw,
  MessageSquareText,
  Mic,
} from "lucide-react";

import { useGetWorkspaceQuery } from "../../workspace/api/workspaceApi";
import {
  useGetPracticeHubQuery,
  useStartInterviewMutation,
} from "../api/practiceApi";
import type { ChallengeDifficulty } from "../types/practice.types";

export const PracticeHubPage = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<"CODING" | "INTERVIEW">("CODING");
  const [startingSkillId, setStartingSkillId] = useState<string | null>(null);
  const [interviewSearch, setInterviewSearch] = useState<string>("");

  const [startInterview] = useStartInterviewMutation();

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

  const handleStartInterview = async (skillCatalogId: string) => {
    if (!careerJourneyId || startingSkillId) return;
    setStartingSkillId(skillCatalogId);
    try {
      const res = await startInterview({
        careerJourneyId,
        skillCatalogId,
      }).unwrap();
      navigate(`/practice/interview/${res.data.id}`);
    } catch (err) {
      console.error("Failed to start technical interview session:", err);
    } finally {
      setStartingSkillId(null);
    }
  };

  const getDifficultyBadge = (difficulty: ChallengeDifficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "HARD":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const isPageLoading =
    workspaceLoading ||
    workspaceFetching ||
    (Boolean(careerJourneyId) && (hubLoading || hubFetching));

  if (isPageLoading && !hubData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading Practice Ground...</p>
        </div>
      </div>
    );
  }

  if (workspaceError || (!careerJourneyId && !isPageLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-600 p-6">
        <div className="max-w-md text-center p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <AlertCircle size={36} className="text-amber-500 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No Active Career Journey
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Please setup or activate your career journey first so we can tailor practice challenges directly to your roadmap.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => refetchWorkspace()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
            <Link
              to="/workspace"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
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
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-600 p-6">
        <div className="max-w-md text-center p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <AlertCircle size={36} className="text-rose-500 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Could Not Load Practice Challenges
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              There was an issue loading the practice ground. Please try again.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => refetchHub()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
            <Link
              to="/workspace"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Go to Workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 lg:p-8 space-y-8">
      {/* Top Hub Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/workspace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>Back to Workspace</span>
        </Link>
      </div>

      {/* Practice Workspace Mode Switcher */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-white border border-slate-200 shadow-sm w-fit">
        <button
          type="button"
          onClick={() => setActiveMode("CODING")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeMode === "CODING"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Code2 size={14} />
          <span>Coding Lab & Challenges</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode("INTERVIEW")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeMode === "INTERVIEW"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <MessageSquareText size={14} />
          <span>Technical Interview Drills</span>
        </button>
      </div>

      {activeMode === "CODING" ? (
        <>
          {/* Coding Hero / Philosophy Banner */}
          <div className="p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-blue-50/60 via-white to-slate-50 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                  <Code2 size={14} />
                  <span>Observational Coding Ground</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                  Practice Workspace & Code Lab
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Solve real engineering challenges scoped directly to your career journey. By default, sessions are zero-stakes practice. You can optionally include your performance to adapt upcoming weekly missions.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                  <span className="text-2xl font-bold text-blue-600">
                    {hubData.skills.length}
                  </span>
                  <span className="block text-xs font-medium text-slate-500 mt-0.5">
                    Journey Skills
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                  <span className="text-2xl font-bold text-emerald-600">
                    {hubData.challenges.length}
                  </span>
                  <span className="block text-xs font-medium text-slate-500 mt-0.5">
                    Challenges Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Weak Focus Areas */}
          {hubData.recommendedTopics.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
                <Zap size={14} className="text-amber-500" />
                <span>Recommended Focus Topics (Based on Recent Performance)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {hubData.recommendedTopics.map((topic) => (
                  <div
                    key={topic.topicId}
                    className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {topic.name}
                      </h4>
                      <span className="text-[11px] text-amber-700 font-medium">
                        Mastery: {topic.masteryScore}%
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                      Needs Practice
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Skill Filter */}
              <button
                type="button"
                onClick={() => setSelectedSkillId("ALL")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  selectedSkillId === "ALL"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
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
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
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
                className="px-3 py-1.5 text-xs font-medium bg-slate-50 text-slate-700 rounded-lg border border-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 outline-none w-48 focus:w-60 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Challenges Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredChallenges.length} challenges</span>
            </div>

            {filteredChallenges.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
                <p className="text-sm text-slate-500">
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
                      className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group shadow-sm"
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
                          <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                            <Clock size={12} />
                            {challenge.estimatedMinutes}m
                          </span>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {challenge.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {skillName}
                            </span>
                            {attempt && (
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                  attempt.passed
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                <CheckCircle2 size={10} />
                                {attempt.passed ? "Solved" : "Attempted"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {attempt?.optedIn ? "Staged in Journey" : "Zero-Stakes"}
                        </span>
                        <Link
                          to={`/practice/coding/${challenge.slug}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
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

          {/* Recent Coding Practice Activity Section */}
          {hubData.recentAttempts.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">
                Recent Practice Submissions
              </h2>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Challenge</th>
                      <th className="py-3 px-4">Correctness</th>
                      <th className="py-3 px-4">Code Quality</th>
                      <th className="py-3 px-4">Journey Status</th>
                      <th className="py-3 px-4">Evaluated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {hubData.recentAttempts.map((attempt) => {
                      const challenge = hubData.challenges.find(
                        (c) => c.id === attempt.challengeId
                      );
                      return (
                        <tr key={attempt.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {challenge ? (
                              <Link
                                to={`/practice/coding/${challenge.slug}`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {challenge.title}
                              </Link>
                            ) : (
                              "Practice Challenge"
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-emerald-600">
                              {attempt.correctnessScore ?? "-"}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-blue-600">
                              {attempt.codeQualityScore ?? "-"}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                attempt.optedInToJourney
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-slate-100 text-slate-600"
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
        </>
      ) : (
        /* ==================== TECHNICAL INTERVIEW MODE ==================== */
        <div className="space-y-8">
          {/* Interview Hero Banner */}
          <div className="p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-blue-50/60 via-white to-slate-50 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                  <Mic size={14} />
                  <span>Observational Technical Screens</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                  Technical Interview Workspace
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Practice articulating architectural decisions, debugging mechanics, and production trade-offs under questioning. Pick any single roadmap skill to begin a 10–15 minute drill (3 scenarios + 1 pointed follow-up each).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                  <span className="text-2xl font-bold text-blue-600">
                    {hubData.skills.length}
                  </span>
                  <span className="block text-xs font-medium text-slate-500 mt-0.5">
                    Skills Ready
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                  <span className="text-2xl font-bold text-emerald-600">
                    {hubData.recentInterviews?.filter((i) => i.status === "COMPLETED").length ?? 0}
                  </span>
                  <span className="block text-xs font-medium text-slate-500 mt-0.5">
                    Drills Done
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Selector Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Select a Journey Skill to Interview On
                </h2>
                <p className="text-xs text-slate-500">
                  Each drill simulates a live technical screen focused strictly on the selected skill.
                </p>
              </div>

              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Filter skills..."
                  value={interviewSearch}
                  onChange={(e) => setInterviewSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 outline-none w-48 focus:w-60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hubData.skills
                .filter((s) => {
                  if (!interviewSearch.trim()) return true;
                  return s.name.toLowerCase().includes(interviewSearch.toLowerCase());
                })
                .map((skill) => {
                  const isLaunching = startingSkillId === skill.id;

                  return (
                    <div
                      key={skill.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group shadow-sm"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {skill.category || "Engineering"}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                            <Clock size={12} />
                            10–15m
                          </span>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {skill.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            3 production scenario questions + dynamic edge-case follow-ups.
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <Mic size={11} className="text-slate-400" /> Voice or Text
                        </span>
                        <button
                          type="button"
                          disabled={Boolean(startingSkillId)}
                          onClick={() => handleStartInterview(skill.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-xs"
                        >
                          {isLaunching ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Starting...</span>
                            </>
                          ) : (
                            <>
                              <span>Start Drill</span>
                              <ArrowRight size={13} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Recent Technical Interviews Activity Section */}
          {hubData.recentInterviews && hubData.recentInterviews.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">
                Recent Technical Interview Sessions
              </h2>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Skill Drill</th>
                      <th className="py-3 px-4">Overall Score</th>
                      <th className="py-3 px-4">Depth</th>
                      <th className="py-3 px-4">Communication</th>
                      <th className="py-3 px-4">Journey Status</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {hubData.recentInterviews.map((session) => (
                      <tr key={session.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          <Link
                            to={`/practice/interview/${session.id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {session.skillName} Drill
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-blue-600">
                            {session.overallScore !== null ? `${session.overallScore}%` : "-"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-emerald-600">
                            {session.conceptualDepthScore !== null
                              ? `${session.conceptualDepthScore}%`
                              : "-"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-blue-600">
                            {session.communicationScore !== null
                              ? `${session.communicationScore}%`
                              : "-"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              session.optedInToJourney
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {session.optedInToJourney ? "Included in Journey" : "Zero-Stakes"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            to={`/practice/interview/${session.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <span>{session.status === "COMPLETED" ? "Review Diagnosis" : "Resume Drill"}</span>
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeHubPage;
