export interface KPIItem {
  title: string;
  desc: string;
}

export interface KPIDetails {
  yearNum: string;
  programName: string;
  kpiCode: string;
  kpiName: string;
  kpiValue: number;
  kpiTarget: number;
  programStatus: string;
  direction: string;
  kpiOwner: string;
  function: string;
  strategicObjective: string;
  strategicObjectiveRelative: string;
  activationPeriod: string;
  reportingFrequency: string;
  dataSource: string;
  validationAuthority: string;
  custodianEmail: string;
  custodianTitle: string;
  definition: string;
  formula: string;
  baseline: number;
  celing: number;
  values: KpiValue[];
  unit: string;
}

export interface KpiValue {
  yearNum: string;
  kpiValue: number;
  kpiTarget: number;
}
