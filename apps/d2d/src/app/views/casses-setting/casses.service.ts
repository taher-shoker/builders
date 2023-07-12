import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/d2d/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CassesService {
  baseUrl = environment.apiUrl;
  endpoint = `${this.baseUrl}`;
  endpointAttachments = `${this.baseUrl}/attachment`;

  constructor(private http: HttpClient) {}

  getCasses() {
    const options = {};

    return this.http.get(`${this.endpoint}/d2dCase`, options);
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
};

export enum TaskCicle {
  checkCase = 'Check Case Info',
  fillMoreInfo = 'Fill More Info',
  approveCase = 'Approve Case',
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
