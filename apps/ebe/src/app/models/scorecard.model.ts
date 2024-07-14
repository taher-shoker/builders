export interface ScorecardTaps
{
  id : number;
  name : string;
}
export interface FinancialScorecardModel
{
  title:string;
  costsData:KpiModel[]
}
export interface KpiModel
{
  id:number;
  title:string;
  costStatus:{
    id:string;
    title:string;
    value?:string;
  }[];
  weight:string;
  unit:string;
  baseline:string;
  target:string;
  ceiling:string;
  threshold:string;
}
export interface StrategicScorecardModel
{
  title:string,
  costsData:KpiModel[]
}
export interface RelationalScorecardModel
{
  title:string,
  costsData:KpiModel[]
}
export interface OperationalScorecardModel
{
  title:string,
  costsData:KpiModel[]
}
export interface PrioritiesScorecardModel
{
  title:string,
  costsData:KpiModel[]
}
