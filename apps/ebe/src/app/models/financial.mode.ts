export interface CapexOpexModel
{
  capex:CapexModel[];
  opex:OpexModel[];
  tendering:TenderingModel[]
}
export interface CapexModel
{
  accrual:string;
  accrualPercentage:number;
  expenditureSubtype:string;
  spendPercentage:number;
  spending:string;
  totalBudget:string;
}
export interface OpexModel
{
  accrual:string;
  accrualPercentage:number;
  gepAchievedPercentage:number;
  gepTargetPercentage:number;
  spendPercentage:number;
  spending:string;
  totalBudget:string;
  totalGepTarget:number;
  totalSpendingTarget:number;
}
export interface TenderingModel
{
  awardedProjects:number;
  expenditureType:string;
  inProgressProjects:number;
  savedDroppedProjects:number;
  totalAmount:string;
  totalProjects:number;
}