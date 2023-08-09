import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  baseUrl = environment.apiUrl;
  endpoint = `${this.baseUrl}`;
  endpointAttachments = `${this.baseUrl}/attachment`;

  constructor(private http: HttpClient) {}

  getUsers(filterData?: any) {
    return this.http.get(`${this.endpoint}/users`, {
      params: filterData,
    });
  }

  getUser(id: string) {
    const options = {};
    return this.http.get<User>(`${this.endpoint}/users/${id}`, options);
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
    const options = {};
    return this.http.get<any>(`${this.endpoint}/groups`, options);
  }
  getRoles() {
    const options = {};
    return this.http.get<any>(`${this.endpoint}/users/roles`, options);
  }
  getTeams() {
    const options = {};
    return this.http.get<any>(`${this.endpoint}/users/teams`, options);
  }

  getKeyByValue(obj: any, status: string) {
    return Object.keys(obj)[Object.values(obj).indexOf(status)];
  }
}

export interface User {
  id?: number | undefined;
  name: string;
  email: string;
  userGroups: any;
  teamDto: any;
}

export type Attachment = {
  id: number;
  fileName: string;
  url: string;
  label: string;
};

export interface EmpFilter {
  name: string;
  options: any[];
  defaultValue: string;
  labelName: string;
  key: string;
}

export interface filterOption {
  name: string;
  value: string;
  isdefault: boolean;
}

export const teamsOptions = [
  {
    id: 1,
    name: 'Filed Operation',
  },
  {
    id: 2,
    name: 'Customer Care',
  },
  {
    id: 3,
    name: 'Digital Care',
  },
  {
    id: 4,
    name: 'Fraud',
  },
];
