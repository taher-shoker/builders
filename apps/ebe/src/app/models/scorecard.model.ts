export interface ScorecardTaps
{
  id : number;
  name : string;
}
export interface FinancialScorecardModel
{
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
  title:string,
  kpisData:KpiModel[]
}
export interface RelationalScorecardModel
{
  title:string,
  kpisData:KpiModel[]
}
export interface OperationalScorecardModel
{
  title:string,
  kpisData:KpiModel[]
}
export interface PrioritiesScorecardModel
{
  title:string,
  kpisData:KpiModel[]
}
