import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ActionLogEntry {
  id: number;
  createdAt: string;
  createdBy: string;
  resourceId: string;
  resourceType: string;
  resourceName?: string;
  action: string;
  payload?: any;
  parameters?: Record<string, any>;
  system: string;
}

export interface PaginatedResponse<T> {
  content?: T[];
  totalElements?: number;
  total?: number;
  items?: T[];
}

@Injectable({ providedIn: 'root' })
export class ActionLogService {
  baseUrl = environment.apiUrl;
  actionsUrl = `${this.baseUrl}v2/dt-milestone-service/actions`;
  auditUrl = `${this.baseUrl}v2/dt-milestone-service/audit`;

  constructor(private http: HttpClient) {}

  getActions(params: {
    page: number;
    size: number;
    user?: string;
    action?: string;
    milestoneName?: string;
  }): Observable<PaginatedResponse<ActionLogEntry> | ActionLogEntry[]> {
    let httpParams = new HttpParams()
      .set('page', String(Math.max(0, params.page - 1)))
      .set('size', String(params.size));
    if (params.user) httpParams = httpParams.set('createdBy', String(params.user));
    if (params.action) httpParams = httpParams.set('action', String(params.action));
    if (params.milestoneName) httpParams = httpParams.set('milestoneName', String(params.milestoneName));

    return this.http.get<PaginatedResponse<ActionLogEntry> | ActionLogEntry[]>(
      this.auditUrl,
      { params: httpParams }
    );
  }

  exportActions(params: {
    user?: string;
    action?: string;
    milestoneName?: string;
  }): Observable<Blob> {
    let httpParams = new HttpParams().set('system', 'DI_Milestones');
    if (params.user) httpParams = httpParams.set('user', params.user);
    if (params.action) httpParams = httpParams.set('action', params.action);
    if (params.milestoneName)
      httpParams = httpParams.set('milestoneName', params.milestoneName);
    return this.http.get(`${this.actionsUrl}/export`, {
      params: httpParams,
      responseType: 'blob',
    });
  }

  getUsers(): Observable<{ name: string; email: string }[]> {
    const url = `${this.baseUrl}v2/dt-milestone-service/audit/users`;
    return this.http.get<{ name: string; email: string }[]>(url);
  }

  getActionTypes(): Observable<{ name: string }[]> {
    const url = `${this.baseUrl}v2/dt-milestone-service/audit/actions`;
    return this.http.get<string[]>(url).pipe(map((arr) => arr.map((name) => ({ name }))));
  }
}
