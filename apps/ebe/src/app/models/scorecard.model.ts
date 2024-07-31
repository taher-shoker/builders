export interface ScorecardTaps
{
  id : number;
  name : string;
}
export interface FileModel
{
  lastModified:number;
  name:string;
  size:number;
  lastModifiedDate?:Date;
  webkitRelativePath:string;
  type:string;
}
export interface ScorecardModel
{
  // id:number;
  title:string;
  kpiDataDTO:KpiModel[]
}
export interface KpiModel
{
  // id:number;
  title:string;
  achievedStatus?:boolean;
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
  // id:number;
  title:string,
  kpiDataDTO:KpiModel[]
}
export interface RelationalScorecardModel
{
  // id:number;
  title:string,
  kpiDataDTO:KpiModel[]
}
export interface OperationalScorecardModel
{
  // id:number;
  title:string,
  kpiDataDTO:KpiModel[]
}
export interface PrioritiesScorecardModel
{
  // id:number;
  title:string,
  kpiDataDTO:KpiModel[]
}
