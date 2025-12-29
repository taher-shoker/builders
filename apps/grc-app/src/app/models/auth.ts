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

export interface LoggedUser {
  id: number;
  email: string;
  name: string;
  jobTitle: string;
  roles: string[];
  teamName: null | string;
}
