export interface NavLinks {
  id: number;
  name: string;
  url: string;
}

export interface TapModel {
  id: number;
  name: string;
  value: string;
}

export interface FileModel {
  lastModified: number;
  name: string;
  size: number;
  lastModifiedDate?: Date;
  webkitRelativePath: string;
  type: string;
}
export interface ScorecardModel {
  // id:number;
  title: string;
  kpiDataDTO: KpiModel[];
}

export interface KpiModel {
  // id:number;
  title: string;
  achievedStatus?: boolean;
  formula?: string;
  actual?: number;
  weight: number;
  unit: string;
  baseline: number | null;
  target: number;
  ceiling: number;
  threshold: number;
  group: string;
  details: string | null;
}
