/* eslint-disable @typescript-eslint/no-inferrable-types */
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
// import { environment } from 'apps/d2d/src/environments/environment';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Report } from '../../services/models/report-flow.model';

export interface User {
  id: number;
  email: string;
  name: string;
  jobTitle: string;
  roles?: string[];
  teamName?: null | string;
  userGroups: Group[];
  username: string;
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
  requestTaskAttributes: RequestTaskAttributes[];
  completedDate: Date;
  createdDate: Date;
  lastModified: Date;
  params: RequestTaskParam[];
}

export interface RequestTaskAttributes {
  requestParams: RequestTaskParam[];
}

export interface RequestTaskParamOriginal {
  name: string;
  type?: string;
  constraints?: {
    name: string;
    configuration: boolean;
  }[];
}

export interface RequestTaskParam extends RequestTaskParamOriginal {
  value: string | boolean;
}

export interface MilestoneAttachment {
  fileName: string;
  id: number;
  label: string;
  milestone: ReportDetails;
  uploadDate: string; // it is a Date in a format of : "2024-3-17"
  url: string;
}

export class Actions {
  static readonly approveSLA = new Actions('Approve SLA', 'Approve');
  static readonly rejectSLA = new Actions('Reject SLA', 'Reject');

  static readonly approve = new Actions('Approve', 'Approve');
  static readonly reject = new Actions('Reject', 'Reject');

  static readonly initiatorApprove = new Actions(
    'Initiator Approve',
    'Approve'
  );
  static readonly initiatorReject = new Actions('Initiator Reject', 'Reject');

  static readonly addData = new Actions('Add Data', 'Add Data');

  static readonly editReport = new Actions('Edit Report', 'Edit Report');
  static readonly deleteReport = new Actions('Delete Report', 'Delete Report');

  // private to disallow creating other instances of this type
  private constructor(
    public readonly uniqueTitle: string,
    public readonly displayCaption: string
  ) {}

  toString() {
    return this.uniqueTitle;
  }
}

export interface ReportDetails {
  id: number;
  creatorEmail: string;
  initiatorEmail: string;
  creatorDisplayName: string;
  initiatorDisplayName: string;
  flowId: number;
  reportFlowStatus: string;
  attachments: Attachment[];
  requestCategory: Category;
  requestApprovals: [
    {
      id: number;
      username: string;
      sequence: number;
      status: string;
      userDisplayName: string;
      requestTaskId: number;
      requestTaskAttributes: {
        name: string;
        value: any;
      }[];
      completedDate: Date;
      createdDate: Date;
      lastModified: Date;
    }
  ];
  createdDate: Date;
  lastModifiedDate: Date;
  remainingSteps: number;
  serialNumber: string;
  reportName: string;
  description: string;
  reportSlaDuration: number;
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

export interface PaginatedRecords {
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface Requests extends PaginatedRecords {
  content: {
    id: number;
    creatorEmail: string;
    initiatorEmail: string;
    initiatorDisplayName: string;
    creatorDisplayName: string;
    reportFlowStatus: string;
    reportName: string;
    serialNumber: string;
    attachments: Attachment[];
    requestCategory: Category;
    lastModifiedDate: Date;
    remainingSteps: number;
    flowId: number;
  }[];
}

export interface Category {
  id: number;
  name: string;
  slaDuration: number;
  isDeletable: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  baseUrl = environment.apiUrl;
  adminUrl = `${this.baseUrl}v2/admin`;
  dtUrl = `${this.baseUrl}v2/report-flow-service/`;
  ticketUrl = `${this.baseUrl}ticket/requests/tasks/`;
  requestUrl = `${this.baseUrl}ticket/requests/`;
  endpointAttachments = `${this.baseUrl}v2/report-flow-service/attachments`;

  pendingTasks: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  currentTeam: {
    id: number;
    name: string;
    systemDto: { id: number; name: string };
  };
  remindersItems: Reminders[] = [];

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.currentTeam = this.setUserTeams();
  }

  isDTDirector!: boolean;
  isBusinessSpoc!: boolean;
  isDTAdmin!: boolean;

