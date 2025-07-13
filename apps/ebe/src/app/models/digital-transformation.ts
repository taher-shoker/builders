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
  highlights: string;
  challenges: string;
}
export enum WorkstreamStatus {
  AtRisk = 'at risk',
  OnTrack = 'on track',
  Delayed = 'delayed',
  NotStartedOrOnHold = 'not started/on hold',
  Complete = 'complete',
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
  [WorkstreamStatus.NotStartedOrOnHold]: {
    backgroundColor: '#F3F4F6',
    textColor: '#6B7280',
    borderColor: '#E5E7EB',
  },
  [WorkstreamStatus.Complete]: {
    backgroundColor: '#CFFAFE',
    textColor: '#06B6D4',
    borderColor: '#A5F3FC',
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
}
