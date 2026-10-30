export enum DiscoveryStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum DiscoveryStage {
  INTRO = 'intro',
  COUNSELING = 'counseling',
  CURRENT_STUDIES = 'current_studies',
  WORK_PREFERENCES = 'work_preferences',
  STRENGTHS_INTERESTS = 'strengths_interests',
  VALUES_CONSTRAINTS = 'values_constraints',
  GENERATING = 'generating',
  COMPLETED = 'completed',
}

export enum DiscoveryMessageRole {
  ASSISTANT = 'assistant',
  USER = 'user',
}

export enum DiscoveryMessageType {
  INTRO = 'intro',
  QUESTION = 'question',
  ANSWER = 'answer',
  QUICK_REPLY = 'quick_reply',
  FREE_TEXT = 'free_text',
}

export enum DiscoveryAnswerType {
  FREE_TEXT = 'free_text',
  QUICK_REPLY = 'quick_reply',
}

export enum DiscoveryCandidateSource {
  DISCOVERY = 'discovery',
  RESUME = 'resume',
  ASSESSMENT = 'assessment',
  PREFERENCE = 'preference',
}

export enum DiscoveryCandidateStatus {
  PROPOSED = 'proposed',
  SELECTED = 'selected',
  REJECTED = 'rejected',
}
