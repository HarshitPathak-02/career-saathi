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
    if (!challenge || !careerJourneyId || isEvaluating) return;

    let currentTests = testResults;
    if (!currentTests) {
      setIsRunningTests(true);
      try {
        currentTests = await runTests(code, challenge.testCases);
        setTestResults(currentTests);
      } catch (err) {
        console.error("Automatic test execution before submit failed:", err);
        setIsRunningTests(false);
        return;
      }
      setIsRunningTests(false);
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
    (Boolean(careerJourneyId) && Boolean(slug) && (challengeLoading || challengeFetching));

  if (isPageLoading && !challenge) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading Coding Workspace...</p>
        </div>
      </div>
    );
  }

  if (workspaceError || (!careerJourneyId && !isPageLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-600 p-6">
        <div className="max-w-md text-center p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <AlertCircle size={36} className="text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">No Active Career Journey</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please make sure your career journey is active before attempting practice challenges.
          </p>
          <Link
            to="/workspace"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            Go to Workspace
          </Link>
        </div>
      </div>
    );
  }

  if (challengeError || !challenge) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-600 p-6">
        <div className="max-w-md text-center p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <AlertCircle size={36} className="text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Challenge Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The requested coding challenge could not be loaded or is not unlocked for your journey.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => refetchChallenge()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Return to Practice Ground</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 overflow-hidden">
      {/* Workspace Header Bar */}
      <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/practice"
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors py-1 px-2 rounded hover:bg-slate-100"
          >
            <ArrowLeft size={14} />
            <span>Practice Hub</span>
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <h1 className="text-sm font-bold text-slate-900 truncate max-w-sm">
            {challenge.title}
          </h1>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDifficultyBadge(
              challenge.difficulty
            )}`}
          >
            {challenge.difficulty}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {challenge.skill.name}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            {challenge.topic.name}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1 font-mono">
            <Clock size={13} />
            {challenge.estimatedMinutes} mins
          </span>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Pane: Problem Description / AI Feedback */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-200 bg-white overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setLeftTab("description")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                leftTab === "description"
                  ? "bg-white text-blue-700 border border-slate-200 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                  ? "bg-white text-blue-700 border border-slate-200 shadow-2xs"
                  : evaluationResult
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  : "text-slate-400 cursor-not-allowed opacity-50"
              }`}
            >
              <Sparkles size={13} />
              <span>AI Mentor Feedback</span>
              {evaluationResult && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 text-slate-700">
            {leftTab === "description" ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900 mb-2">
                    {challenge.title}
                  </h2>
                  <div className="prose prose-xs max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-sans text-xs">
                    {challenge.description}
                  </div>
                </div>

                {/* Visible Test Cases Overview */}
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={13} className="text-blue-600" />
                    <span>Test Cases ({challenge.testCases.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {challenge.testCases.map((tc, idx) => (
                      <div
                        key={tc.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                      >
                        <div className="font-semibold text-slate-900">
                          {idx + 1}. {tc.name}
                        </div>
                        {tc.explanation && (
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {tc.explanation}
                          </p>
                        )}
                        <div className="font-mono text-[11px] bg-white p-2 rounded-lg border border-slate-200 text-emerald-800">
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
