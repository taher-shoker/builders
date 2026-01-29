export interface DashboardData {
  scorecard: {
    numberOfVerticals: number;
    numberOfKPIs: number;
  };
  psrDetail: {
    numberOfAIndicator: number;
    numberOfGIndicator: number;
    numberOfRIndicator: number;
  };
  financial: {
    capexSpent: string;
    opexSpent: string;
  };
  dtProjectStatistics: {
    count: number;
    status: string;
  }[];
}
