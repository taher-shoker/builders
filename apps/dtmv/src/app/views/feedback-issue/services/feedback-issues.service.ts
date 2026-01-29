import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/dtmv/src/environments/environment';
import { Observable } from 'rxjs';
import {
  feedbackIssuesAttachment,
  formBody,
  logsResponse,
  ticketCount,
} from '../models/feedback-issue.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FeedbackIssueService {
  baseUrl = environment.apiUrl + 'v2/dt-milestone-service';
  constructor(private http: HttpClient) {}
  getTicketCount(): Observable<ticketCount> {
    return this.http.get<ticketCount>(`${this.baseUrl}/ticket/counts`);
  }
  uploadFile(file: FormData): Observable<feedbackIssuesAttachment> {
    return this.http.post<feedbackIssuesAttachment>(
      `${this.baseUrl}/attachments/ticket`,
      file
    );
  }
  downloadAttachment(id: number) {
    return this.http.get(`${this.baseUrl}/attachments/${id}/download`, {
      responseType: 'blob',
    });
  }
  getAttachment(id: number): Observable<feedbackIssuesAttachment> {
    return this.http.get<feedbackIssuesAttachment>(
      `${this.baseUrl}/attachments/${id}`
    );
  }
  submitFeedbackIssueForm(body: formBody): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ticket/add`, body);
  }
  getAllLogs(
    pageNumber: number,
    ticketType?: string|null
  ): Observable<logsResponse> {
    let params = new HttpParams().set('page', pageNumber.toString());

    if (ticketType && ticketType !== 'ALL') {
      params = params.set('ticketType', ticketType);
    }
    return this.http.get<logsResponse>(`${this.baseUrl}/ticket`, { params });
  }
}
