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

export interface UnitProgress {
  unitId: number;
  year: number;
  unitBaseline: number; // 0..1
  unitTarget: number; // 0..1
  diActualProgress: number; // 0..1
}

export interface UnitSeriesItem {
  unitId: number;
  year: number;
  period: number; // month index (1..12) or week number
  dimension: string; // e.g., 'Capability Building', 'Digital Experience & Impact', 'Capability Utilization', 'overall'
  unitBaseline: number; // 0..1
  unitTarget: number; // 0..1
  diActualProgress: number; // 0..1
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

  /**
   * Fetches unit progress by unit ID.
   */
  getUnitProgress(unitId: number): Observable<UnitProgress> {
    return this.http.get<UnitProgress>(
      `${this.baseUrl}v2/dt-milestone-service/units/${unitId}/progress`
    );
  }

  /**
   * Fetches unit series by unit ID.
   * Optionally supports period type filtering (monthly | weekly) via query param if backend supports it.
   */
  getUnitSeries(unitId: number, periodType?: 'monthly' | 'weekly'): Observable<UnitSeriesItem[]> {
    const url = `${this.baseUrl}v2/dt-milestone-service/units/${unitId}/series`;
    const finalUrl = periodType ? `${url}?periodType=${periodType}` : url;
    return this.http.get<UnitSeriesItem[]>(finalUrl);
  }
}