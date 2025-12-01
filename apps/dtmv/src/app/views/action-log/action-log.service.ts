import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ActionLogEntry {
  id: number;
  createdAt: string;
  createdBy: string;
  resourceId: string;
  resourceType: string;
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

  constructor(private http: HttpClient) {}

  getActions(params: {
    page: number;
    size: number;
    user?: string;
    action?: string;
    milestoneName?: string;
  }): Observable<PaginatedResponse<ActionLogEntry> | ActionLogEntry[]> {
    let httpParams = new HttpParams()
      .set('page', String(params.page))
      .set('size', String(params.size))
      .set('system', 'DI_Milestones');
    if (params.user) httpParams = httpParams.set('user', params.user);
    if (params.action) httpParams = httpParams.set('action', params.action);
    if (params.milestoneName)
      httpParams = httpParams.set('milestoneName', params.milestoneName);
    return this.http.get<PaginatedResponse<ActionLogEntry> | ActionLogEntry[]>(
      this.actionsUrl,
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
    const url = `${this.baseUrl}v2/admin/users`;
    const params = new HttpParams().set('system', 'DI_Milestones');
    return this.http.get<{ name: string; email: string }[]>(url, { params });
  }

  getActionTypes(): Observable<{ name: string }[]> {
    const url = `${this.actionsUrl}/types`;
    return this.http.get<{ name: string }[]>(url);
  }
}
