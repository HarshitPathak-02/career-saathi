import { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";

import { useAppDispatch } from "../../../app/hooks";

import { getApiErrorMessage } from "../../../shared/lib/getApiErrorMessage";

import { useGetWorkspaceQuery } from "../../workspace/api/workspaceApi";

import { resetInitialAssessment } from "../../initial-assessment/slice/initialAssessmentSlice";

import {
  setSelectedDomain,
  setSelectedRole,
} from "../../career-setup/slice/careerSetupSlice";

import {
  useAddDiscoveryAnswerMutation,
  useGetDiscoveryCandidatesQuery,
  useGetDiscoveryMessagesQuery,
  useGetDiscoverySessionQuery,
  useGetLatestDiscoveryQuery,
  useStartDiscoveryMutation,
  useGenerateDiscoveryCandidatesMutation,
  useSelectDiscoveryCandidateMutation,
} from "../api/discoveryApi";

import { isDiscoveryWrapUp } from "../constants/discovery.constants";

import DiscoveryChatPanel from "../components/DiscoveryChatPanel";
import DiscoveryIntro from "../components/DiscoveryIntro";

const CareerDiscoveryPage = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [startedDiscoveryId, setStartedDiscoveryId] = useState<string | null>(
    null,
  );

  const [selectedCandidateOverride, setSelectedCandidateOverride] = useState<
    string | null
  >(null);

  const [selectingCandidateId, setSelectingCandidateId] = useState<
    string | null
  >(null);

  const [actionError, setActionError] = useState<string | null>(null);

  const { data: workspaceResponse } = useGetWorkspaceQuery();

  const careerJourneyId = workspaceResponse?.data.careerJourney.id;

  const {
    data: latestResponse,
    isLoading: latestLoading,
    isError: latestError,
    error: latestErrorObject,
    refetch: refetchLatest,
  } = useGetLatestDiscoveryQuery();

  const discoveryId = startedDiscoveryId ?? latestResponse?.data?.id ?? null;

  const {
    data: sessionResponse,
    isLoading: sessionLoading,
    isFetching: sessionFetching,
    isError: sessionError,
    error: sessionErrorObject,
    refetch: refetchSession,
  } = useGetDiscoverySessionQuery(discoveryId ?? "", {
    skip: !discoveryId,
  });

  const {
    data: messagesResponse,
    isLoading: messagesLoading,
    isError: messagesError,
    error: messagesErrorObject,
    refetch: refetchMessages,
  } = useGetDiscoveryMessagesQuery(discoveryId ?? "", {
    skip: !discoveryId,
  });

  const session = sessionResponse?.data ?? null;

  const messages = messagesResponse?.data ?? [];

  const answerCount = messages.filter(
    (message) => message.senderRole === "user",
  ).length;

  const isWrapUp = session ? isDiscoveryWrapUp(session.currentStage) : false;

  const { data: candidatesResponse } = useGetDiscoveryCandidatesQuery(
    discoveryId ?? "",
    {
      skip: !discoveryId || !isWrapUp,
    },
  );

  const candidates = candidatesResponse?.data ?? [];

  const selectedCandidateId =
    selectedCandidateOverride ??
    candidates.find((candidate) => candidate.status === "selected")?.id ??
    null;

  const [startDiscovery, { isLoading: isStarting }] =
    useStartDiscoveryMutation();

  const [addDiscoveryAnswer, { isLoading: isSending }] =
    useAddDiscoveryAnswerMutation();

  const [
    generateDiscoveryCandidates,
    { isLoading: isGeneratingRecommendations },
  ] = useGenerateDiscoveryCandidatesMutation();

  const [selectDiscoveryCandidate] = useSelectDiscoveryCandidateMutation();

  const generationRequestedRef = useRef<string | null>(null);

  const handleStart = async () => {
    setActionError(null);

    try {
      const response = await startDiscovery(
        careerJourneyId ? { careerJourneyId } : {},
      ).unwrap();

      setSelectedCandidateOverride(null);

      setStartedDiscoveryId(response.data.id);
    } catch (error) {
      setActionError(getApiErrorMessage(error));
    }
  };

  const handleSend = async (answer: string): Promise<boolean> => {
    if (!session || !discoveryId) {
      return false;
    }

    setActionError(null);

    try {
      await addDiscoveryAnswer({
        discoveryId,
        questionKey: `answer_${answerCount + 1}`,
        answer,
        answerType: "free_text",
      }).unwrap();

      return true;
    } catch (error) {
      setActionError(getApiErrorMessage(error));

      return false;
    }
  };

  const handleGenerateRecommendations = async () => {
    if (!session) {
      return;
    }

    generationRequestedRef.current = session.id;

    setActionError(null);

    try {
      await generateDiscoveryCandidates(session.id).unwrap();
    } catch (error) {
      generationRequestedRef.current = null;

      setActionError(getApiErrorMessage(error));
    }
  };

  const handleSelectCandidate = async (candidateId: string) => {
    if (!sessionId) {
      return;
    }

    setActionError(null);
    setSelectingCandidateId(candidateId);

    try {
      await selectDiscoveryCandidate({
        discoveryId: sessionId,
        candidateId,
      }).unwrap();

      setSelectedCandidateOverride(candidateId);

      const targetCandidate = candidates.find(
        (candidate) => candidate.id === candidateId,
      );

      if (targetCandidate) {
        dispatch(setSelectedDomain(targetCandidate.careerDomainId));
        dispatch(setSelectedRole(targetCandidate.careerRoleId));
      }

      dispatch(resetInitialAssessment());
    } catch (error) {
      setActionError(getApiErrorMessage(error));
    } finally {
      setSelectingCandidateId(null);
    }
  };

  const handleContinue = () => {
    if (candidates.length > 0 && !selectedCandidateId) {
      setActionError("Choose one career direction before continuing.");

      return;
    }

    navigate("/initial-assessment");
  };

  const sessionId = session?.id ?? null;

  const sessionStage = session?.currentStage ?? null;

  useEffect(() => {
    if (!sessionId || sessionStage !== "generating") {
      return;
    }

    if (generationRequestedRef.current === sessionId) {
      return;
    }

    generationRequestedRef.current = sessionId;

    setActionError(null);

    void generateDiscoveryCandidates(sessionId)
      .unwrap()
      .catch((error) => {
        generationRequestedRef.current = null;

        setActionError(getApiErrorMessage(error));
      });
  }, [sessionId, sessionStage, generateDiscoveryCandidates]);

  const handleRetry = () => {
    void refetchLatest();

    if (discoveryId) {
      void refetchSession();
      void refetchMessages();
    }
  };

  const isInitialLoading = !discoveryId && latestLoading;
  const isChatLoading = !!discoveryId && (sessionLoading || messagesLoading);

  const backPath = careerJourneyId ? "/workspace" : "/career-direction";
  const backLabel = careerJourneyId
    ? "Back to workspace"
    : "Back to career setup";

  const chatError =
    discoveryId && (sessionError || messagesError)
      ? getApiErrorMessage(
          sessionError ? sessionErrorObject : messagesErrorObject,
        )
      : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div
        className="
          mx-auto
          w-full
          max-w-4xl
          px-4
          py-6
          sm:px-6
          lg:px-8
          lg:py-10
        "
      >
        <Link
          to={backPath}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            text-sm
            font-medium
            text-slate-600
            transition
            hover:text-slate-900
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:ring-offset-2
          "
        >
          <ArrowLeft size={17} />
          {backLabel}
        </Link>

        <header className="mt-5 mb-6">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-blue-100
              bg-blue-50
              px-3
              py-1.5
              text-xs
              font-semibold
              text-blue-700
            "
          >
            <Sparkles size={14} />
            AI-guided career discovery
          </div>

          <h1
            className="
              mt-4
              text-2xl
              font-bold
              tracking-tight
              text-slate-900
              sm:text-3xl
            "
          >
            Career Discovery
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-7
              text-slate-600
              sm:text-base
            "
          >
            Have a focused conversation about what you enjoy, how you want to
            work, and what matters to you.
          </p>
        </header>

        {isInitialLoading && (
          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-8
              text-center
              shadow-sm
            "
          >
            <Loader2 size={28} className="mx-auto animate-spin text-blue-600" />

            <p className="mt-3 text-sm text-slate-600">
              Preparing your discovery...
            </p>
          </section>
        )}

        {!isInitialLoading && !discoveryId && (
          <DiscoveryIntro
            isStarting={isStarting}
            error={
              actionError ??
              (latestError ? getApiErrorMessage(latestErrorObject) : null)
            }
            onStart={handleStart}
          />
        )}

        {discoveryId && isChatLoading && (
          <section
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-8
                text-center
                shadow-sm
              "
          >
            <Loader2 size={28} className="mx-auto animate-spin text-blue-600" />

            <p className="mt-3 text-sm text-slate-600">
              Loading your conversation...
            </p>
          </section>
        )}

        {discoveryId && !isChatLoading && chatError && (
          <section
            className="
                rounded-2xl
                border
                border-red-200
                bg-white
                p-6
                text-center
                shadow-sm
                sm:p-8
              "
          >
            <div
              className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-50
                  text-red-600
                "
            >
              <AlertCircle size={22} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Unable to load discovery
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">{chatError}</p>

            <div
              className="
                  mt-6
                  flex
                  flex-col
                  justify-center
                  gap-3
                  sm:flex-row
                "
            >
              <Button variant="outline" onClick={handleRetry}>
                <span className="inline-flex items-center justify-center gap-2">
                  <RefreshCw size={16} />
                  Try again
                </span>
              </Button>
            </div>
          </section>
        )}

        {discoveryId && !isChatLoading && !chatError && session && (
          <DiscoveryChatPanel
            key={session.id}
            session={session}
            messages={messages}
            candidates={candidates}
            selectedCandidateId={selectedCandidateId}
            selectingCandidateId={selectingCandidateId}
            isSending={isSending || sessionFetching}
            isRestarting={isStarting}
            isGeneratingRecommendations={isGeneratingRecommendations}
            error={actionError}
            onSend={handleSend}
            onGenerateRecommendations={handleGenerateRecommendations}
            onRestart={handleStart}
            onContinue={handleContinue}
            onSelectCandidate={handleSelectCandidate}
          />
        )}
      </div>
    </div>
  );
};

export default CareerDiscoveryPage;
