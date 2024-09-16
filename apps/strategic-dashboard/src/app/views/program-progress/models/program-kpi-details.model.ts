import { KPIValue } from "./strategic-program-kpi-details.model";

export interface ProgramKPIDetails {
  yearNum: string;
  quarterNum: string;
  programName: string;
  sector: string;
  unit: string;
  actualValue: number;
  target: number;
  ceiling: number;
  deviation: number;
  greenThreshold: number;
  orangeThreshold: number;
  redThreshold: number;
  kpiPerformanceActual: number;
  kpiPerformanceTarget: number;
  kpiPerformanceCeiling: number;
  kpiPerformanceUnit: string;
  values?: KPIValue[];
}
export interface Progress {
  value: number;
  label?: string;
  bgColor: string;
  target?: number;
}
export interface columnChartData {
  year: string;
  Actual: number;
  Target: number;
}
