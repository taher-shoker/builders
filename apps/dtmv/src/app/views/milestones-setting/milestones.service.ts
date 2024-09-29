/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// eslint-disable-next-line @nx/enforce-module-boundaries
// import { environment } from 'apps/d2d/src/environments/environment';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, delay, map, of } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import {
  StreamsResponse,
  HighlightImpactReport,
  MilestoneAttachment,
  MilestoneProgressWorkflow,
  PendingTask,
  HighlightImpartReportResponse,
  Reminders,
  ReportData,
  ReportDataWorkflow,
} from '../../services/models/milestones.models';

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
export class MilestonesService {
  baseUrl = environment.apiUrl;
  adminUrl = `${this.baseUrl}v2/admin`;
  vpUrl = `${this.baseUrl}v2/dt-milestone-service/vpDashboard/`;
  dtUrl = `${this.baseUrl}v2/dt-milestone-service/milestones`;
  ticketUrl = `${this.baseUrl}ticket/requests/tasks/`;
  requestUrl = `${this.baseUrl}ticket/requests/`;
  endpointAttachments = `${this.baseUrl}/fm/attachment`;

  roles = ['CREATORS', 'APPROVERS', 'ADMINS']; // Current roles in the system

  pendingTasks: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  remindersItems: Reminders[] = [];

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  isDTDirector!: boolean;
  isBusinessSpoc!: boolean;
  isVPViewer!: boolean;

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
    return this.http.get<any[]>(`${this.adminUrl}/users/teams/sys`, {
      params: this.setSystemParam(),
    });
    // const user = JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');
    // return user.teams;
  }
  getMilestoneUsersType(): Group[] {
    const user = JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');
    return user.userGroups;
  }

  checkIsDirector() {
    console.warn(this.getMilestoneUsersType());
    if (
      this.getMilestoneUsersType().find((x) => x.groupName === 'DT_Director')
    ) {
      this.isDTDirector = true;
    } else {
      this.isDTDirector = false;
    }
    return this.isDTDirector;
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

  createMilestone(data: any) {
    return this.http.post(`${this.dtUrl}/add`, data);
  }

  addBulkData(data: FormData, relatedTeam: string) {
    const params = new HttpParams().set('relatedTeam', relatedTeam);

    return this.http.post(`${this.dtUrl}/bulk/upload`, data, {
      params,
    });
  }

  /**
   * Returns all of the streams of the DTMV system.
   */
  getDTStreams(teamName: string, year: number): Observable<StreamsResponse> {
    const params = new HttpParams()
      .set('teamName', teamName)
      .set('year', year.toString());

    return this.http.get<StreamsResponse>(`${this.vpUrl}activities`, {
      params,
    });
  }

  /**
   *
   * @param team Pass the required team if user has multi teams
   * @param year pass the year of the filtration
   * @returns the data of the report and extra related info.
   */
  getReportData(team: string, year: number): Observable<ReportData> {
    return this.http.get<ReportData>(
      `${this.vpUrl}reportData/latest/${year}/${team}`
    );
  }

  /**
   * Posts the report data and gives back the BE response.
   * @param reportData pass the required props.
   */
  postHighlightOrImpact(
    reportData: HighlightImpactReport
  ): Observable<HighlightImpartReportResponse> {
    return this.http.post<HighlightImpartReportResponse>(
      `${this.vpUrl}reportData`,
      reportData
    );
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
    return this.http.get(`${this.dtUrl}/${id}`);
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
    return this.http.post(`${this.dtUrl}/updateProgress`, data, {
      responseType: 'text',
    });
  }
  getMilestoneProgress(id: number) {
    return this.http.get(`${this.dtUrl}/progress/${id}`);
  }

  /**
   * @param requestId pass the workflow ID
   * @returns the milestone workflow data and state
   */
  getMilestoneProgressWorkflow(
    requestId: number
  ): Observable<MilestoneProgressWorkflow> {
    return this.http.get<MilestoneProgressWorkflow>(
      `${this.ticketUrl}${requestId}`
    );
  }

  /**
   * @param requestId pass the workflow ID
   * @returns the workflow data and state
   */
  getVPReportWorkflow(requestId: number): Observable<ReportDataWorkflow[]> {
    return this.http
      .get<ReportDataWorkflow[]>(`${this.ticketUrl}${requestId}`)
      .pipe(
        map((res: ReportDataWorkflow[]) =>
          res.filter((item) => item.status === 'completed')
        )
      );
  }

  /**
   * @param requestId pass the workflow ID
   * @returns the workflow data and state
   */
  getPendingVPReportWorkflowItem(
    requestId: number
  ): Observable<ReportDataWorkflow | undefined> {
    return this.http
      .get<ReportDataWorkflow[]>(`${this.ticketUrl}${requestId}`)
      .pipe(
        map((res: ReportDataWorkflow[]) =>
          res?.find((item) => item.status === 'pending')
        )
      );
  }

  getMilestoneTasks(): Observable<PendingTask[]> {
    return this.http.get<PendingTask[]>(`${this.ticketUrl}pending`, {
      params: this.setSystemParam(),
    });
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
   * Calculate the overall of a milestone without adding records to the database
   */

  calculateMilestoneProgress(
    milestoneId: number,
    progress: string
  ): Observable<{ milestoneProgressId: number; status: string }> {
    return this.http.get<{ milestoneProgressId: number; status: string }>(
      `${this.dtUrl}/status/${milestoneId}?overallProgress=${progress}`
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
export { HighlightImpactReport, PendingTask, MilestoneAttachment };
