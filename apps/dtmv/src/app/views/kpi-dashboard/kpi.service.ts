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

// Payload model for updating KPI progress
export interface UpdateKpiProgressPayload {
  value: string;
  progressDate: string; // format MM/YYYY
  attachmentIds?: number[];
}

// Payload model for creating a KPI
export interface CreateKpiPayload {
  name: string;
  ambition: string;
  formula: string;
  dimension: string;
  weight: string;
  currentValue: string;
  baseline: string;
  target: string;
  unitId: number;
  direction: number;
}

// Payload model for updating a KPI (exclude currentValue)
export interface UpdateKpiPayload {
  name: string;
  ambition: string;
  formula: string;
  dimension: string;
  weight: string;
  baseline: string;
  target: string;
  unitId: number;
  direction: number;
  currentValue:string;
}

// Response model for KPI details (GET /kpi/{id})
export interface KpiDetailsResponse {
  id: number;
  name: string;
  dimension: string;
  weight: number;
  baseline: number;
  target: number;
  ambition: number;
  formula: string;
  direction: number; // 1 or -1
}

// Response model for attachment upload
export interface KpiProgressAttachmentResponse {
  id: number;
  milestone: any;
  fileName: string;
  url: string;
  label: string;
  uploadDate: string;
  ticket: any;
  fileSize: number;
  kpiProgress: any;
  attached: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class KpiService {
  private baseUrl = environment.apiUrl;
  private currentUnitId: number | null = null;

  constructor(private http: HttpClient) {}

  setCurrentUnitId(id: number | null): void {
    this.currentUnitId = id;
  }

  getCurrentUnitId(): number | null {
    return this.currentUnitId;
  }

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

  /**
   * Update KPI progress value for a given KPI.
   * Expects progressDate in MM/YYYY format and optional attachment IDs.
   */
  updateKpiProgress(
    kpiId: number,
    payload: UpdateKpiProgressPayload
  ): Observable<any> {
    const url = `${this.baseUrl}v2/dt-milestone-service/kpi/${kpiId}/progress`;
    return this.http.post(url, payload);
  }

  /**
   * Create a new KPI.
   */
  createKpi(payload: CreateKpiPayload): Observable<any> {
    const url = `${this.baseUrl}v2/dt-milestone-service/kpi`;
    return this.http.post(url, payload);
  }

  /**
   * Fetch single KPI details by ID
   */
  getKpiById(kpiId: number): Observable<KpiDetailsResponse> {
    const url = `${this.baseUrl}v2/dt-milestone-service/kpi/${kpiId}`;
    return this.http.get<KpiDetailsResponse>(url);
  }

  /**
   * Update KPI by ID
   */
  updateKpi(kpiId: number, payload: UpdateKpiPayload): Observable<any> {
    const url = `${this.baseUrl}v2/dt-milestone-service/kpi/${kpiId}`;
    return this.http.put(url, payload);
  }

  /**
   * Upload a single attachment for KPI progress and return its metadata (including id).
   * Files are sent as multipart/form-data under the 'file' field.
   */
  uploadKpiProgressAttachment(file: File): Observable<KpiProgressAttachmentResponse> {
    const url = `${this.baseUrl}v2/dt-milestone-service/attachments/kpi-progress`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<KpiProgressAttachmentResponse>(url, formData);
  }
}
