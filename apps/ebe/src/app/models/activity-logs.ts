export interface ActivityLog
{
    username:string,
    type:string,
    details:string,
    time:string
    oldValue?:string;
    newValue?:string;
}
export interface ColumnsSchema {
    key: string;
    type: 'text' | 'date' | 'actions' | 'custom';
    label: string;
    dateString?: 'longDate';
    actions?: ('edit' | 'delete' | 'details' | 'updateProgress')[];
    complexViewTemp?: any;
  }