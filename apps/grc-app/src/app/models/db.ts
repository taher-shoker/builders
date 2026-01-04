export interface DbDataModel {
  statusSummary: IStatusSummary[];
  quarterTrend: IQuarterTrend[];
}
export interface IQuarterTrend {
  id: string;
  name: string;
  threshold1: string;
  threshold2: string;
  tolerance100: string;
  kriStatus: string;
  month1Name: string;
  month1Value: string | null;
  month2Name: string;
  month2Value: string | null;
  month3Name: string;
  month3Value: string | null;
}
export interface IStatusSummary {
  gd: string;
  status: string;
  count: number;
  total: number;
}
export interface IDbChartData {
  name: string;
  value: number;
}
