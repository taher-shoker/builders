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
    title:string;
    projectOwner?:string;
    orginazation:string;
    status:string;
    domain:string;
    domainIndicator:string;
    projectTimeline:{
        startDate:string;
        endDate:string;
    };
    spendingStatus:{
        amount:number;
        actual:number;
    };
    progressBarData:{
        actualValue:number;
        plannedValue:number;
        progressValue:number;
        details : {
            id:number;
            majorTitle:string;
            start:number;
            duration:number;
            completeLevel:number;
        }[]
    }
}
export interface ProgressInfo {
    prefixText: string;
    prefixValue: number | string;
    suffixText: string;
    suffixValue: number | string;
    progressValue: number;
    indexes?: Index[];
    barColor?: string;
    bgBarColor?: string
  }
export interface Index {
    caption: string;
    value: number;
    position?: 'up' | 'down'
  }