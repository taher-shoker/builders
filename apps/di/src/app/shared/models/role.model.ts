import { UnitSectorGroup } from "./http-response.model";

export interface UserRoles {
  email: string;
  id: number;
  jobTitle: string;
  name: string;
  userGroups: UserGroup[];
  username: string;
}

export interface UserGroup {
  id: number;
  groupName: string;
  roles: UserRole[];
}

export interface UserRole {
  id: number;
  roleName: UnitSectorGroup | 'ALL';
  system: { id: number; name: string };
}
