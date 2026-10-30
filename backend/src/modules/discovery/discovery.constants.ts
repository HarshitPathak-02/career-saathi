export const DISCOVERY_MODEL = 'Discovery';
export const DISCOVERY_COLLECTION = 'discoveries';
export const DISCOVERY_MESSAGES_COLLECTION = 'discovery_messages';
export const DISCOVERY_ANSWERS_COLLECTION = 'discovery_answers';
export const DISCOVERY_CANDIDATES_COLLECTION = 'discovery_candidates';

export const DISCOVERY_MIN_ANSWERS = 6;
export const DISCOVERY_MAX_ANSWERS = 12;

export const DISCOVERY_COVERAGE_TOPICS = [
  'current_situation',
  'education',
  'interests',
  'strengths',
  'work_style',
  'values',
  'constraints',
  'goals',
] as const;

export const DISCOVERY_COVERAGE_KEYWORDS: Record<
  (typeof DISCOVERY_COVERAGE_TOPICS)[number],
  string[]
> = {
  current_situation: [
    'currently',
    'right now',
    'final year',
    'student',
    'studying',
    'working',
    'job',
    'unemployed',
    'gap year',
    'graduate',
  ],
  education: [
    'degree',
    'course',
    'university',
    'college',
    'school',
    'major',
    'b.tech',
    'btech',
    'bachelor',
    'master',
    'semester',
    'exam',
    'academic',
  ],
  interests: ['enjoy', 'like', 'love', 'interested', 'passion', 'hobby', 'curious', 'fascinated'],
  strengths: [
    'good at',
    'strength',
    'skill',
    'confident',
    'people ask',
    'help with',
    'solve',
    'problem',
    'proud',
  ],
  work_style: [
    'remote',
    'hybrid',
    'office',
    'team',
    'alone',
    'environment',
    'schedule',
    'hours',
    'collaborate',
    'manage',
  ],
  values: [
    'value',
    'matter',
    'important',
    'stability',
    'growth',
    'balance',
    'impact',
    'salary',
    'purpose',
    'learning',
  ],
  constraints: [
    'cannot',
    "can't",
    'constraint',
    'responsibility',
    'family',
    'financial',
    'relocate',
    'location',
    'time',
    'support',
  ],
  goals: [
    'goal',
    'future',
    'in a few years',
    'become',
    'career path',
    'next step',
    'aspire',
    'dream',
    'after graduation',
  ],
};

export const DISCOVERY_MESSAGES = {
  CREATED: 'Career discovery started successfully.',
  FETCHED: 'Career discovery fetched successfully.',
  ANSWER_ADDED: 'Career discovery answer added successfully.',
  CANDIDATES_FETCHED: 'Career discovery candidates fetched successfully.',
  NOT_FOUND: 'Career discovery not found.',
  ALREADY_COMPLETED: 'Career discovery is already completed.',
  READY_FOR_RECOMMENDATIONS: 'Career discovery is already ready for recommendations.',
} as const;
