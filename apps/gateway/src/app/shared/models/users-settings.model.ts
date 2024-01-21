export interface User {
  id?: number | undefined;
  name: string;
  email: string;
  jobTitle: string;
  username: string;
  userGroups: UserGroup[];
}
export interface RequestUser {
  id?: number | undefined;
  name: string;
  email: string;
  jobTitle: string;
  userGroups: { id: string }[];
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
