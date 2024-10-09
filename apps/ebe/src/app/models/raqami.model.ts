export interface RaqamiKpiData
{
    kpiName:string;
    actual:number;
    status:string;
    theme:string;
    weight:number;
    unit:string;
    baseline:{
        year:number;
        value:number;
    };
    targets:{
        year:number;
        value:number | null;
    }[]
}
export interface A2TapData
{
    title:string;
    owner:string;
    project:string;
    kpiWeight:number;
    UoM:string;
    baseLine:{
        year:number;
        val:number
    };
    targets:{
        year:number;
        val:string;
    }[];
    chartData:A1TapChartData[]
}
export interface A3TapData
{
    title:string;
    // owner:string;
    project:string;
    kpiWeight:number;
    UoM:string;
    baseLine:{
        year:number;
        val:number
    };
    target:Date,
    chartData:A1TapChartData[]
}
export interface A1TapChartData
{
    month:string;
    value1:number;
    value2?:number;
}