export interface TapModel
{
  id : number;
  name : string;
  value : string;
}
export interface NavLinks
{
  id : number;
  name : string;
  url : string;
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
  group:string;
}
export interface UserModel
{
  code:string;
  result:string;
  dto:{
    passwordEncrypted:boolean;
    username:string;
    password:string;
    displayName:string;
    userTeam:string | null;
    source:string;
    userRole:{
      id:number;
      environmentName:string;
    };
    adminTechnical:boolean;
    adminEnvironment:boolean;
    adminOnHisEnvironment:boolean;
    canAddUserEnvironment:boolean;
    canDefinedMenu:boolean;
    canCreateGroupedMenu:boolean;
    id:number;
    lastUsedToken:string;
    activeAccount:boolean;
    systems:[];
    userGroupedMenusDTO:[];
  }
}