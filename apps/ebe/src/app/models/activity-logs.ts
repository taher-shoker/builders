export interface ActivityLogRes
{
    data:ActivityLogData[];
    pageNumber:number;
    pageSize:number;
    totalElements:number;
    totalPages:number;
}
export interface ActivityLogData
{
    id:number;
    module:string;
    username:string;
    activityType:string;
    activityDetails:string;
    timestamp:string;
    oldValue?:string;
    newValue?:string;
    attribute?:string;
    entity?:string;
    subModule?:string;
}
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
export interface Program
{
    id:number;
    strategyProjectName:string;
    sector:string;
}
export interface KeyResult
{
    keyResultNumber:number;
    keyResultName:string;
}
export interface KeyResultProject
{
    id:number;
    name:string;
    projectName:string;
}