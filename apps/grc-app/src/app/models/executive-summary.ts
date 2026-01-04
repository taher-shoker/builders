export interface KRIModel {
  id: number;
  title: string;
  category: string;
  value: number;
}
export interface DPKRIsModel {
  id: number;
  title: string;
  status: string;
  currentScore: number;
  t1Score: number;
  t2Score: number;
  t3Score: number;
}
export interface ExecutiveSummaryModel {
  year: number;
  periodType: string;
  period: string;
  gd: string;
  overallPerformance: OverallPerformanceModel[];
  kriStatusPerGd: KRIStatusPerGdModel[];
  kriTrendAnalysis: KRITrendAnalysisModel[];
  unacceptableKriPerGd: UnacceptableKriPerGd[];
  unacceptableProjectDetails: UnacceptableProjectDetails[];
}
export interface UnacceptableProjectDetails {
  projectName: string;
  gd: string;
  avalue: number;
}
export interface UnacceptableKriPerGd {
  gd: string;
  numberOfUnacceptableProjects: number;
}
export interface KRITrendAnalysisModel {
  quarter: string;
  status: string;
  percentage: number;
}
export interface KRIStatusPerGdModel {
  gd: string;
  status: string;
  percentage: number;
}
export interface OverallPerformanceModel {
  status: string;
  percentage: number;
}
export interface AvailablePeriodModel {
  id: number;
  year: number;
  month: string;
  quarter: string;
}
