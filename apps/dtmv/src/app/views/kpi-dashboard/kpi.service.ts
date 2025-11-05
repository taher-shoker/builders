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

export interface KpiListItem {
  id: number;
  name: string;
  dimension: string;
}

export interface KpiListResponse {
  content: KpiListItem[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface KpiAttributes {
  unitId: number;
  kpiId: number;
  dimension: string;
  currentValue: number;
  weight: number; // 0..1 (fraction)
  baseline: number;
  target: number;
  ambition: number;
  direction: number;
}

export interface KpiValueRecord {
  progressId: number;
  unitId: number;
  kpiId: number;
  dimension: string;
  year: number;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' | string;
  month: number; // 1..12
  progressDate: string; // ISO date
  value: number;
}

// API models for KPI Log endpoint
export interface KpiLogProgress {
  id: number;
  progressDate: string;
  value: number;
  createdBy: string;
  createDate: string;
  attachments: any[];
}

export interface KpiLog {
  id: number;
  name: string;
  dimension: string;
  weight: number;
  baseline: number;
  target: number;
  ambition: number;
  formula: string;
  createdBy: string;
  direction: number;
  createDate: string;
  updatedBy: string;
  updateDate: string;
  kpiProgresses: KpiLogProgress[];
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

  /**
   * Fetches KPIs list with server-side pagination.
   */
  getKpis(page: number, size: number, unitId: number, dimension?: string): Observable<KpiListResponse> {
    const url = `${this.baseUrl}v2/dt-milestone-service/kpi`;
    const params: Record<string, any> = { page, size, unitId };
    if (dimension && dimension.trim().length > 0) {
      params['dimension'] = dimension.trim();
    }
    return this.http.get<KpiListResponse>(url, { params });
  }

  /**
   * Fetches KPI attributes by KPI ID.
   */
  getKpiAttributes(kpiId: number): Observable<KpiAttributes> {
    const url = `${this.baseUrl}v2/dt-milestone-service/kpi/${kpiId}/attributes`;
    return this.http.get<KpiAttributes>(url);
  }

  /**
   * Fetch KPI values for chart with optional grouping (monthly | quarterly).
   * Defaults to monthly when grouping is not provided.
   */
  getKpiValues(
    kpiId: number,
    grouping?: 'monthly' | 'quarterly'
  ): Observable<KpiValueRecord[]> {
    const base = `${this.baseUrl}v2/dt-milestone-service/kpi/${kpiId}/values`;
    const selectedGrouping = grouping ?? 'monthly';
    const url = `${base}?grouping=${selectedGrouping}`;
    return this.http.get<KpiValueRecord[]>(url);
  }

  /**
   * Fetch KPI activity log details by KPI ID.
   */
  getKpiLog(kpiId: number): Observable<KpiLog> {
    const url = `${this.baseUrl}v2/dt-milestone-service/kpi/log/${kpiId}`;
    return this.http.get<KpiLog>(url);
  }
}