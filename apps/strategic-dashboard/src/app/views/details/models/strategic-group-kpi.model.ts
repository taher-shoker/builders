export interface StrategicGroupKPI {
  strategicGroupName: string;
  name: string;
  code: string;
  year: number;
  actualValue: number;
  target: number;
  score: number;
  unit: string;
  greenThreshold: number;
  orangeThreshold: number;
  redThreshold: number;
}
