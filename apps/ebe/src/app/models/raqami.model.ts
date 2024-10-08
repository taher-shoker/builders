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