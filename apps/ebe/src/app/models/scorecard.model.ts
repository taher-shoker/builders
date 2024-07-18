export interface ScorecardTaps
{
  id : number;
  name : string;
}
export interface FinancialScorecardModel
{
  id:number;
  title:string;
  kpisData:KpiModel[]
}
export interface KpiModel
{
  id:number;
  title:string;
  achievedStatus?:number;
  formula?:string;
  actual?:number;
  weight:number;
  unit:string;
  baseline:number | null;
  target:number;
  ceiling:number;
  threshold:number;
}
export interface StrategicScorecardModel
{
  id:number;
  title:string,
  kpisData:KpiModel[]
}
export interface RelationalScorecardModel
{
  id:number;
  title:string,
  kpisData:KpiModel[]
}
export interface OperationalScorecardModel
{
  id:number;
  title:string,
  kpisData:KpiModel[]
}
export interface PrioritiesScorecardModel
{
  id:number;
  title:string,
  kpisData:KpiModel[]
}
