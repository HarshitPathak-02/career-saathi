import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  User,
  Mic,
  MicOff,
  Send,
  Sparkles,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Clock,
} from "lucide-react";

import { useGetWorkspaceQuery } from "../../workspace/api/workspaceApi";
import {
  useGetInterviewQuery,
  useSubmitInterviewAnswerMutation,
} from "../api/practiceApi";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { InterviewDiagnosticCard } from "../components/InterviewDiagnosticCard";

export const InterviewWorkspacePage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const {
    data: workspaceResponse,
    isLoading: workspaceLoading,
    isFetching: workspaceFetching,
    isError: workspaceError,
  } = useGetWorkspaceQuery();
  const careerJourneyId = workspaceResponse?.data?.careerJourney?.id ?? "";

  const {
    data: sessionResponse,
    isLoading: sessionLoading,
    isFetching: sessionFetching,
    isError: sessionError,
    refetch: refetchSession,
  } = useGetInterviewQuery(
    { sessionId: sessionId ?? "", careerJourneyId },
    { skip: !sessionId || !careerJourneyId }
  );

  const [submitAnswer, { isLoading: isSubmitting }] =
    useSubmitInterviewAnswerMutation();

  const session = sessionResponse?.data;
  const [candidateText, setCandidateText] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to latest turn
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.turns.length, isSubmitting]);

  // Voice dictation hook
  const handleTranscript = (chunk: string) => {
    setCandidateText((prev) => (prev ? `${prev} ${chunk}` : chunk));
  };

  const { isSupported, isListening, toggleListening, stopListening } =
    useSpeechRecognition(handleTranscript);

  const handleSubmit = async () => {
    if (!sessionId || !candidateText.trim() || isSubmitting) return;

    if (isListening) {
      stopListening();
    }

    const answerToSend = candidateText.trim();
    setCandidateText("");

    try {
      await submitAnswer({
        sessionId,
        body: {
          careerJourneyId,
          candidateAnswer: answerToSend,
        },
      }).unwrap();
    } catch (err) {
      console.error("Failed to submit interview answer:", err);
      // Restore text if failed
      setCandidateText(answerToSend);
    }
  };

  const isPageLoading =
    workspaceLoading ||
    workspaceFetching ||
    (Boolean(careerJourneyId) && Boolean(sessionId) && (sessionLoading || sessionFetching));

  if (isPageLoading && !session) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Preparing Technical Interview...</p>
        </div>
      </div>
    );
  }

  if (workspaceError || (!careerJourneyId && !isPageLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300 p-6">
        <div className="max-w-md text-center p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <AlertCircle size={36} className="text-amber-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">No Active Career Journey</h2>
          <p className="text-xs text-slate-400">
            Please make sure your career journey is active before starting technical interviews.
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

  if (sessionError || !session) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300 p-6">
        <div className="max-w-md text-center p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <AlertCircle size={36} className="text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Interview Session Not Found</h2>
          <p className="text-xs text-slate-400">
            Could not load this interview session. It may have expired or been moved.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => refetchSession()}
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
              <span>Practice Ground</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active question is the last turn in session
  const activeTurn = session.turns[session.turns.length - 1];
  const isSessionCompleted = session.status === "COMPLETED";

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to={session.isOfficialReadinessMock ? "/readiness" : "/practice"}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 px-2 rounded hover:bg-slate-800"
          >
            <ArrowLeft size={14} />
            <span>{session.isOfficialReadinessMock ? "Job Readiness" : "Practice Hub"}</span>
          </Link>
          <span className="text-slate-700">/</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">
              {session.isOfficialReadinessMock
                ? `Official Mock Interview #${session.mockInterviewNumber}`
                : `${session.skillName} Technical Drill`}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Question {session.currentQuestionIndex + 1} of 3
            </span>
            {activeTurn && !isSessionCompleted && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  activeTurn.turnType === "FOLLOW_UP"
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                }`}
              >
                {activeTurn.turnType === "FOLLOW_UP"
                  ? "Probing Follow-Up"
                  : "Scenario Question"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Clock size={12} />
            <span>10–15m Drill</span>
          </span>
          <span
            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
              session.isOfficialReadinessMock
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : session.optedInToJourney
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {session.isOfficialReadinessMock
              ? "Official Readiness Battery"
              : session.optedInToJourney
              ? "Included in Journey"
              : "Zero-Stakes"}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-4xl w-full mx-auto">
        {/* If completed, display Diagnostic Report Card */}
        {isSessionCompleted && session.evaluation ? (
          <InterviewDiagnosticCard
            sessionId={session.id}
            skillName={session.skillName}
            evaluation={session.evaluation}
            initialOptedIn={session.optedInToJourney}
            isOfficialReadinessMock={session.isOfficialReadinessMock}
            mockInterviewNumber={session.mockInterviewNumber}
          />
        ) : (
          /* Live Interview Chat Stream */
          <div className="space-y-6 pb-24">
            {/* Philosophical Banner */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
              <Sparkles size={16} className="text-indigo-400 shrink-0 mt-0.5" />
              <span>
                Your AI Interviewer evaluates conceptual depth, technical trade-offs, and communication clarity. Speak naturally using your microphone or type your response below.
              </span>
            </div>

            {/* Render completed turns */}
            {session.turns.map((turn, index) => {
              const isTurnAnswered = Boolean(turn.candidateAnswer);

              return (
                <div key={index} className="space-y-4">
                  {/* Interviewer Message */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={16} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          Staff Interviewer
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {turn.turnType === "FOLLOW_UP"
                            ? "Dynamic Follow-Up"
                            : `Question ${turn.questionIndex + 1}`}
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 leading-relaxed shadow-sm">
                        {turn.questionText}
                      </div>
                    </div>
                  </div>

                  {/* Candidate Answer (if answered) */}
                  {isTurnAnswered && (
                    <div className="flex items-start gap-3 justify-end pl-8">
                      <div className="flex-1 space-y-1 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-[10px] font-mono text-slate-500">
                            {turn.answeredAt
                              ? new Date(turn.answeredAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Answered"}
                          </span>
                          <span className="text-xs font-bold text-indigo-300">
                            You
                          </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-sm text-indigo-100 leading-relaxed text-left inline-block max-w-2xl shadow-sm">
                          {turn.candidateAnswer}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <User size={16} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* In-Flight Thinking Indicator */}
            {isSubmitting && (
              <div className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-indigo-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  <span>
                    Staff Engineer is evaluating your answer and preparing the next turn...
                  </span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Candidate Response Pane (Only when in progress) */}
      {!isSessionCompleted && (
        <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-indigo-500/60 transition-all shadow-lg">
              <textarea
                value={candidateText}
                onChange={(e) => setCandidateText(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening... Speak your technical explanation clearly."
                    : "Type your technical response here, or click Speak to dictate with your microphone..."
                }
                rows={3}
                disabled={isSubmitting}
                className="w-full bg-transparent p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />

              {/* Dictation Pulsing Indicator */}
              {isListening && (
                <div className="absolute top-3 right-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-semibold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Recording voice...</span>
                </div>
              )}

              {/* Input Action Toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 rounded-b-2xl border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  {/* Microphone Dictation Button */}
                  {isSupported ? (
                    <button
                      type="button"
                      onClick={toggleListening}
                      disabled={isSubmitting}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isListening
                          ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                      }`}
                    >
                      {isListening ? <MicOff size={13} /> : <Mic size={13} />}
                      <span>{isListening ? "Stop Speaking" : "Speak (Dictation)"}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <HelpCircle size={12} />
                      Mic not supported in this browser
                    </span>
                  )}

                  {candidateText.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCandidateText("")}
                      className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    Ctrl + Enter to send
                  </span>
                  <button
                    type="button"
                    disabled={isSubmitting || !candidateText.trim()}
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20"
                  >
                    <span>Submit Answer</span>
                    <Send size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewWorkspacePage;
