import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie';
const data = [
  {
    id: 2,
    groupName: 'Digital Care',
    roles: [
      {
        id: 2,
        roleName: 'CREATORS',
        system: {
          id: 2,
          name: 'FRAUD_ManagementUsers',
        },
      },
    ],
  },
  {
    id: 4,
    groupName: 'Field Operation',
    roles: [
      {
        id: 2,
        roleName: 'CREATORS',
        system: {
          id: 2,
          name: 'FRAUD_ManagementUsers',
        },
      },
    ],
  },
  {
    id: 1,
    groupName: 'Customer Care',
    roles: [
      {
        id: 2,
        roleName: 'CREATORS',
        system: {
          id: 2,
          name: 'FRAUD_ManagementUsers',
        },
      },
    ],
  },
  {
    id: 5,
    groupName: 'Fraud',
    roles: [
      {
        id: 1,
        roleName: 'APPROVERS',
        system: {
          id: 2,
          name: 'FRAUD_ManagementUsers',
        },
      },
    ],
  },
];

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

  getUserByUserName(userName: string) {
    const options = {};
    // return this.http.get<User>(`${this.endpoint}/users/${id}`, options);
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
    const options = {};
    return this.http.delete(`${this.endpoint}/users/${id}`, options);
  }

  getGroups() {
    this.http
      .get<UserGroup[]>(`${this.endpoint}/groups`, {
        params: this.sysParam,
      })
      .subscribe((res) => {
        this.allGroups = res;
      });
  }
  getTeams() {
    const allTeams = this.allGroups.map((t) => {
      return { id: t.id, name: t.groupName };
    });
    return _.uniq(allTeams);
  }
  getRoles() {
    const allRoles = this.allGroups.map((t) => {
      return { id: t.roles[0].id, groupName: t.roles[0].roleName };
    });
    return _.uniqWith(allRoles, _.isEqual);
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
