export interface ScorecardTaps
{
  id : number;
  name : string;
}
export interface FinancialScorecardModel
{
  title:string;
  costsData:CostModel[]
}
export interface CostModel
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
  title:string
}
export interface RelationalScorecardModel
{
  title:string
}
export interface OperationalScorecardModel
{
  title:string
}
export interface PrioritiesScorecardModel
{
  title:string
}
