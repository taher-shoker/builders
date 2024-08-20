export interface PSRDataModel
{
    id:number;
    title:string;
    chartData:PSRChartDataModel;
    description:string;
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
        startDate:Date;
        endDate:Date;
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