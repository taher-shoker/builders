import { UserAction } from './UserAction';

export class TPUserModel {
  username!: string;
  token!: string;
  value!: string;
  userTeam!: string;
  displayName!: string;
  usermenu!: UserAction[];
  tokenType!: string;
  systems!: string[];
}
