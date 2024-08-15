export interface StrategyProgramKpiDetailsModel
{
  id:number;
  description:string;
  weight?:number;
  formula?:string;
  actualStatus?:number;
  projects:StrategyProgramKpiProjectsDetailsModel[];
}
export interface StrategyProgramKpiProjectsDetailsModel
{
  id:number;
  title:string;
  actualValue:number;
  plannedValue:number;
  progressValue:number;
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
