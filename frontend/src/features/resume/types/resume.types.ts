export type ResumeStatus =
  | "UPLOADED"
  | "ANALYZING"
  | "ANALYZED"
  | "ANALYSIS_FAILED"
  | "DELETED";

export interface ResumeSkill {
  skillCatalogId: string | null;

  name: string;

  slug: string | null;

  evidence: string;

  confidence: number;

  matched: boolean;
}

export interface ResumeAnalysis {
  skills: ResumeSkill[];

  provider: string;

  model: string;

  analyzedAt: string;

  textLength: number;
}

export interface ResumeConfirmation {
  skillCatalogIds: string[];

  newSkillCatalogIds: string[];

  confirmedAt: string;
}

export interface Resume {
  id: string;

  careerJourneyId: string;

  originalFileName: string;

  mimeType: string;

  fileSize: number;

  pageCount: number | null;

  status: ResumeStatus;

  analysis: ResumeAnalysis | null;

  analysisError: string | null;

  confirmation: ResumeConfirmation | null;

  uploadedAt: string;

  createdAt: string;

  updatedAt: string;
}

export interface UploadResumeRequest {
  careerJourneyId: string;

  file: File;
}

export interface ConfirmResumeSkillsRequest {
  resumeId: string;

  skillCatalogIds: string[];
}
