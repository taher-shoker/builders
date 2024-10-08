import { Kpi } from './kpi.model';

export interface StrategicGroup {
  name: string;
  description: string;
  kpis: Kpi[];
}
