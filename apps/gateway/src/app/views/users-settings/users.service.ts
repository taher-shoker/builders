import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie';

export interface UserGroup {
  id: number;
  groupName: string;
  roles: {
    id: number;
    roleName: string;
    system: { id: number; name: string };
  }[];
}
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  baseUrl = environment.apiUrl;
  endpoint = `${this.baseUrl}`;
  endpointAttachments = `${this.baseUrl}/attachment`;
  allGroups: UserGroup[] = [];
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  sysName = JSON.parse(this.cookieService.get('system') || '');
  sysParam = new HttpParams().set('system', this.sysName);

  getUsers() {
    const usersParams = new HttpParams().set('system', this.sysName);
    return this.http.get<User[]>(`${this.endpoint}/users`, {
      params: usersParams,
    });
  }

  getUser(id: string) {
    return this.http.get<User>(`${this.endpoint}/users/id/${id}`, {
      params: this.sysParam,
    });
  }

  getUserByUserName(username: string) {
    return this.http.get<User>(`${this.endpoint}/users/username/${username}`, {
      params: this.sysParam,
    });
  }

  createUser(data: any) {
    const options = {};

    return this.http.post(`${this.endpoint}/users`, data, options);
  }

  updateUser(data: any) {
    const options = {};
    return this.http.put(`${this.endpoint}/users`, data, options);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.endpoint}/users/${id}`, {
      params: this.sysParam,
    });
  }

  getGroups() {
    this.http
      .get<UserGroup[]>(`${this.endpoint}/groups`, {
        params: this.sysParam,
      })
      .subscribe((res) => {
        if (res) {
          this.allGroups = res;
          this.getRoles();
          this.getTeams();
        }
      });
  }

  addUserGroup(userId: number, groupId: number, data?: any) {
    return this.http.patch(
      `${this.endpoint}/users/groups/${userId}/${groupId}`,
      data
    );
  }

  getTeams() {
    const allTeams = this.allGroups
      .filter((g) => g.groupName !== 'Fraud Admins')
      .map((t) => {
        return { id: t.id, name: t.groupName };
      });
    return _.uniq(allTeams);
  }

  getRoles() {
    const allRoles = this.allGroups
      .filter((g) => g.roles[0].roleName !== 'ADMINS')
      .map((t) => {
        return { id: t.roles[0].id, groupName: t.roles[0].roleName };
      });
    return _.uniqWith(allRoles, _.isEqual);
  }

  // functions using in table to get columns data
  getUserPrivilege(user: User) {
    const sys = this.sysName;
    let x = '';
    _.forEach(user.userGroups, (group) => {
      if (group.roles[0].system.name === sys) {
        x = group.roles[0].roleName;
      }
    });
    return x;
  }
  getUserTeam(user: User) {
    const sys = this.sysName;
    let x = '';
    _.forEach(user.userGroups, (group) => {
      if (group.roles[0].system.name === sys) {
        x = group.groupName;
      }
    });
    return x;
  }
  getKeyByValue(obj: any, status: string) {
    return Object.keys(obj)[Object.values(obj).indexOf(status)];
  }
}

export interface User {
  id?: number | undefined;
  name: string;
  email: string;
  username: string;
  userGroups: UserGroup[];
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
