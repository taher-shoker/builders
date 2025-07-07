export interface ColumnsSchema {
  key: string;
  type: 'text' | 'date' | 'actions' | 'custom';
  label: string;
  dateString?: 'longDate';
  actions?: ('edit' | 'delete' | 'details' | 'updateProgress')[];
  complexViewTemp?: any;
}
