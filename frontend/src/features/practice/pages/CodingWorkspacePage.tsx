import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  FileText,
  Sparkles,
  Layers,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { useGetWorkspaceQuery } from "../../workspace/api/workspaceApi";
import {
  useGetChallengeQuery,
  useEvaluateChallengeMutation,
} from "../api/practiceApi";
import { runTests } from "../utils/codeRunner";
import { CodingEditorPane } from "../components/CodingEditorPane";
import { TestResultsPane } from "../components/TestResultsPane";
import { MentorFeedbackCard } from "../components/MentorFeedbackCard";
import type {
  ChallengeDifficulty,
  EvaluateChallengeResponse,
  TestSuiteResult,
} from "../types/practice.types";

export const CodingWorkspacePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const {
    data: workspaceResponse,
    isLoading: workspaceLoading,
    isFetching: workspaceFetching,
    isError: workspaceError,
  } = useGetWorkspaceQuery();
  const careerJourneyId = workspaceResponse?.data?.careerJourney?.id ?? "";

  const {
    data: challengeResponse,
    isLoading: challengeLoading,
    isFetching: challengeFetching,
    isError: challengeError,
    refetch: refetchChallenge,
  } = useGetChallengeQuery(
    { slug: slug ?? "", careerJourneyId },
    { skip: !careerJourneyId || !slug }
  );

  const [evaluateChallenge, { isLoading: isEvaluating }] =
    useEvaluateChallengeMutation();

  const challenge = challengeResponse?.data;

  const [userEditedCode, setUserEditedCode] = useState<string | null>(null);
  const code =
    userEditedCode ??
    challenge?.latestAttempt?.submittedCode ??
    challenge?.starterCode ??
    "";

  const [leftTab, setLeftTab] = useState<"description" | "feedback">("description");
  const [testResults, setTestResults] = useState<TestSuiteResult | null>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [runCount, setRunCount] = useState<number>(0);
  const [submittedEvaluation, setSubmittedEvaluation] =
    useState<EvaluateChallengeResponse | null>(null);

  const evaluationResult =
    submittedEvaluation ??
    (challenge?.latestAttempt?.evaluation
      ? {
          attemptId: challenge.latestAttempt.id,
          challengeSlug: challenge.slug,
          evaluation: challenge.latestAttempt.evaluation,
          optedInToJourney: challenge.latestAttempt.optedInToJourney,
          evaluatedAt: challenge.latestAttempt.evaluatedAt ?? "",
        }
      : null);

  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [slug]);

  const handleRunTests = async () => {
    if (!challenge) return;
    setIsRunningTests(true);
    setRunCount((prev) => prev + 1);

    try {
      const results = await runTests(code, challenge.testCases);
      setTestResults(results);
    } catch (err) {
      console.error("Test execution failed:", err);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleSubmit = async () => {
    if (!challenge || !careerJourneyId) return;

    // Run tests if not already run
    let currentTests = testResults;
    if (!currentTests) {
      setIsRunningTests(true);
      try {
        currentTests = await runTests(code, challenge.testCases);
        setTestResults(currentTests);
      } finally {
        setIsRunningTests(false);
      }
    }

    const durationSeconds = Math.max(
      1,
      Math.round((Date.now() - (startTimeRef.current || Date.now())) / 1000)
    );

    try {
      const response = await evaluateChallenge({
        slug: challenge.slug,
        body: {
          careerJourneyId,
          submittedCode: code,
          testResults: {
            total: currentTests.total,
            passed: currentTests.passed,
            failed: currentTests.failed,
            executionTimeMs: currentTests.executionTimeMs,
          },
          durationSeconds,
          runCount: Math.max(1, runCount),
        },
      }).unwrap();

      setSubmittedEvaluation(response.data);
      setLeftTab("feedback");
    } catch (err) {
      console.error("Evaluation submission failed:", err);
    }
  };

  const handleReset = () => {
    if (challenge) {
      setUserEditedCode(challenge.starterCode);
      setTestResults(null);
    }
  };

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
    (Boolean(careerJourneyId) && Boolean(slug) && (challengeLoading || challengeFetching));

  if (isPageLoading && !challenge) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading Coding Workspace...</p>
        </div>
      </div>
    );
  }

  if (workspaceError || (!careerJourneyId && !isPageLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300 p-6">
        <div className="max-w-md text-center p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <AlertCircle size={36} className="text-amber-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">No Active Career Journey</h2>
          <p className="text-xs text-slate-400 mb-6">
            Please make sure your career journey is active before attempting practice challenges.
          </p>
          <Link
            to="/workspace"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            Go to Workspace
          </Link>
        </div>
      </div>
    );
  }

  if (challengeError || !challenge) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300 p-6">
        <div className="max-w-md text-center p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <AlertCircle size={36} className="text-rose-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">Challenge Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">
            The requested coding challenge could not be loaded or is not unlocked for your journey.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => refetchChallenge()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={14} />
              Return to Practice Ground
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Workspace Header Bar */}
      <header className="flex items-center justify-between px-5 py-3 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/practice"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 px-2 rounded hover:bg-slate-850"
          >
            <ArrowLeft size={14} />
            <span>Practice Hub</span>
          </Link>
          <ChevronRight size={14} className="text-slate-600" />
          <h1 className="text-sm font-bold text-white truncate max-w-sm">
            {challenge.title}
          </h1>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDifficultyBadge(
              challenge.difficulty
            )}`}
          >
            {challenge.difficulty}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {challenge.skill.name}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-800">
            {challenge.topic.name}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {challenge.estimatedMinutes} mins
          </span>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Pane: Problem Description / AI Feedback */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-800 bg-slate-950 overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-950/80">
            <button
              type="button"
              onClick={() => setLeftTab("description")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                leftTab === "description"
                  ? "bg-slate-850 text-indigo-400 border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText size={13} />
              <span>Problem Description</span>
            </button>
            <button
              type="button"
              onClick={() => setLeftTab("feedback")}
              disabled={!evaluationResult}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                leftTab === "feedback"
                  ? "bg-slate-850 text-indigo-400 border border-slate-700"
                  : evaluationResult
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-600 cursor-not-allowed opacity-50"
              }`}
            >
              <Sparkles size={13} />
              <span>AI Mentor Feedback</span>
              {evaluationResult && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 text-slate-300">
            {leftTab === "description" ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white mb-2">
                    {challenge.title}
                  </h2>
                  <div className="prose prose-invert prose-xs max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap font-sans text-xs">
                    {challenge.description}
                  </div>
                </div>

                {/* Visible Test Cases Overview */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={13} />
                    <span>Test Cases ({challenge.testCases.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {challenge.testCases.map((tc, idx) => (
                      <div
                        key={tc.id}
                        className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5"
                      >
                        <div className="font-semibold text-slate-200">
                          {idx + 1}. {tc.name}
                        </div>
                        {tc.explanation && (
                          <p className="text-[11px] text-slate-400">
                            {tc.explanation}
                          </p>
                        )}
                        <div className="font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-850 text-emerald-300">
                          Expected Output: {tc.expectedOutput}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : evaluationResult ? (
              <MentorFeedbackCard
                attemptId={evaluationResult.attemptId}
                evaluation={evaluationResult.evaluation}
                initialOptedIn={evaluationResult.optedInToJourney}
                onContinuePractice={() => navigate("/practice")}
              />
            ) : null}
          </div>
        </div>

        {/* Right Pane: Editor (top) + Test Results (bottom) */}
        <div className="w-full lg:w-1/2 flex flex-col h-full overflow-hidden">
          <div className="flex-1 min-h-[350px]">
            <CodingEditorPane
              code={code}
              onChange={setUserEditedCode}
              onRunTests={handleRunTests}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isRunning={isRunningTests}
              isSubmitting={isEvaluating}
              hasRunTests={testResults !== null}
            />
          </div>
          <div className="h-[260px] shrink-0">
            <TestResultsPane
              testSuiteResult={testResults}
              isRunning={isRunningTests}
              onRunTests={handleRunTests}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CodingWorkspacePage;
