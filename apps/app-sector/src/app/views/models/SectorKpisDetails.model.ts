import { OverallScoreParams } from './overallScore.model';

//request models
export interface SectorKpisDetailsBase extends OverallScoreParams {
  scorecardTitle: string;
}

export interface SectorKpisDetailsWithKpiCode extends SectorKpisDetailsBase {
  kpiCode: string;
}

export interface SectorKpisDetailsWithoutKpiCode extends SectorKpisDetailsBase {
  kpiCode?: undefined;
}

export type SectorKpisDetailsParams =
  | SectorKpisDetailsWithKpiCode
  | SectorKpisDetailsWithoutKpiCode;

//response models
export interface KeyFilter {
  sectorGroup: string;
  yearNum: string;
  quarterNum: string;
}

export interface KpiDTO {
  scorecardTitle: string;
  kpiCode: string;
  weight: number;
  score: number;
  kpiName: string;
  kpiSubGrouping: string;
  kpiStatus: string;
  direction: string;
  actualPerf: number;
  appliedPerf: number;
  actualValue: number;
  unit: string;
  target: number;
  ceiling: number;
  definition: string;
  objective: string;
  custodianTitle: string;
  validationAuthority: string;
  subscorecardTitle: string | null;
  calculationFunction: string;
  dataSource: string;
  custodianEmail: string;
  reportingFrequency: string;
  reportingPeriod: string;
  vtdCalculation: string;
  formula: string;
}

export interface kpiDetailsResponse {
  keyFilter: KeyFilter;
  kpiDTOList: KpiDTO[];
}
