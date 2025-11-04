import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TeamSummary {
  id: number;
  name: string;
}

export interface UnitsGroupedCategory {
  category: string;
  teams: TeamSummary[];
}

@Injectable({
  providedIn: 'root',
})
export class KpiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetches units grouped data for KPI Dashboard.
   * Relies on global HTTP interceptor to attach user token.
   */
  getUnitsGrouped(): Observable<UnitsGroupedCategory[]> {
    return this.http.get<UnitsGroupedCategory[]>(
      `${this.baseUrl}v2/dt-milestone-service/units/grouped`
    );
  }
}