  getCurrentSystem(): string {
    return JSON.parse(this.cookieService.get('granted-systems') || '')[0];
  }
  getCurrentUser(): User {
    return JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');
  }
  setSystemParam(): HttpParams {
    return new HttpParams().set('system', 'Dynamic_Report_Flow');
  }

  setSystemTeams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminUrl}/teams`, {
      params: this.setSystemParam(),
    });
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.adminUrl}/users`, {
      params: this.setSystemParam(),
    });
  }
  updateUsersDelegates(userId: number | undefined, data: string[]) {
    return this.http.patch(
      `${this.adminUrl}/users/delegates/${userId}`,
      { newDelegates: data },
      {
        params: this.setSystemParam(),
      }
    );
  }
  setUserTeams() {
    const user = JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');
    return user.teams;
  }
  getMilestoneUsersType(): Group[] {
    const user = JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');
    return user.userGroups;
  }

  /**
   *
   * @param role Pass a groupName like ['DT_Director', 'Business_SPOC', 'DT_User', 'DT_VP_Dashboard_Viewer', 'DT_VP_Dashboard_Editor', 'PMO']
   * @returns True if the groupName is assigned to the user.
   */

  userInGroup(role: string): boolean {
    return this.getMilestoneUsersType().find((x) => x.groupName === role)
      ? true
      : false;
  }

  checkIsDirector() {
    if (
      this.getMilestoneUsersType().find((x) => x.groupName === 'DT_Director')
    ) {
      this.isDTDirector = true;
    } else {
      this.isDTDirector = false;
    }
    return this.isDTDirector;
  }

  checkIsBusinessSpoc() {
    if (
      this.getMilestoneUsersType().find((x) => x.groupName === 'Business_SPOC')
    ) {
      this.isBusinessSpoc = true;
    } else {
      this.isBusinessSpoc = false;
    }

    return this.isBusinessSpoc;
  }

  checkIsAdmin() {
    if (
      this.getMilestoneUsersType().find(
        (x) => x.groupName === 'DI_Milestones_Admins'
      )
    ) {
      this.isDTAdmin = true;
    } else {
      this.isDTAdmin = false;
      this.checkIsDirector;
    }
    return this.isDTAdmin;
  }

  createReportFlow(data: any) {
    return this.http.post(`${this.dtUrl}requests`, data);
  }

  addReportSLA(reportId: number, sla: number) {
    return this.http.patch(
      `${this.dtUrl}requests/sla/${reportId}?slaDuration=${sla}`,
      {}
    );
  }

  /**
   *
   * @param filterData Filtration data of the search request
   * @returns Reports either filtered or none if no filters passed.
   */

  getReports(filterData?: any): Observable<Requests> {
    return this.http
      .get<Requests>(`${this.dtUrl}requests/search`, {
        params: filterData,
      })
      .pipe(map((res: Requests) => this.flattenRequestCategory(res)));
  }

  private flattenRequestCategory(data: Requests): Requests {
    return {
      ...data,
      content: data.content.map((item) => ({
        ...item,
        requestCategoryName: item.requestCategory.name,
        requestCategorySla: item.requestCategory.slaDuration ? 'Yes' : 'No',
      })),
    };
  }

  /**
   *
   * @param id of the requested report
   * @returns report details
   */
  getReport(id: string | number): Observable<Report> {
    return this.http.get<Report>(`${this.dtUrl}requests/${id}`);
  }

  /**
   * Fetches all categories, send a boolean for SLA filtration
   */
  getCategories(withSla?: boolean): Observable<Category[]> {
    if (withSla === undefined) {
      return this.http.get<Category[]>(`${this.dtUrl}requests-category`);
    } else {
      return this.http.get<Category[]>(`${this.dtUrl}requests-category`, {
        params: { withSla },
      });
    }
  }

  /**
   *
   * @param category pass valid category object to create a new one
   */
  postCategory(category: Category) {
    return this.http.post(`${this.dtUrl}requests-category`, category);
  }

  /**
   *
   * @param category pass valid category object with its ID in the object to edit it
   */
  editCategory(category: Category) {
    return this.http.patch(`${this.dtUrl}requests-category`, category);
  }

  /**
   *
   * @param categoryId pass valid category id to delete it
   */

  deleteCategory(categoryId: Category['id']) {
    return this.http.delete(`${this.dtUrl}requests-category/${categoryId}`);
  }

  exportMilestones(filterData?: any) {
    return this.http.get(`${this.dtUrl}/export`, {
      params: filterData,
      responseType: 'blob',
    });
  }

  getMilestone(id: string | number) {
    return this.http.get(`${this.dtUrl}/${id}`);
  }

  updateReportFlow(id: number, reportName: string) {
    const options = {
      params: new HttpParams().set('reportName', reportName),
    };
    return this.http.patch(`${this.dtUrl}requests/${id}`, {}, options);
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
    reportId: number | string
  ): Observable<MilestoneAttachment> {
    return this.http.post<MilestoneAttachment>(
      `${this.endpointAttachments}`,
      data
    );
  }

  updateMilestoneProgress(data: {
    reportId: number;
    overallProgress: string;
    deliverable: string;
  }) {
    const headers = new HttpHeaders({ Accept: 'text/plain' });
    return this.http.post(`${this.dtUrl}/updateProgress`, data, {
      responseType: 'text',
    });
  }
  getMilestoneProgress(id: number) {
    return this.http.get(`${this.dtUrl}/progress/${id}`);
  }
  getReportWorkflow(requestId: number): Observable<ReportWorkflow> {
    return this.http.get<ReportWorkflow>(`${this.ticketUrl}${requestId}`);
  }

  getMilestoneTasks(): Observable<PendingTask[]> {
    return this.http.get<PendingTask[]>(`${this.ticketUrl}pending`, {
      params: this.setSystemParam(),
    });
  }

  downloadAttachment(id: number) {
    return this.http.get(
      `${this.endpointAttachments}${id}/download`,
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
  getRemindersData() {
    this.getReminders().subscribe((res) => {
      this.remindersItems = res;
    });
  }
  updateReminders(id: number): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}v2/dt-milestone-service/reminders/read/${id}`,
      {}
    );
  }

  getMilestonesHistory(mielstoneId: number | null) {
    return this.http.get<any>(`${this.requestUrl}history/${mielstoneId}`, {
      params: this.setSystemParam(),
    });
  }

  /**
   * Complete a pending task for certain request in a workflow.
   *
   */

  completePendingTask(
    requestId: string | number,
    requestTaskId: string | number,
    body: RequestTaskAttributes
  ) {
    return this.http.post(
      `${this.ticketUrl}${requestId}/${requestTaskId}`,
      body
    );
  }

  /**
   * Calculate the overall of a milestone without adding records to the database
   */

  calculateMilestoneProgress(
    reportId: number,
    progress: string
  ): Observable<{ milestoneProgressId: number; status: string }> {
    return this.http.get<{ milestoneProgressId: number; status: string }>(
      `${this.dtUrl}/status/${reportId}?overallProgress=${progress}`
    );
    // return of({milestoneProgressId: 5000, status: "Delayed"})
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

  addFile(data: FormData): Observable<UploadResponse> {
    return this.http.post<UploadResponse>(`${this.endpointAttachments}`, data);
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

export interface UploadResponse {
  id: number;
  label: string;
  fileName: string;
  url: string;
  uploadDate: string;
}
export interface Reminders {
  id: number;
  reminderContent: string;
  reminderTitle: string;
  reminderUploadDate: string;
}

export type ReportWorkflow = ReportWorkflowStep[];

export interface ReportWorkflowStep {
  requestTaskId: number;
  status: ReportFlowStatus;
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
  completedDate: Date | null;
  completedByName: string | null;
  createdDate: Date;
  lastModified: Date;
  taskName:
    | 'Add Data'
    | 'Initiator Approve'
    | 'User Approve SLA'
    | 'User Approve'
    | 'Edit or Delete Report Data';
}

export type ReportFlowStatus =
  | 'completed'
  | 'pending'
  | 'breached'
  | 'rejected';

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

export type Attachment = {
  id: number;
  fileName: string;
  url: string;
  label: string;
};

export type Params = {
  requestParams: { name: string; value: number | string | boolean }[];
};
