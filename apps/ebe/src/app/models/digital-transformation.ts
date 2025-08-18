export interface IDigitalTransformationTap {
  id: number;
  pageName: string;
  subpageName: string;
}
export interface DigitalTransformationTapModel {
  id: number;
  name: string;
  value: string;
}
export interface ExecutiveSummaryDataModel {
  aiDashboard: AIDashboardModel[];
  itPlatforms: AIDashboardModel[];
}
export interface AIDashboardModel {
  title: string;
  status: string;
  weight: string;
  planned: string;
  actual: string;
  details: ExecutiveCardModel[];
}
export interface ItPlatformsModel {
  title: string;
  status: string;
  weight: string;
  planned: string;
  actual: string;
  details: ExecutiveCardModel[];
}
export interface ExecutiveCardModel {
  title: string;
  status: string;
  actual: number;
  planned: number;
}
export interface AddWorkstreamFormModel {
  title: string;
  status: string;
  weight: number;
  actual: number;
  planned: number;
  heighlights: string;
  highlights: string;
  challenges: string;
  requestedArtifact?: number;
  completed?: number;
  missingArtifacts?: number;
  architecturalBacklog?: {
    closed?: number;
    open?: number;
    delayed?: number;
    totalTD?: number;
    underVerification?: number;
  };
  technicalDebt?: {
    closed?: number;
    totalTD?: number;
    open?: number;
    delayed?: number;
    underVerification?: number;
  };
}
export enum WorkstreamStatus {
  AtRisk = 'at risk',
  OnTrack = 'on track',
  Delayed = 'delayed',
  NotStartedOrOnHold = 'not started/on hold',
  Complete = 'complete',
  Completed = 'completed',
}
export interface StatusStyle {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}
export const STATUS_STYLE_MAP: Record<WorkstreamStatus, StatusStyle> = {
  [WorkstreamStatus.AtRisk]: {
    backgroundColor: '#FEF9C3',
    textColor: '#EAB308',
    borderColor: '#FEF08A',
  },
  [WorkstreamStatus.OnTrack]: {
    backgroundColor: '#dcfce7',
    textColor: '#22C55E',
    borderColor: '#BBF7D0',
  },
  [WorkstreamStatus.Delayed]: {
    backgroundColor: '#FEF2F2',
    textColor: '#EF4444',
    borderColor: '#FECACA',
  },
  [WorkstreamStatus.Complete]: {
    backgroundColor: '#CFFAFE',
    textColor: '#06B6D4',
    borderColor: '#A5F3FC',
  },
  [WorkstreamStatus.Completed]: {
    backgroundColor: '#CFFAFE',
    textColor: '#06B6D4',
    borderColor: '#A5F3FC',
  },
  [WorkstreamStatus.NotStartedOrOnHold]: {
    backgroundColor: '#F3F4F6',
    textColor: '#6B7280',
    borderColor: '#E5E7EB',
  },
};
export interface QAComplianceModel {
  id: number;
  title: string;
  status: string;
  heighlights: string;
  requestedArtifacts: number;
  completed: number;
  missingArtifacts: number;
  completedPercent: number;
  underValidationPercent?: number;
  totalTD?: number;
  subTitle?: string;
}
export interface TechnicalDebtDashboardModel {
  title: string;
  id: number;
  status: string;
  heighlights: string;
  data: {
    technicalDebt: TechnicalDebtDataModel;
    archituralBacklog?: ArchituralBacklog;
  };
}
export interface ArchituralBacklog {
  closed: number;
  closedPercent: number;
  open: number;
  delayed: number;
  underValidation: number;
  totalABL: number;
}
export interface TechnicalDebtDataModel {
  closed: number;
  closedPercent: number;
  open: number;
  delayed: number;
  underValidation: number;
  totalTD: number;
}
export interface CapabilitiesHandoverDataModel {
  title: string;
  id: number;
  status: string;
  heighlights: string;
  complete: number;
  completePercent: number;
  open: number;
  delayed: number;
  onhold: number;
  totalCapabilities: number;
}
export interface pageDetailsModel {
  businessUnit: string;
  businessUnitStatus: string | null;
  weight: number | null;
  planned: number | null;
  actual: number | null;
  businessUnitHighlights: string | null;
  businessUnitChallenges: string | null;
  projects: pageDetailsProjectModel[];
  businessUnitId: number;
}
export interface pageDetailsProjectModel {
  projectName: string;
  projectStatus: string;
  projectId: number;
  projectHighlights: string | null;
  totalCapabilities: number | null;
  percentage: number | null;
  totalTD: number | null;
  totalABL: number | null;
  metrics: pageDetailsProjectMetricsModel[];
}
export interface pageDetailsProjectMetricsModel {
  name: string;
  value: number;
}
export interface KeyChallengesModel {
  data: KeyChallengesDataModel[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
export interface KeyChallengesDataModel {
  id: number;
  challengeId: number;
  description: string;
  raisedBy: string;
  owner: string;
  dateRaised: string;
  impact: string;
  supportNeeded: string;
}
export interface AddKeyChallengeDataModel {
  description: string;
  raisedBy: string;
  owner: string;
  dateRaised: string;
  impact: string;
  supportNeeded: string;
}
export interface CreateWorkStreamModel {
  pageId?: number;
  businessUnit?: string;
  businessUnitId?: number;
  businessUnitStatus?: string;
  weight?: number;
  planned?: number;
  actual?: number;
  businessUnitHighlights?: string | null;
  businessUnitChallenges?: string | null;
  projects?: {
    projectId?: number;
    projectName?: string;
    projectStatus?: string;
    projectHighlights: string | null;
    totalCapabilities?: number;
    percentage?: number;
    totalTD?: number;
    totalABL?: number | null;
    metrics:
      | {
          name: string;
          value: number;
        }[]
      | null;
  }[];
}
export interface QuarterAchievementModel {
  quarterName: string;
  businessUnits: QuarterAchievementBusinessUnitModel[];
}
export interface QuarterAchievementBusinessUnitModel {
  quarterAchievementId: number;
  id: number;
  name: string;
  achievements: AchievementModel[];
}
export interface AchievementModel {
  id: string;
  title: string;
  description: string;
  descriptionLines: string[];
}
export interface IWorkstream {
  id: number;
  name: string;
}
export interface IAddAchievement {
  quarterName: string;
  businessUnitId: number;
  achievements?: string;
}
