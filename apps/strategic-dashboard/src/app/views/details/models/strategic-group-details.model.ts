export interface Value {
  year: number;
  actualValue: number;
  target: number;
  score: number;
  unit: string;
  greenThreshold: number;
  orangeThreshold: number;
  redThreshold: number;
}

export interface StrategicGroup {
  strategicGroupName: string;
  name: string;
  code: string;
  greenThreshold: number;
  orangeThreshold: number;
  redThreshold: number;
  values: Value[];
}

export type StrategicGroupDetails = StrategicGroup[];
