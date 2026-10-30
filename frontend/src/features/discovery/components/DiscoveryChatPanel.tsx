import { useEffect, useRef } from "react";

import { AlertCircle, Sparkles } from "lucide-react";

import Progress from "../../../components/ui/Progress/Progress";

import {
  DISCOVERY_MAX_ANSWERS,
  DISCOVERY_MIN_ANSWERS,
  DISCOVERY_QUICK_REPLIES,
  DISCOVERY_STAGE_LABELS,
  getDiscoveryProgress,
  isDiscoveryWrapUp,
} from "../constants/discovery.constants";

import type {
  DiscoveryCandidate,
  DiscoveryMessage,
  DiscoverySession,
} from "../types/discovery.types";

import DiscoveryComposer from "./DiscoveryComposer";
import DiscoveryMessageBubble from "./DiscoveryMessageBubble";
import DiscoverySummary from "./DiscoverySummary";
import DiscoveryTypingIndicator from "./DiscoveryTypingIndicator";

interface DiscoveryChatPanelProps {
  session: DiscoverySession;

  messages: DiscoveryMessage[];

  candidates: DiscoveryCandidate[];

  selectedCandidateId: string | null;

  selectingCandidateId: string | null;

  isSending: boolean;

  isRestarting: boolean;

  isGeneratingRecommendations: boolean;

  error: string | null;

  onSend: (answer: string) => Promise<boolean>;

  onGenerateRecommendations: () => void;

  onRestart: () => void;

  onContinue: () => void;

  onSelectCandidate: (candidateId: string) => void;
}

const DiscoveryChatPanel = ({
  session,
  messages,
  candidates,
  selectedCandidateId,
  selectingCandidateId,
  isSending,
  isRestarting,
  isGeneratingRecommendations,
  error,
  onSend,
  onGenerateRecommendations,
  onRestart,
  onContinue,
  onSelectCandidate,
}: DiscoveryChatPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isWrapUp = isDiscoveryWrapUp(session.currentStage);

  const answerCount = messages.filter(
    (message) => message.senderRole === "user",
  ).length;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      block: "end",
    });
  }, [messages.length, isSending]);

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      <div className="border-b border-slate-200 p-5 sm:p-6">
        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-blue-600
              "
            >
              {isWrapUp ? "Career discovery" : "In conversation"}
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {DISCOVERY_STAGE_LABELS[session.currentStage]}
            </h2>
          </div>

          <span
            className="
              inline-flex
              w-fit
              items-center
              gap-1.5
              rounded-full
              bg-slate-100
              px-3
              py-1.5
              text-xs
              font-semibold
              text-slate-600
            "
          >
            <Sparkles size={13} />
            {isWrapUp ? "Answers saved" : `Question ${answerCount + 1}`}
          </span>
        </div>

        <Progress
          value={getDiscoveryProgress(answerCount, isWrapUp)}
          className="mt-4"
        />

        {!isWrapUp && (
          <p className="mt-2 text-xs text-slate-500">
            A few thoughtful answers are enough — usually {DISCOVERY_MIN_ANSWERS}{" "}
            to {DISCOVERY_MAX_ANSWERS}.
          </p>
        )}
      </div>

      <div
        className="
          max-h-[32rem]
          min-h-72
          overflow-y-auto
          bg-slate-50/70
          p-4
          sm:p-6
        "
        aria-live="polite"
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <DiscoveryMessageBubble key={message.id} message={message} />
          ))}

          {messages.length === 0 && !isSending && (
            <p className="py-8 text-center text-sm text-slate-500">
              Your conversation will appear here.
            </p>
          )}

          {isSending && <DiscoveryTypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {error && (
        <div
          className="
            flex
            items-start
            gap-3
            border-t
            border-red-200
            bg-red-50
            px-5
            py-4
          "
          role="alert"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />

          <p className="text-sm leading-6 text-red-700">{error}</p>
        </div>
      )}

      {isWrapUp ? (
        <DiscoverySummary
          stage={session.currentStage}
          candidates={candidates}
          selectedCandidateId={selectedCandidateId}
          selectingCandidateId={selectingCandidateId}
          isRestarting={isRestarting}
          isGeneratingRecommendations={isGeneratingRecommendations}
          onContinue={onContinue}
          onGenerateRecommendations={onGenerateRecommendations}
          onRestart={onRestart}
          onSelectCandidate={onSelectCandidate}
        />
      ) : (
        <div className="border-t border-slate-200 p-4 sm:p-5">
          <DiscoveryComposer
            isSending={isSending}
            quickReplies={DISCOVERY_QUICK_REPLIES[session.currentStage] ?? []}
            onSend={onSend}
          />
        </div>
      )}
    </section>
  );
};

export default DiscoveryChatPanel;
