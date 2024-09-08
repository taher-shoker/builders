export interface PSRDataModel
{
    planned:number;
    group:string;
    actual:number;
    details:string;
}
export interface PSRChartDataModel
{
    actual:number;
    planned:number;
}
export interface PSRProjectDetailsModel
{
    id:number;
    group:string;
    backgroundColor?:string;
    kpiName:string;
    kpiOwner:string;
    vendor:string;
    kpiStatus:string;
    indicator:string;
    domain:string;
    startDate:string;
    endDate:string;
    poAmount:string;
    actual:string;
    chartDetails:ChartDetails[];
    vactual:number;
    vplanned:number;
    title:string;
}
export interface ChartDetails
{
    id:number;
    major:string;
    start:number;
    duration:number;
    completion_level:number;
    deleteAction?:string;
}
export interface ProgressInfo {
    prefixText: string;
    prefixValue: number | string;
    suffixText: string;
    suffixValue: number | string;
    progressValue: number;
    indexes?: Index[];
    barColor?: string;
    bgBarColor?: string;
  }
export interface Index {
    caption: string;
    value: number;
    position?: 'up' | 'down';
    actualBarColor:string;
  }
export interface AddProjectForm
{
    id:number;
    major:string;
    start:number;
    duration:number;
    completion_level:number;
}
export interface ColumnsSchema {
    key: string;
    type: 'text' | 'date' | 'actions' | 'custom';
    label: string;
  }