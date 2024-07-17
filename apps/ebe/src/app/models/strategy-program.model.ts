export interface StrategyProgramKpiDetailsModel
{
  id:number;
  description:string;
  weight:number;
  formula:string;
  actualStatus:number;
}
export interface StrategyProgramModel
{
  title:string;
  overallProgress:number;
  totalInvestments:number;
  strategyProgramKpiModel:StrategyProgramKpiModel[];
}
export interface StrategyProgramKpiModel
{
  id:number;
  title:string;
  currentProgress:number;
  totalWeight:number;
  totalInvestments:number;
  description:string;
}
