export interface TapModel {
  id: number;
  name: string;
  value: string;
}
export interface NavLinks {
  id: number;
  name: string;
  url: string;
}
export interface FileModel {
  lastModified: number;
  name: string;
  size: number;
  lastModifiedDate?: Date;
  webkitRelativePath: string;
  type: string;
}
export interface ScorecardModel {
  // id:number;
  title: string;
  kpiDataDTO: KpiModel[];
}
export interface KpiModel {
  // id:number;
  title: string;
  achievedStatus?: boolean;
  formula?: string;
  actual?: number;
  weight: number;
  unit: string;
  baseline: number | null;
  target: number;
  ceiling: number;
  threshold: number;
  group: string;
  details: string | null;
}
export interface UserModel {
  id: number;
  name: string;
  email: string;
  jobTitle: string;
  userGroups: UserGroup[];
  username: string;
  pageAccess: { id: number; name: string; slug: string }[];
}
export interface UserGroup {
  id: number;
  groupName: string;
  roles: UserGroupRoles[];
}
export interface UserGroupRoles {
  id: number;
  roleName: string;
  system: UserGroupSystem;
}
export interface UserGroupSystem {
  id: number;
  name: string;
}
