export interface KpiModel
{
  id:number;
  title:string;
  kpiStatus:KpiStatusModel[];
  weight:number;
  unit:string;
  baseline:number | null;
  target:number;
  ceiling:number;
  threshold:number;
}
export interface KpiStatusModel
{
  id:string;
  title:string;
  value?:string;
}
