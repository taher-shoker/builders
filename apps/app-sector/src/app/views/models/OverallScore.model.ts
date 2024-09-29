export interface OverallScoreParams {
  year: string;
  quarter: string;
  sectorName: string;
}

export interface OverallScore {
  score: number;
  scorecardTitle: string;
  weight: number;
}
