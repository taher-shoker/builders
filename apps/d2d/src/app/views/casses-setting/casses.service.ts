import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// eslint-disable-next-line @nx/enforce-module-boundaries
// import { environment } from 'apps/d2d/src/environments/environment';
import { environment } from '../../../environments/environment';

export interface User{
  id: 5,
  email: string,
  name: string,
  jobTitle: string,
  roles: string[],
  teamName: null | string
}

export interface Team {
    id: number,
    name: "Filed Operation" | "Customer Care" | "Digital Care" | "Fraud"
}

@Injectable({
  providedIn: 'root',
})
export class CassesService {
  baseUrl = environment.apiUrl;
  endpoint = `${this.baseUrl}`;
  endpointAttachments = `${this.baseUrl}/attachment`;

  loggedInUser!: User | null;
  teams : Team[] = []
  roles = ["CREATORS", "APPROVERS", "ADMINS"] // Current roles in the system

  constructor(private http: HttpClient) {}

  getLoggedInUser(): User{
    return this.loggedInUser!;
  }

  setLoggedInUser(): void{
    const userRes = this.http.get<User>(`${this.endpoint}/users/currentUser`);
    userRes.subscribe((res : User) => {
      this.loggedInUser = res
      console.log("The current logged user :", res)

      if(this.loggedInUser.roles.includes("APPROVERS")){
        this.setSystemTeams(); // Since the user is of team APPROVERS, we need to feed the teams to the system. else don't !
      }
    })
  }

  getSystemTeams(): Team[]{
    return this.teams!;
  }

  setSystemTeams(): void{
    const teamsRes = this.http.get<Team[]>(`${this.endpoint}/users/teams`);
    teamsRes.subscribe((res : Team[]) => {
      this.teams = res
      console.log("The current logged user :", res)
    })
  }


  getCasses(filterData?: any) {
    return this.http.get(`${this.endpoint}/d2dCase/search`, {
      params: filterData,
    });
  }

  getCasse(id: string) {
    const options = {};
    return this.http.get<Casse>(`${this.endpoint}/d2dCase/${id}`, options);
  }

  createCasse(data: any) {
    const options = {};

    return this.http.post(`${this.endpoint}/d2dCase`, data, options);
  }

  updateCasse(id: string, data: any) {
    const options = {};

    return this.http.put(`${this.endpoint}/${id}`, data, options);
  }

  deleteCasse(id: string) {
    const options = {};
    return this.http.delete(`${this.endpoint}/${id}`, options);
  }

  getAssigneeTasks(userName = 'demo') {
    return this.http.get(`${this.endpoint}/cwf/task/user/${userName}`);
  }
  getTaskByCaseId(caseId: number) {
    return this.http.get(`${this.endpoint}/cwf/task/${caseId}`);
  }
  updateCaseTask(caseId: number, data: any) {
    return this.http.post(`${this.endpoint}/cwf/task/${caseId}`, data);
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
}

export interface Casse {
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
