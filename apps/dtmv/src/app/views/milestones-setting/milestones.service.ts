/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

export interface RequestTask {
  requestTaskId: number;
  status: string;
  username: string;
  userDisplayName: string;
  requestTaskAttributes: [
    {
      id: number;
      name: string;
      value: string;
    }
  ];
  completedDate: Date;
  createdDate: Date;
  lastModified: Date;

  params: {
    name: string;
    type: string;
    constraints: [
      {
        name: string;
        configuration: boolean;
      }
    ];
  }[];
}

export enum Actions {
  addEvidence = 'Add Evidence',
  addJustification = 'Add Justification',
  addOnTrack = 'Add Remarks',
  reviewEvidence = 'Approve Evidence',
  reviewJustification = 'Approve Justification',
  reviewOnTrack = 'Approve on Track',
  updateDTRecord = 'Update Record',
  initiateUpdateProgress = 'Update progress',
  approveProgress = 'Approve progress',
  return = 'Return',
  noNeed = 'No Need',
}

@Injectable({
  providedIn: 'root',
})
export class MilestonesService {
  baseUrl = environment.apiUrl;
  adminUrl = `${this.baseUrl}/admin`;
  dtUrl = `${this.baseUrl}/dt-milestone-service/milestones`;
  endpointAttachments = `${this.baseUrl}/fm/attachment`;

  roles = ['CREATORS', 'APPROVERS', 'ADMINS']; // Current roles in the system

  pendingTasks: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  currentTeam: {id: number, name:string, systemDto: {id: number, name: string}};
  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.currentTeam = this.setUserTeams();
    console.log('Dateam', this.currentTeam);
  }

  isDTDirector!: boolean;
  isDTAdmin!: boolean;

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
  setUserTeams() {
    const user = JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');
    return user.teams;
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
  checkIsAdmin() {
    if (this.getMilestoneUsersType() === 'DI_Milestones_Admins') {
      this.isDTAdmin = true;
    } else {
      this.isDTAdmin = false;
      this.checkIsDirector;
    }
  }

  createMilestone(data: any) {
    return this.http.post(`${this.dtUrl}/add`, data);
  }

  addBulkData(data: FormData, relatedTeam: string) {
    const params = new HttpParams().set('relatedTeam', relatedTeam);

    return this.http.post(`${this.dtUrl}/bulk/upload`, data, {
      params,
    });
  }

  getMilestones(filterData?: any) {
    // console.log('filterdata', filterData);
    // if (!filterData) {
    //   filterData = {};
    // }
    // filterData['team'] = this.currentTeam;
    return this.http.get(`${this.dtUrl}`, {
      params: filterData,
    });
  }

  getMilestone(id: string | number) {
    return this.http.get<Case>(`${this.dtUrl}/${id}`);
  }

  updateMilestone(id: string, data: any) {
    return this.http.put(`${this.dtUrl}/update`, {
      id: id,
      ...data,
    });
  }

  deleteMilestone(id: string) {
    return this.http.delete(`${this.dtUrl}/${id}`);
  }

  getAssigneeTasks(userEmail: string) {
    return this.http.get(`${this.baseUrl}/cwf/task/user/${userEmail}`);
  }

  getTaskByCaseId(caseId: number) {
    return this.http.get(`${this.baseUrl}/cwf/task/${caseId}`);
  }
  updateCaseTask(caseId: number, taskId: number, data: any) {
    return this.http.post(`${this.baseUrl}/cwf/task/${caseId}/${taskId}`, data);
  }

  uploadFile(data: any, milestoneId: number | string): Observable<number> {
    return this.http.post<number>(
      `http://localhost:28054/api/v2/dt-milestone-service/attachments?milestoneId=${milestoneId}`,
      data
    );
  }

  updateMilestoneProgress(data: {
    milestoneId: number;
    overallProgress: string;
    deliverable: string;
  }) {
    const headers = new HttpHeaders({ Accept: 'text/plain' });
    return this.http.patch(`${this.dtUrl}/updateProgress`, data, {
      responseType: 'text',
    });
  }

  getMilestoneProgressWorkflow(
    requestId: number
  ): Observable<MilestoneProgressWorkflow> {
    // return this.http.get<MilestoneProgressWorkflow>(
    //   `http://localhost:9084/cem/reporting/apigateway/api/ticket/requests/tasks/pending`

    // );

    return this.http.get<MilestoneProgressWorkflow>(
      `http://localhost:9084/cem/reporting/apigateway/api/ticket/requests/tasks/${requestId}`
    );
  }

  getMilestoneTasks(): Observable<PendingTask[]> {
    return this.http.get<PendingTask[]>(
      `http://localhost:9084/cem/reporting/apigateway/api/ticket/requests/tasks/pending`
    );
  }

  downloadAttachment(id: number) {
    return this.http.get(
      `http://localhost:28054/api/v2/dt-milestone-service/attachments/${id}/download`,
      {
        responseType: 'blob',
      }
    );
  }

  /**
   * Complete a pending task for certain request in a workflow.
   *
   */

  completePendingTask(
    requestId: string | number,
    requestTaskId: string | number,
    body: {
      requestParams: { name: string; value: number | string | boolean }[];
    }
  ) {
    console.warn(body);
    return this.http.post(
      `http://localhost:9084/cem/reporting/apigateway/api/ticket/requests/tasks/${requestId}/${requestTaskId}`,
      body
    );
  }

  /**
   * Final step of approvals in the workflow done by the DT Director
   */

  updateMilestoneRecord(
    requestId: string | number,
    requestTaskId: string | number
  ) {
    return this.http.post(
      `http://localhost:9084/cem/reporting/apigateway/api/ticket/requests/tasks/${requestId}/${requestTaskId}`,
      {
        requestParam: {}, //<< Agreed to send it as empty object
      }
    );
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

export type MilestoneProgressWorkflow = MilestoneProgressWorkflowStep[];

export interface MilestoneProgressWorkflowStep {
  requestTaskId: number;
  status: 'completed' | 'pending';
  username: string;
  userDisplayName: string;
  params: {
    constraints: string[];
    name: string;
    type: string;
  }[];
  requestTaskAttributes: {
    id: number;
    name: string;
    value: string;
  }[];
  completedDate: Date;
  createdDate: Date;
  lastModified: Date;
  taskName: string;
}

export type MilestoneStatus =
  | 'PLANNED'
  | 'DELAYED'
  | 'AT_RISK'
  | 'ON_TRACK'
  | 'COMPLETED';

// export interface File {
//   id: string;
//   fileName: string;
//   url: string;
//   label: string;
// }

export interface PendingTask {
  assignedUser: string;
  createdDate: Date;
  externalSystemId: number;
  flowId: number;
  id: number;
  lastModified: Date;
  params: { name: Actions; type: string; constraints: string[] }[];
  requestParams: {
    creator_username: string;
    milestone_id: string | number;
    milestone_progress_id: string | number;
    team: string;
    status: string;
  };
  taskName: 'Add Remarks';
  taskStatus: 'pending';
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
