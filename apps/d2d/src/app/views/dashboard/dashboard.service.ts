import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl = environment.apiUrl;
  endpoint = `${this.baseUrl}`;

  constructor(private http: HttpClient) {}
}
