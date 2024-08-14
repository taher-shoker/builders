import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie';
import { di_labels, fraud_labels } from '../../shared/constant/labels';
import { Observable } from 'rxjs';
import {
  User,
  RequestUser,
  Team,
  Role,
  UserGroup,
} from '../../shared/models/users-settings.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  endpoint = environment.apiUrl;
  allGroups: UserGroup[] = [];
  allTeams: Team[] = [];
  labels: { label: string; text: string }[] = [];
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getCurrentSystem(): string {
    return JSON.parse(this.cookieService.get('granted-systems') || '')[0];
  }

  setSystemParam(): HttpParams {
    return new HttpParams().set('system', this.getCurrentSystem());
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.endpoint}/users`, {
      params: this.setSystemParam(),
    });
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.endpoint}/users/id/${id}`, {
      params: this.setSystemParam(),
    });
  }

  getUserByUserName(username: string): Observable<User> {
    return this.http.get<User>(`${this.endpoint}/users/username/${username}`, {
      params: this.setSystemParam(),
    });
  }

  createUser(data: RequestUser): Observable<User> {
    return this.http.post<User>(`${this.endpoint}/users`, data);
  }

  updateUser(data: RequestUser): Observable<User> {
    return this.http.put<User>(`${this.endpoint}/users`, data);
  }

  updateUserDelegate(userId: number, data: string[]): Observable<User> {
    return this.http.patch<User>(
      `${this.endpoint}/users/delegates/${userId}`,
      {
        newDelegates: data,
      },
      { params: this.setSystemParam() }
    );
  }

  deleteUser(id: number): Observable<number> {
    return this.http.delete<number>(`${this.endpoint}/users/${id}`, {
      params: this.setSystemParam(),
    });
  }

  getGroups(): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>(`${this.endpoint}/groups`, {
      params: this.setSystemParam(),
    });
  }
  getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.endpoint}/teams`, {
      params: this.setSystemParam(),
    });
  }

  addUserGroup(
    userId: number,
    groupId: number,
    data?: Partial<UserGroup>,
    params?: HttpParams
  ): Observable<User> {
    return this.http.patch<User>(
      `${this.endpoint}/users/groups/${userId}/${groupId}`,
      data,
      { params }
    );
  }

  getTeams(): Team[] {
    let allTeams: Team[] = [];
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
      case 'DI_Milestones':
        allTeams = this.allTeams;
        break;
      default:
        break;
    }
    return _.uniq(allTeams);
  }

  getRoles(): Role[] {
    let allRoles;
    if (
      this.getCurrentSystem() === 'DI_Milestones' ||
      this.getCurrentSystem() === 'Business_Excellence_Dashboard'
    ) {
      allRoles = this.allGroups
        .filter((g) => g.roles[0].roleName !== 'ADMINS')
        .map((t) => {
          return { id: t.id, groupName: t.groupName };
        });
    } else if (this.getCurrentSystem() === 'Dynamic_Report_Flow') {
      allRoles = this.allGroups.filter((g) => g.roles[0].roleName !== 'ADMINS');
    } else {
      allRoles = this.allGroups
        .filter((g) => g.roles[0].roleName !== 'ADMINS')
        .map((t) => {
          return { id: t.roles[0].id, groupName: t.roles[0].roleName };
        });
    }

    return _.uniqWith(allRoles, _.isEqual);
  }

  // functions using in table to get columns data
  getUserPrivilege(user: User): string[] {
    const sys = this.getCurrentSystem();
    const privilege: string[] = [];

    _.forEach(user.userGroups, (group) => {
      if (group.roles[0].system.name === sys) {
        privilege.push(group.roles[0].roleName);
      }
    });
    return privilege;
  }
  getUserTeam(user: User): string | string[] {
    const sys = this.getCurrentSystem();
    const x: string[] = []; // Initialize as an empty array
    if (this.getCurrentSystem() === 'DI_Milestones') {
      _.forEach(user.teams, (team) => {
        x.push(team.name);
      });
    } else if (this.getCurrentSystem() === 'Dynamic_Report_Flow') {
      x.push('-');
    } else {
      _.forEach(user.userGroups, (group) => {
        if (group.roles[0].system.name === sys) {
          x.push(group.groupName);
        }
      });
    }
    return x || '-';
  }

  /**
   * Finds the key in the provided object whose value matches the specified status.
   * @param obj The object to search for the key-value pair.
   * @param status The value to search for in the object's values.
   * @returns The key associated with the matching value, or undefined if not found.
   */
  getKeyByValue(
    obj: Record<string, string>,
    status: string
  ): string | undefined {
    return Object.keys(obj)[Object.values(obj).indexOf(status)];
  }

  // fuction for get labels accordding to the system
  getLabels(): void {
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

  translateText(label: string): string {
    return this.labels.filter((l) => l.label === label)[0]?.text || label;
  }
}
