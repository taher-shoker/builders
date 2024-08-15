import { comment } from '../details/models/commentsModel';

//request models
export interface kpiCard {
  title: string;
  description: string | null;
  class: string;
}
export interface SectorKpisDetailsBase {
  sectorName: string;
  year: string;
  quarter: string;
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
  scorecardTitle: string;
}

export interface KpiDTOMap {
  [kpiSubGrouping: string]: {
    [kpiName: string]: KpiDTO[];
  };
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
  commentList: comment[];
  attachementList: string[] | null;
}

// API Response Model
export interface KpiDetailsResponse {
  keyFilter: KeyFilter;
  kpiDTOMap: KpiDTOMap;
}

export interface CategoryKpiLists {
  [kpiSubGrouping: string]: {
    [kpiName: string]: KpiDTO[];
  };
}

// Define the structure of listItems

export interface ListItem {
  label: string;
  value: number;
}

export interface Section {
  section: string;
  items: ListItem[];
}
