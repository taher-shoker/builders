import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
// eslint-disable-next-line @nx/enforce-module-boundaries
// import { environment } from 'apps/d2d/src/environments/environment';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

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
  fmUrl = `${this.baseUrl}/fm`;
  adminUrl = `${this.baseUrl}/admin`;
  endpointAttachments = `${this.baseUrl}/attachment`;

  roles = ['CREATORS', 'APPROVERS', 'ADMINS']; // Current roles in the system

  pendingTasks: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}
  setSystemParam(): HttpParams {
    return new HttpParams().set('system', 'FRAUD_ManagementUsers');
  }
  setSystemTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.adminUrl}/groups`, {
      params: this.setSystemParam(),
    });
  }

  setSystemUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.adminUrl}/users`, {
      params: this.setSystemParam(),
    });
  }

  getCases(filterData?: any) {
    return this.http.get(`${this.fmUrl}/d2dCase/search`, {
      params: filterData,
    });
  }

  getCase(id: string) {
    const options = {};
    return this.http.get<Case>(`${this.fmUrl}/d2dCase/${id}`, options);
  }

  createCase(data: any) {
    const options = {};

    return this.http.post(`${this.fmUrl}/d2dCase`, data, options);
  }

  updateCase(id: string, data: any) {
    const options = {};

    return this.http.put(`${this.fmUrl}/${id}`, data, options);
  }

  deleteCase(id: string) {
    const options = {};
    return this.http.delete(`${this.fmUrl}/${id}`, options);
  }

  getAssigneeTasks(userEmail: string) {
    return this.http.get(`${this.fmUrl}/cwf/task/user/${userEmail}`);
  }

  getTaskByCaseId(caseId: number) {
    return this.http.get(`${this.fmUrl}/cwf/task/${caseId}`);
  }
  updateCaseTask(caseId: number, taskId: number, data: any) {
    return this.http.post(`${this.fmUrl}/cwf/task/${caseId}/${taskId}`, data);
  }

  uploadFile(data: any) {
    const options = {};
    return this.http.post(this.endpointAttachments, data, options);
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
