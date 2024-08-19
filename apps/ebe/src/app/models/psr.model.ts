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