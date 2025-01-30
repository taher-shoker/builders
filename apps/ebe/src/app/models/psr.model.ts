export interface PSRDataModel
{
    id?:number;
    planned:number | null;
    sector:string;
    actual:number;
    details:string;
    plannedDate:string | null;
}
export interface PSRChartDataModel
{
    actual:number | null;
    planned:number | null;
}
export interface PSRProjectDetailsModel
{
    actualSpending:string;
    // actual:string;
    backgroundColor?:string;
    chartDetails:ChartDetails[];
    domain:string;
    endDate:string;
    gd:string;
    id:number;
    indicator:string | null;
    poAmount:string;
    projectName:string;
    projectOwner:string;
    // projectStatus:string;
    projectStage:string;
    sector:string;
    startDate:string;
    vactual:number;  
    vendor:string;
    vplanned:number;
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
export interface ChartDetails
{
    id:number;
    major:string;
    startDate:string | null;
    endDate:string | null;
    deleteAction?:string;
    completionLevel:number;
}
export interface AddProjectForm
{
    id:number;
    major:string;
    startDate:string | null;
    endDate:string | null;
    completionLevel:number;
    deleteAction?:string;
}
export interface ColumnsSchema {
    key: string;
    type: 'text' | 'date' | 'actions' | 'custom';
    label: string;
}
export interface AddProgramModel
{
    id?:number;
    sector:string;
    details:string;
    plannedDate:string;
}
export interface ProgramModel
{
    id?:number;
    sector:string;
    details:string;
    plannedDate:Date;
}
export interface AddProjectModel
{
    sector: string, 
    // gd: string , 
    projectName : string,
    projectOwner : string ,
    vendor : string ,
    projectStage : string ,
    indicator : string | null,
    // backgroundColor : string ,
    domain : string ,
    startDate : string ,
    endDate : string ,
    poAmount : string ,
    actualSpending : string
}