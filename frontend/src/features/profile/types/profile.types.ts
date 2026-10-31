export interface CompetencyPassportSkill {
  skillCatalogId: string;
  name: string;
  slug: string;
  category: string;
  difficulty: string;
  description: string;
  currentScore: number;
  currentLevel: string;
  selectedByUser: boolean;
  evidenceCount: number;
  evidenceSources: string[];
  lastAssessmentAt: string | null;
}

export interface CompetencyPassportSummary {
  totalSkills: number;
  masteredCount: number;
  inProgressCount: number;
  notStartedCount: number;
  averageScore: number;
}

export interface CompetencyPassportResponse {
  summary: CompetencyPassportSummary;
  categories: string[];
  skills: CompetencyPassportSkill[];
  topStrengths: CompetencyPassportSkill[];
  areasForGrowth: CompetencyPassportSkill[];
}

export interface CareerJourneyListItem {
  id: string;
  domainId?: string;
  roleId?: string;
  targetRole: string;
  targetDomain: string;
  targetCompany: string;
  targetDurationMonths: number;
  dailyStudyHours: number;
  status: string;
  isCurrentlyActive: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  _id: string;
  title: string;
  message: string;
  type: string;
  actionUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}
