export interface kpiDetailsParams {
  year: string;
  quarter: string;
  sectorName: string;
  scorecardTitle: string;
  kpiCode: string;
}
export interface kpiCard {
  title: string;
  description: string;
  class: string;
}
export interface kpiDetailsResponse{
  keyFilter:keyFilter;
  kpiDTOList:kpiDetails[];
}
export interface keyFilter{
  sectorGroup:string;
  yearNum:number;
  quarterNum:string;
}
export interface kpiDetails {
  definition: string;
  objective: string;
  custodianTitle: string;
  validationAuthority: string;
  subscorecardTitle: string;
  scorecardTitle:string;
  calculationFunction: string;
  dataSource: string;
  direction:string;
  custodianEmail: string;
  reportingFrequency: string;
  reportingPeriod: string;
  vtdCalculation: string;
  formula: string;
  ceiling: string;
  weight: number;
}
