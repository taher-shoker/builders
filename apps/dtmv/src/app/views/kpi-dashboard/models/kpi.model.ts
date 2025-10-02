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

export interface DialogConfig {
  width?: string;
  height?: string;
  disableClose?: boolean;
  data?: any;
}

export interface DialogResult<T = any> {
  success: boolean;
  data?: T;
  action?: 'save' | 'delete' | 'cancel';
}

export interface KpiFormDialogData {
  kpi?: KPI;
  mode: 'add' | 'edit';
}