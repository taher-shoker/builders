import { UserGroup } from './users-settings.model';

export interface AuthResponseData {
  token: string;
  displayName: string;
  result: string;
}
export interface LoggedUser {
  id: number;
  email: string;
  name: string;
  jobTitle: string;
  userGroups: UserGroup[];
  username: null | string;
}

export interface System {
  id?: number;
  name: string;
  systemUrl?: string;
  displayName?: string;
  tpGroupedMenuId?: number;
}
