export interface KPIValue {
  year: string;
  budgetSpend: number;
  budgetTarget: number;
  completionActual: number;
  completionTarget: number;
}

export interface StrategicProgramKPIDetails {
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
  values: KPIValue[];
}
