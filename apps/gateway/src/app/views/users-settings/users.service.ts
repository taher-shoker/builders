import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie';
import { di_labels, fraud_labels } from '../../shared/constant/labels';

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
  labels: { label: string; text: string }[] = [];
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getCurrentSystem(): string {
    return JSON.parse(this.cookieService.get('granted-systems') || '')[0];
  }

  setSystemParam(): HttpParams {
    return new HttpParams().set('system', this.getCurrentSystem());
  }

  getUsers() {
    return this.http.get<User[]>(`${this.endpoint}/users`, {
      params: this.setSystemParam(),
    });
  }

  getUser(id: string) {
    return this.http.get<User>(`${this.endpoint}/users/id/${id}`, {
      params: this.setSystemParam(),
    });
  }

  getUserByUserName(username: string) {
    return this.http.get<User>(`${this.endpoint}/users/username/${username}`, {
      params: this.setSystemParam(),
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
      params: this.setSystemParam(),
    });
  }

  getGroups() {
    return this.http.get<UserGroup[]>(`${this.endpoint}/groups`, {
      params: this.setSystemParam(),
    });
  }

  addUserGroup(userId: number, groupId: number, data?: any) {
    return this.http.patch(
      `${this.endpoint}/users/groups/${userId}/${groupId}`,
      data
    );
  }

  getTeams() {
    let allTeams: { id: number; name: string }[] = [];
    switch (this.getCurrentSystem()) {
      case 'FRAUD_ManagementUsers':
        allTeams = this.allGroups
          .filter((g) => g.groupName !== 'Fraud Admins')
          .map((t) => {
            return {
              id: t.id,
              name: t.groupName,
              roleName: t.roles[0].roleName,
            };
          });
        break;
      case 'DI_Management':
        allTeams = this.allGroups
          .filter((g) => g.groupName !== 'DI_Admins')
          .map((t) => {
            return {
              id: t.id,
              name: t.groupName,
              roleName: t.roles[0].roleName,
            };
          });
        break;
      default:
        break;
    }
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
    const sys = this.getCurrentSystem();
    let x = '';
    _.forEach(user.userGroups, (group) => {
      if (group.roles[0].system.name === sys) {
        x = group.roles[0].roleName;
      }
    });
    return x;
  }
  getUserTeam(user: User) {
    const sys = this.getCurrentSystem();
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

  // fuction for get labels accordding to the system
  getLabels() {
    switch (this.getCurrentSystem()) {
      case 'FRAUD_ManagementUsers':
        this.labels = fraud_labels;
        break;
      case 'DI_Management':
        this.labels = di_labels;
        break;
      default:
        break;
    }
  }

  translateText(label: string) {
    return this.labels.filter((l) => l.label === label)[0]?.text || label;
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
