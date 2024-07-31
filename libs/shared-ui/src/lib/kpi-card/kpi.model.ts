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
export interface KpiStatusModel
{
  id:string;
  title:string;
  value?:string;
}
