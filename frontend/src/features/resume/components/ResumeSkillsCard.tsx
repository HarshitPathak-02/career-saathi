import {
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  Check,
  FileText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";

import { getApiErrorMessage } from "../../../shared/lib/getApiErrorMessage";

import {
  useAnalyzeResumeMutation,
  useConfirmResumeSkillsMutation,
  useGetResumeByCareerJourneyQuery,
  useUploadResumeMutation,
} from "../api/resumeApi";

import type {
  Resume,
} from "../types/resume.types";

interface ResumeSkillsCardProps {
  careerJourneyId: string;

  mode?: "profile" | "onboarding";

  onConfirmed?: (
    resume: Resume
  ) => void;
}

const getConfidenceLabel = (
  confidence: number
): string => {
  if (confidence >= 0.8) {
    return "Strong evidence";
  }

  if (confidence >= 0.6) {
    return "Likely evidence";
  }

  return "Possible evidence";
};

const formatFileSize = (
  bytes: number
): string => {
  if (bytes < 1024 * 1024) {
    return `${Math.max(
      1,
      Math.round(bytes / 1024)
    )} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
};

export default function ResumeSkillsCard({
  careerJourneyId,
  mode = "profile",
  onConfirmed,
}: ResumeSkillsCardProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [
    selection,
    setSelection,
  ] = useState<{
    key: string;
    ids: string[];
  } | null>(null);

  const [
    actionError,
    setActionError,
  ] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetResumeByCareerJourneyQuery(
    careerJourneyId
  );

  const [
    uploadResume,
    {
      isLoading: isUploading,
    },
  ] = useUploadResumeMutation();

  const [
    analyzeResume,
    {
      isLoading: isAnalyzing,
    },
  ] = useAnalyzeResumeMutation();

  const [
    confirmResumeSkills,
    {
      isLoading: isConfirming,
    },
  ] = useConfirmResumeSkillsMutation();

  const resume = data?.data;

  const isBusy =
    isUploading ||
    isAnalyzing ||
    isConfirming;

  const errorStatus =
    typeof error === "object" &&
    error !== null &&
    "status" in error
      ? error.status
      : undefined;

  const hasNoResume =
    errorStatus === 404;

  const matchedSkills =
    resume?.analysis?.skills.filter(
      (skill) =>
        skill.matched &&
        skill.skillCatalogId
    ) ?? [];

  const unmatchedSkills =
    resume?.analysis?.skills.filter(
      (skill) =>
        !skill.matched ||
        !skill.skillCatalogId
    ) ?? [];

  const defaultSelectedSkillCatalogIds =
    resume?.confirmation
      ? resume.confirmation
        .skillCatalogIds
      : matchedSkills.map(
        (skill) =>
          skill.skillCatalogId as string
      );

  const selectionKey = resume
    ? [
      resume.id,
      resume.analysis?.analyzedAt ?? "",
      resume.confirmation?.confirmedAt ?? "",
    ].join(":")
    : "";

  const selectedSkillCatalogIds =
    selection?.key === selectionKey
      ? selection.ids
      : defaultSelectedSkillCatalogIds;

  const handleFile = async (
    file: File | undefined
  ) => {
    if (!file) {
      return;
    }

    setActionError(null);

    try {
      const uploaded =
        await uploadResume({
          careerJourneyId,
          file,
        }).unwrap();

      await analyzeResume(
        uploaded.data.id
      ).unwrap();
    } catch (uploadError) {
      setActionError(
        getApiErrorMessage(uploadError)
      );
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAnalyze = async () => {
    if (!resume) {
      return;
    }

    setActionError(null);

    try {
      await analyzeResume(
        resume.id
      ).unwrap();
    } catch (analysisError) {
      setActionError(
        getApiErrorMessage(analysisError)
      );
    }
  };

  const handleConfirm = async () => {
    if (!resume) {
      return;
    }

    if (
      mode === "onboarding" &&
      selectedSkillCatalogIds.length === 0
    ) {
      setActionError(
        "Select at least one skill to continue with your assessment."
      );

      return;
    }

    setActionError(null);

    try {
      const confirmed =
        await confirmResumeSkills({
          resumeId: resume.id,
          skillCatalogIds:
            selectedSkillCatalogIds,
        }).unwrap();

      onConfirmed?.(
        confirmed.data
      );
    } catch (confirmationError) {
      setActionError(
        getApiErrorMessage(confirmationError)
      );
    }
  };

  const toggleSkill = (
    skillCatalogId: string
  ) => {
    setSelection({
      key: selectionKey,

      ids:
        selectedSkillCatalogIds.includes(
          skillCatalogId
        )
          ? selectedSkillCatalogIds.filter(
            (id) =>
              id !== skillCatalogId
          )
          : [
            ...selectedSkillCatalogIds,
            skillCatalogId,
          ],
    });
  };

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FileText size={22} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">
              Skills
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Resume skills
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {mode === "onboarding"
                ? "Upload a PDF or DOCX resume to prefill the skills for your initial assessment. You can skip this and choose skills manually."
                : "Upload a PDF or DOCX resume. We extract evidence and let you confirm which skills belong on your profile."}
            </p>
          </div>
        </div>

        {resume && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={isBusy}
          >
            <span className="inline-flex items-center gap-2">
              <Upload size={15} />
              Re-upload
            </span>
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(event) =>
          handleFile(
            event.target.files?.[0]
          )
        }
      />

      {actionError && (
                <div
                  role="alert"
                  className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
                >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p>{actionError}</p>
        </div>
      )}

      {isLoading ? (
        <p className="mt-6 text-sm text-slate-500">
          Loading your resume...
        </p>
      ) : hasNoResume ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <ShieldCheck
            size={30}
            className="mx-auto text-blue-600"
          />

          <h3 className="mt-3 font-semibold text-slate-900">
            Add your resume
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            PDF and DOCX files up to 5 MB are supported.
            Scanned or image-only resumes cannot be read.
          </p>

          <Button
            className="mt-5"
            loading={isUploading}
            disabled={isBusy}
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            <span className="inline-flex items-center gap-2">
              <Upload size={16} />
              Choose resume
            </span>
          </Button>
        </div>
      ) : !resume ? (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-600">
            We could not load your resume right now.
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900">
                {resume.originalFileName}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatFileSize(resume.fileSize)}
                {resume.pageCount
                  ? ` · ${resume.pageCount} pages`
                  : ""}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              loading={isAnalyzing}
              disabled={isBusy}
              onClick={handleAnalyze}
            >
              <span className="inline-flex items-center gap-2">
                <RefreshCw size={15} />
                Re-analyze
              </span>
            </Button>
          </div>

          {isUploading && (
            <p className="text-sm text-slate-500">
              Uploading and reading your resume...
            </p>
          )}

          {isAnalyzing && (
            <p className="text-sm text-slate-500">
              Analyzing skills. This can take a few seconds...
            </p>
          )}

          {resume.status ===
            "ANALYSIS_FAILED" && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <p>
                {resume.analysisError ??
                  "We could not analyze this resume. Try again or upload a different file."}
              </p>
            </div>
          )}

          {!resume.analysis ? (
            <div className="rounded-xl border border-slate-200 p-6 text-center">
              <Sparkles
                size={24}
                className="mx-auto text-blue-600"
              />

              <p className="mt-3 text-sm text-slate-600">
                Analyze this resume to find skills.
              </p>

              <Button
                className="mt-4"
                loading={isAnalyzing}
                disabled={isBusy}
                onClick={handleAnalyze}
              >
                Analyze resume
              </Button>
            </div>
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-slate-900">
                    Suggested skills
                  </h3>

                  <p className="text-sm text-slate-500">
                    {
                      selectedSkillCatalogIds.length
                    }{" "}
                    selected
                  </p>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {mode === "profile"
                    ? "Reference only. Your current journey, scores, and roadmap are unchanged."
                    : "Only confirmed skills are added to your selected profile skills."}
                </p>

                {matchedSkills.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-slate-200 p-5 text-sm text-slate-600">
                    No catalog skills were found in
                    this resume.
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3">
                    {matchedSkills.map(
                      (skill) => {
                        const skillCatalogId =
                          skill.skillCatalogId as string;

                        const isSelected =
                          selectedSkillCatalogIds.includes(
                            skillCatalogId
                          );

                        return (
                          <button
                            key={skillCatalogId}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() =>
                              toggleSkill(
                                skillCatalogId
                              )
                            }
                            className={`
                              w-full
                              rounded-xl
                              border
                              p-4
                              text-left
                              transition

                              ${
                                isSelected
                                  ? "border-blue-300 bg-blue-50"
                                  : "border-slate-200 bg-white hover:border-blue-200"
                              }
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className={`
                                  mt-0.5
                                  flex
                                  h-5
                                  w-5
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-md
                                  border

                                  ${
                                    isSelected
                                      ? "border-blue-600 bg-blue-600 text-white"
                                      : "border-slate-300 bg-white"
                                  }
                                `}
                              >
                                {isSelected && (
                                  <Check
                                    size={13}
                                  />
                                )}
                              </span>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-semibold text-slate-900">
                                    {
                                      skill.name
                                    }
                                  </p>

                                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                                    {getConfidenceLabel(
                                      skill.confidence
                                    )}
                                  </span>
                                </div>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                  “
                                  {
                                    skill.evidence
                                  }
                                  ”
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                )}

                {unmatchedSkills.length > 0 && (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                      Not in catalog
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {unmatchedSkills.map(
                        (skill) => (
                          <span
                            key={`${skill.name}-${skill.evidence}`}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600"
                          >
                            {
                              skill.name
                            }
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-500">
                  Confirming never changes assessment
                  scores. You can update selected skills
                  later.
                </p>

                <Button
                  loading={isConfirming}
                  disabled={isBusy}
                  onClick={handleConfirm}
                >
                  <span className="inline-flex items-center gap-2">
                    <Check size={16} />
                    {mode === "onboarding"
                      ? "Confirm skills and continue"
                      : "Save resume evidence"}
                  </span>
                </Button>
              </div>

              {resume.confirmation && (
                <p className="text-xs text-slate-400">
                  Last confirmed{" "}
                  {new Date(
                    resume.confirmation
                      .confirmedAt
                  ).toLocaleString()}
                </p>
              )}
            </>
          )}
        </div>
      )}

    </section>
  );
}
