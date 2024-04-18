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

export interface MilestoneAttachment {
  fileName: string;
  id: number;
  label: string;
  milestone: MilestoneDetails;
  uploadDate: string; // it is a Date in a format of : "2024-3-17"
  url: string;
}

// export enum Actions {
//   addEvidence = {uniqueTitle: 'Add Evidence', displayCaption: 'Add Evidence'},
//   addJustification = {uniqueTitle: 'Add Justification', displayCaption: 'Add Justification'},
//   addOnTrack = {uniqueTitle: 'Add Remarks', displayCaption: 'Add Remarks'},
//   reviewEvidence = {uniqueTitle: 'Approve Evidence', displayCaption: 'Approve Evidence'},
//   reviewJustification = {uniqueTitle: 'Approve Justification', displayCaption: 'Approve Justification'},
//   reviewOnTrack = {uniqueTitle: 'Approve on Track', displayCaption: 'Approve on Track'},
//   updateDTRecord = {uniqueTitle: 'Update Record', displayCaption: 'Update Record'},
//   initiateUpdateProgress = {uniqueTitle: 'Update progress', displayCaption: 'Update progress'},
//   approveProgress = {uniqueTitle: 'Approve progress', displayCaption: 'Approve progress'},
//   returnJustification = {uniqueTitle: 'Return Justification', displayCaption: 'Return Justification'},
//   returnEvidence = {uniqueTitle: 'Return Evidence', displayCaption: 'Return Evidence'},
//   returnOnTrack = {uniqueTitle: 'Return Remarks', displayCaption: 'Return Remarks'},
//   noNeed = {uniqueTitle: 'No Need', displayCaption: 'No Need'},
// }

export class Actions {
  static readonly addEvidence = new Actions('Add Evidence', 'Add Evidence');
  static readonly addJustification = new Actions(
    'Add Justification',
    'Add Justification'
  );
  static readonly addOnTrack = new Actions('Add Remarks', 'Add Remarks');
  static readonly reviewEvidence = new Actions('Approve Evidence', 'Approve');
  static readonly reviewJustification = new Actions(
    'Approve Justification',
    'Approve'
  );
  static readonly reviewOnTrack = new Actions('Approve on Track', 'Approve');
  static readonly updateDTRecord = new Actions(
    'Update Record',
    'Update Record'
  );
  static readonly initiateUpdateProgress = new Actions(
    'Update progress',
    'Update progress'
  );
  static readonly approveProgress = new Actions(
    'Approve progress',
    'Approve progress'
  );
  static readonly returnProgress = new Actions('Return progress', 'Return');

  static readonly returnJustification = new Actions(
    'Return Justification',
    'Return'
  );
  static readonly returnEvidence = new Actions('Return Evidence', 'Return');
  static readonly returnOnTrack = new Actions('Return Remarks', 'Return');
  static readonly noNeed = new Actions('No Need', 'No Need');

  // private to disallow creating other instances of this type
  private constructor(
    public readonly uniqueTitle: string,
    public readonly displayCaption: string
  ) {}

  toString() {
    return this.uniqueTitle;
  }
}

// export enum Actions {
//   addEvidence = {id: 1, action: 'Add Evidence'},
//   addJustification = {id: 2, action: 'Add Justification'},
//   addOnTrack = {id: 3, action: 'Add Remarks'},
//   reviewEvidence = {id: 4, action: 'Approve Evidence'},
//   reviewJustification = {id: 5, action: 'Approve Justification'},
//   reviewOnTrack = {id: 6, action: 'Approve on Track'},
//   updateDTRecord = {id: 7, action: 'Update Record'},
//   initiateUpdateProgress = {id: 8, action: 'Update progress'},
//   approveProgress = {id: 9, action: 'Approve progress'},
//   returnJustification = {id: 10, action: 'Return Justification'},
//   returnEvidence = {id: 11, action: 'Return Evidence'},
//   returnOnTrack = {id: 12, action: 'Return Remarks'},
//   noNeed = {id: 13, action: 'No Need'},
// }

export interface MilestoneDetails {
  activityName: string | null;
  createdByEmail: string | null;
  createdByName: string | null;
  deliverable: string | null;
  endDate: Date | null;
  id: number | null;
  lastProgressUpdateDate: Date | null;
  milestoneName: string | null;
  startDate: Date | null;
  status: MilestoneStatus | null;
  teamName: string | null;
  updatedByEmail: null | string;
  updatedByName: null | string;
  weight: number | null;
  workingDays: number | null;
  latestApprovedMilestoneProgressUpdate: null | {
    completionImpactRate: string | null;
    cappedCompletionPercentage: string | null;
    targetCompletionLevel: string | null;
    deliverable: string | null;
    isApproved: boolean | null;
    milestoneId: number | null;
    overallProgress: string | null;
    progressUpdateDate: Date | null;
    workflowId: number | null;
    updatedBy: string;
    status: string;
  };
  currentMilestoneProgressUpdateDTO: null | {
    completionImpactRate: string | null;
    cappedCompletionPercentage: string | null;
    targetCompletionLevel: string | null;
    deliverable: string | null;
    isApproved: boolean | null;
    milestoneId: number | null;
    overallProgress: string | null;
    progressUpdateDate: Date | null;
    workflowId: number | null;
    updatedBy: string;
    status: string;
  };
}

