import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
// eslint-disable-next-line @nx/enforce-module-boundaries
// import { environment } from 'apps/d2d/src/environments/environment';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';

export interface User {
  id: number;
  email: string;
  name: string;
  jobTitle: string;
  roles?: string[];
  teamName?: null | string;
  userGroups: Group[];
}

interface Group {
  id: number;
  groupName: string;
  roles: { id: number; roleName: string }[];
}

export interface Team {
  id: number;
  name: 'Filed Operation' | 'Customer Care' | 'Digital Care' | 'Fraud';
}

@Injectable({
  providedIn: 'root',
})
export class CasesService {
  baseUrl = environment.apiUrl;
  dtUrl = `${this.baseUrl}/dt-milestone-service`;
  adminUrl = `${this.baseUrl}/admin`;
  endpointAttachments = `${this.baseUrl}/fm/attachment`;

  roles = ['CREATORS', 'APPROVERS', 'ADMINS']; // Current roles in the system

  pendingTasks: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  isDTDirector!: boolean;
  getCurrentSystem(): string {
    return JSON.parse(this.cookieService.get('granted-systems') || '')[0];
  }

  setSystemParam(): HttpParams {
    return new HttpParams().set('system', 'DI_Milestones');
  }

  setSystemTeams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminUrl}/teams`, {
      params: this.setSystemParam(),
    });
  }
  setUserTeam() {
    const user = JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');
    return user.teams[0].name;
  }
  getMilestoneUsersType() {
    const user = JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');
    return user.userGroups[0].groupName;
  }

  checkIsDirector() {
    if (this.getMilestoneUsersType() === 'DT_Director') {
      this.isDTDirector = true;
    } else {
      this.isDTDirector = false;
    }
  }
  setSystemUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.adminUrl}/users`, {
      params: this.setSystemParam(),
    });
  }

  createMilestone(data: any) {
    return this.http.post(`${this.dtUrl}/milestones/add`, data);
  }
  addBulkData(data: FormData, relatedTeam: string) {
    const params = new HttpParams().set('relatedTeam', relatedTeam);

    return this.http.post(`${this.dtUrl}/milestones/bulk/upload`, data, {
      params,
    });
  }
  getCases(filterData?: any) {
    return this.http.get(`${this.dtUrl}/d2dCase/search`, {
      params: filterData,
    });
  }

  getCase(id: string) {
    const options = {};
    return this.http.get<Case>(`${this.dtUrl}/d2dCase/${id}`, options);
  }

  updateCase(id: string, data: any) {
    const options = {};

    return this.http.put(`${this.dtUrl}/${id}`, data, options);
  }

  deleteCase(id: string) {
    const options = {};
    return this.http.delete(`${this.dtUrl}/${id}`, options);
  }

  getAssigneeTasks(userEmail: string) {
    return this.http.get(`${this.dtUrl}/cwf/task/user/${userEmail}`);
  }

  getTaskByCaseId(caseId: number) {
    return this.http.get(`${this.dtUrl}/cwf/task/${caseId}`);
  }
  updateCaseTask(caseId: number, taskId: number, data: any) {
    return this.http.post(`${this.dtUrl}/cwf/task/${caseId}/${taskId}`, data);
  }

  uploadFile(data: any) {
    return this.http.post(this.endpointAttachments, data);
  }
  getFile(id: any) {
    return this.http.get(`${this.endpointAttachments}/${id}/download`, {
      responseType: 'blob',
    });
  }
  deleteFile(id: any) {
    return this.http.delete(`${this.endpointAttachments}/${id}`);
  }
  getKeyByValue(obj: any, status: string) {
    return Object.keys(obj)[Object.values(obj).indexOf(status)];
  }
}

export interface File {
  id: string;
  fileName: string;
  url: string;
  label: string;
}

export interface Task {
  caseTasksDto: {
    id: number;
    taskName: string;
    taskStatus: string;
    assignedUser: string;
    caseID: 0;
    taskAttributes: [
      {
        attributeName: string;
        attributeValue: string;
        attributeType: string;
        attributeLabel: string;
      }
    ];
    completedDate: Date;
    camundaTaskID: string;
    createdDate: Date;
    lastModifiedDate: Date;
    attachments: Attachment[];
  };
  caseSerialNumber: string;
}

export interface TaskInDetails {
  id: number;
  taskName: string;
  taskStatus: string;
  assignedUser: string;
  caseID: 0;
  taskAttributes: [
    {
      attributeName: string;
      attributeValue: string;
      attributeType: string;
      attributeLabel: string;
    }
  ];
  completedDate: Date;
  completedByName: string;
  camundaTaskID: string;
  createdDate: Date;
  lastModifiedDate: Date;
  attachments: Attachment[];
  caseSerialNumber: string;
}

export interface Case {
  id?: string;
  customerName: string;
  city: string;
  existingServiceOrder: string;
  serviceType: string;
  existingPlate: string;
  existingPhoneNumber: string;
  activationDate: string;
  wfmOrder: string;
  newPlate: string;
  newServiceOrder: string;
  newPhoneNumber: string;
  contactNumber: string;
  caseLabel: string;
  description: string;
  attachments: Attachment[];
  caseStatus: string;
  caseSerialNumber: string;
  type: string;
  creatorTeamName: string;
}

export type Attachment = {
  id: number;
  fileName: string;
  url: string;
  label: string;
};

export enum TaskCicle {
  checkCase = 'Check Case Info',
  fillMoreInfo = 'Fill More Info',
  approveCase = 'Approve Case',
  caseRejected = 'Case Rejected',
  withinSlResponse = 'Within SL Response',
  breanchingSlResponse = 'Breaching SL Response',
  shouldEscalate = 'Should Escalate',
  shouldReEscalate = 'Should Re-Escalate',
  sendToClose = 'Send to Close',
}

export enum CaseStatus {
  registered = <any>'Registered',
  pending = <any>'Pending',
  inprogress = <any>'In Progress',
  closed = <any>'Closed',
}
