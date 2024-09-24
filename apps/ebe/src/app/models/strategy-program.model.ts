export interface StrategyProgramKpiDetailsModel
{
  strategyProject:string;
  objective:number;
  description:string;
  weight:number;
  status:string;
  actualStatus:number;
  projects:StrategyProgramKpiProjectsDetailsModel[]
}
export interface StrategyProgramKpiProjectsDetailsModel
{
  project:string;
  actual:number;
  planned:number;
}
export interface StrategyProgramKeyModel
{
  overallProgress:number;
  totalInvestment:number;
}
export interface StrategyProgramModel
{
  key : StrategyProgramKeyModel;
  cadStrategyProgramDTO : StrategyProgramKpiModel[]
}
export interface StrategyProgramKpiModel
{
  strategyProject:string;
  currentProgress:number;
  totalWeight:number;
  totalInvestment:number;
  description:string;
}
