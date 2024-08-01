interface UserRole {
  id: number;
  environmentName: string;
}

// interface GroupedMenu {
//   id: number;
//   menuItemDefinitionDto: string | number | null;
//   groupedMenuName: string;
//   userGroupedMenus: string | number | null;
//   systemName: string;
// }
// interface UserGroupedMenuDTO {
//   id: number;
//   createdDate: Date | null;
//   modifiedDate: Date | null;
//   createdBy: string | null;
//   modifiedBy: string | null;
//   assigneeUsername: string | null;
//   assigneeUser: string | null;
//   groupedMenu: GroupedMenu;
//   environment: string | null;
// }

interface DTO {
  passwordEncrypted: boolean;
  username: string;
  password: string;
  displayName: string;
  userTeam: string | null;
  source: string;
  userRole: UserRole;
  adminTechnical: boolean;
  adminEnvironment: boolean;
  adminOnHisEnvironment: boolean;
  canAddUserEnvironment: boolean;
  canDefinedMenu: boolean;
  canCreateGroupedMenu: boolean;
  id: number;
  lastUsedToken: string;
  activeAccount: boolean;
  systems: string[];
  userGroupedMenusDTO: UserGroup[];
}

export interface UserData {
  code: string;
  result: string;
  dto: DTO;
}

export interface User {
  id?: number | undefined;
  name: string;
  email: string;
  jobTitle: string;
  username: string;
  userGroups: UserGroup[];
  teams?: UserTeam[];
  userDelegates?: UserDelegates[];
}
export interface UserDelegates {
  delegateName: string;
  systemName: string;
}
export interface RequestUser {
  id?: number | undefined;
  name: string;
  email: string;
  jobTitle: string;
  userGroups: { id: string }[];
  teams?: { id: string }[] | null;
}
export interface UserGroup {
  id: number;
  groupName: string;
  roles: {
    id: number;
    roleName: string;
    system: { id: number; name: string };
  }[];
}
export interface UserTeam {
  id: number;
  name: string;
  systemDto: { id: number; name: string };
}

export type Attachment = {
  id: number;
  fileName: string;
  url: string;
  label: string;
};

export interface filterOption {
  name: string;
  value: string;
  isdefault: boolean;
}

export interface Team {
  id: number;
  name: string;
  roleName: string;
}

export interface Role {
  id: number;
  groupName: string;
}

export type SelectValue = {
  id: number;
  name: string;
  roleName: string;
  groupName: string;
};
