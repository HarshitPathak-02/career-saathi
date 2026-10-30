import { ArrowRight, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";

import Button from "../../../components/ui/Button/Button";

import type {
  DiscoveryCandidate,
  DiscoveryStage,
} from "../types/discovery.types";

interface DiscoverySummaryProps {
  stage: DiscoveryStage;

  candidates: DiscoveryCandidate[];

  selectedCandidateId: string | null;

  selectingCandidateId: string | null;

  isRestarting: boolean;

  isGeneratingRecommendations: boolean;

  onContinue: () => void;

  onGenerateRecommendations: () => void;

  onRestart: () => void;

  onSelectCandidate: (candidateId: string) => void;
}

const DiscoverySummary = ({
  stage,
  candidates,
  selectedCandidateId,
  selectingCandidateId,
  isRestarting,
  isGeneratingRecommendations,
  onContinue,
  onGenerateRecommendations,
  onRestart,
  onSelectCandidate,
}: DiscoverySummaryProps) => {
  const isCompleted = stage === "completed";

  const hasCandidates = candidates.length > 0;

  return (
    <div className="border-t border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-green-50
            text-green-600
          "
        >
          {isCompleted ? <CheckCircle2 size={22} /> : <Sparkles size={22} />}
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {isCompleted
              ? "Career discovery complete"
              : isGeneratingRecommendations
                ? "Generating your recommendations"
                : "Your recommendations are ready to generate"}
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {isCompleted
              ? candidates.length > 0
                ? "Your answers are saved. Review the career directions below, then continue to your skills assessment."
                : "Your answers are saved. You can continue to your skills assessment while CareerSaathi prepares the next steps."
              : isGeneratingRecommendations
                ? "CareerSaathi is reviewing your answers and matching them with career directions."
                : "Your answers are saved. CareerSaathi will use them to suggest career directions that fit your interests and preferences."}
          </p>
        </div>
      </div>

      {hasCandidates && (
        <div className="mt-5 space-y-3">
          {candidates.map((candidate) => {
            const isSelected = selectedCandidateId === candidate.id;

            const isSelecting = selectingCandidateId === candidate.id;

            return (
              <div
                key={candidate.id}
                className={`
                  rounded-xl
                  border
                  p-4
                  transition
                  ${
                    isSelected
                      ? "border-blue-300 bg-blue-50/80 ring-1 ring-blue-100"
                      : "border-slate-200 bg-slate-50/70"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {candidate.careerDomainName && (
                      <p
                        className="
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-blue-600
                        "
                      >
                        {candidate.careerDomainName}
                      </p>
                    )}

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {candidate.careerRoleName ||
                        `Career direction ${candidate.rank}`}
                    </p>
                  </div>

                  <span
                    className={`
                      shrink-0
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      shadow-sm
                      ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-500"
                      }
                    `}
                  >
                    {isSelected ? "Selected" : `Match ${candidate.rank}`}
                  </span>
                </div>

                {candidate.rationale && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {candidate.rationale}
                  </p>
                )}

                <div className="mt-4 flex justify-end">
                  <Button
                    size="sm"
                    variant={isSelected ? "primary" : "outline"}
                    loading={isSelecting}
                    disabled={isSelected || selectingCandidateId !== null}
                    onClick={() => onSelectCandidate(candidate.id)}
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      {isSelected && <CheckCircle2 size={15} />}

                      {isSelected
                        ? "Direction selected"
                        : "Choose this direction"}
                    </span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div
        className="
          mt-6
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
        "
      >
        {isCompleted ? (
          <Button
            onClick={onContinue}
            disabled={
              selectingCandidateId !== null ||
              (hasCandidates && !selectedCandidateId)
            }
            className="w-full sm:w-auto"
          >
            <span className="inline-flex items-center justify-center gap-2">
              Continue to initial assessment
              <ArrowRight size={17} />
            </span>
          </Button>
        ) : (
          <Button
            onClick={onGenerateRecommendations}
            loading={isGeneratingRecommendations}
            className="w-full sm:w-auto"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Sparkles size={16} />
              Generate recommendations
            </span>
          </Button>
        )}

        <Button
          variant="outline"
          onClick={onRestart}
          loading={isRestarting}
          className="w-full sm:w-auto"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <RotateCcw size={16} />
            Start a new discovery
          </span>
        </Button>
      </div>

      {isCompleted && hasCandidates && !selectedCandidateId && (
        <p className="mt-3 text-sm text-slate-500">
          Choose one career direction to continue.
        </p>
      )}
    </div>
  );
};

export default DiscoverySummary;
