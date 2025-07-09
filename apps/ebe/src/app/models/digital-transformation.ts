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
