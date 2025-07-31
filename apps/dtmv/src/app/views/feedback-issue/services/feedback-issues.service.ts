import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/dtmv/src/environments/environment';
import { Observable } from 'rxjs';
import { ticketCount } from '../models/feedback-issue.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FeedbackIssueService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  getTicketCount(): Observable<ticketCount> {
    return this.http.get<ticketCount>(`${this.baseUrl}v2/dt-milestone-service/ticket/counts`);
  }
}
