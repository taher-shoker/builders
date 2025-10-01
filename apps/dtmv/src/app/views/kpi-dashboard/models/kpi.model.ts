export interface KPI {
  id?: string;
  name?: string;
  description?: string;
  currentValue?: number;
  targetValue?: number;
  progress?: number;
  unit?: string;
  status?: 'on-track' | 'at-risk' | 'delayed';
  lastUpdated?: Date;
  owner?: string;
  category?: string;
}