export interface MilestoneAttachment {
  id: number;
  attachmentType: string;
  fileName: string;
  url: string;
  label: string;
  note: string;
  uploadDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class MilestonesService {
  baseUrl = environment.apiUrl;
  adminUrl = `${this.baseUrl}v2/admin`;
  dtUrl = `${this.baseUrl}v2/dt-milestone-service/milestones`;
  ticketUrl = `${this.baseUrl}ticket/requests/tasks/`;
  requestUrl = `${this.baseUrl}ticket/requests/`;
  endpointAttachments = `${this.baseUrl}/fm/attachment`;

  roles = ['CREATORS', 'APPROVERS', 'ADMINS']; // Current roles in the system

  pendingTasks: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  currentTeam: {
    id: number;
    name: string;
    systemDto: { id: number; name: string };
  };
  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.currentTeam = this.setUserTeams();
  }

  isDTDirector!: boolean;
  isBusinessSpoc!: boolean;
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
    return this.isDTDirector;
  }

  checkIsBusinessSpoc() {
    if (this.getMilestoneUsersType() === 'Business_SPOC') {
      this.isBusinessSpoc = true;
    } else {
      this.isBusinessSpoc = false;
    }

    return this.isBusinessSpoc;
  }

  checkIsAdmin() {
    if (this.getMilestoneUsersType() === 'DI_Milestones_Admins') {
      this.isDTAdmin = true;
    } else {
      this.isDTAdmin = false;
      this.checkIsDirector;
    }
    return this.isDTAdmin;
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
    return this.http.get(`${this.dtUrl}`, {
      params: filterData,
    });
  }
  exportMilestones(filterData?: any) {
    return this.http.get(`${this.dtUrl}/export`, {
      params: filterData,
      responseType: 'blob',
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

  uploadFile(
    data: FormData,
    milestoneId: number | string
  ): Observable<MilestoneAttachment> {
    return this.http.post<MilestoneAttachment>(
      `${this.baseUrl}v2/dt-milestone-service/attachments?milestoneId=${milestoneId}`,
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
  getMilestoneProgress(id: number) {
    return this.http.get(`${this.dtUrl}/progress/${id}`);
  }
  getMilestoneProgressWorkflow(
    requestId: number
  ): Observable<MilestoneProgressWorkflow> {
    return this.http.get<MilestoneProgressWorkflow>(
      `${this.ticketUrl}${requestId}`
    );
  }

  getMilestoneTasks(): Observable<PendingTask[]> {
    return this.http.get<PendingTask[]>(`${this.ticketUrl}pending`);
  }

  downloadAttachment(id: number) {
    return this.http.get(
      `${this.baseUrl}v2/dt-milestone-service/attachments/${id}/download`,
      {
        responseType: 'blob',
      }
    );
  }

  getAttachment(id: number): Observable<MilestoneAttachment> {
    return this.http.get<MilestoneAttachment>(
      `${this.baseUrl}v2/dt-milestone-service/attachments/${id}`
    );
  }

  getReminders(): Observable<Reminders[]> {
    return this.http.get<Reminders[]>(
      `${this.baseUrl}v2/dt-milestone-service/reminders`
    );
  }

  updateReminders(id: number): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}v2/dt-milestone-service/reminders/read/${id}`,
      {}
    );
  }

  getMilestonesHistory(mielstoneId: number | null) {
    return this.http.get<any>(`${this.requestUrl}history/${mielstoneId}`);
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
    return this.http.post(
      `${this.ticketUrl}${requestId}/${requestTaskId}`,
      body
    );
  }

  /**
   * Final step of approvals in the workflow done by the DT Director
   */

  updateMilestoneRecord(
    requestId: string | number,
    requestTaskId: string | number,
    isApproveProgress: boolean = false,
    isApprove?: boolean
  ) {
    // return this.http.post(`${this.ticketUrl}${requestId}/${requestTaskId}`, {
    //   requestParam: {}, //<< Agreed to send it as empty object
    // });
    let body: any = {
      requestParam: {},
    };

    if (isApproveProgress) {
      body = {
        requestParams: [
          {
            name: 'is_progress_approved',
            value: isApprove,
          },
        ], //<< Agreed to send it as empty object
      };
    }
    return this.http.post(
      `${this.ticketUrl}${requestId}/${requestTaskId}`,
      body
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

export interface Reminders {
  id: number;
  reminderContent: string;
  reminderTitle: string;
  reminderUploadDate: string;
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
