export interface CapexOpexModel
{
  capexOpex:CapexOpex[];
  tendering:Tendering[]
}
export interface Tendering
{
  awardedProjects:string;
  expenditureType:string;
  inProgressProjects:string;
  savedDroppedProjects:string;
  totalAmount:string;
  totalProjects:string;
}
export interface CapexOpexChart
{
  title:string;
  value1:number;
  value2:number;
  color:string;
}
export interface CapexOpex
{
  accrualPercentage:string;
  expenditureSubtype:string;
  expenditureType:string;
  gepAchieved:number | null;
  gepTarget:number | null;
  spendPercentage:string;
  totalBudget:string;
  totalGepTarget:number | null;
  totalSpendingTarget:number | null;
}