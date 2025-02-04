export interface StrategyProgramKpiDetailsModel
{
  strategyProjectName:string;
  keyResultNumber:number;
  description:string;
  weight:number;
  status:string;
  actualStatus:number;
  projects:StrategyProgramKpiProjectsDetailsModel[];
  keyResultName:string;
}
export interface StrategyProgramKpiProjectsDetailsModel
{
  id:number;
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
  id:number;
  strategyProjectName:string;
  currentProgress:number;
  totalWeight:number;
  totalInvestment:number;
  description:string;
}
export interface UpdatedData
{
  actual:number;
  planned:number;
  project:string;
}