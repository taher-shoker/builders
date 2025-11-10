import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
// New API models for KPI Activity Logs (array response)
export interface KpiActivityAttachment {
  id: number;
  attachmentType: string | null;
  fileName: string;
  url: string;
  label: string;
  note: string | null;
  uploadDate: string; // YYYY-MM-DD
}

export interface KpiActivityLogEntry {
  id: number;
  kpiId: number;
  title: string; // e.g., 'KPI Added', 'KPI Progress Updated', 'KPI Updated'
  details: string | null; // e.g., 'Progress Date: 11/2025<br>Actual Progress: 22.0<br>'
  attachments: KpiActivityAttachment[] | null;
  username: string;
  createdAt: string; // ISO timestamp
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
   * Build full download URL for a KPI attachment using backend base URL.
   * Example: `${BASE_URL}attachements/{id}/download`
   */
  getAttachmentDownloadUrl(id: number): string {
    const attachmentId = Number(id);
    const validId = Number.isFinite(attachmentId) ? attachmentId : Number(String(id).trim());
    return `${this.baseUrl}attachements/${validId}/download`;
  }

  /**
   * Download KPI attachment as Blob using HttpClient.
   */
  downloadAttachment(id: number) {
    return this.http.get(
      `${this.baseUrl}v2/dt-milestone-service/attachments/${id}/download`,
      {
        responseType: 'blob',
      }
    );
  }

  /**
   * Export KPI as Blob using HttpClient.
   */
  exportKPIs(unitId: number) {
    return this.http.get(
      `${this.baseUrl}v2/dt-milestone-service/kpi/${unitId}/export`,
      {
        responseType: 'blob',
      }
    );
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
  getUnitProgress(unitId: number, year?: number): Observable<UnitProgress> {
    const base = `${this.baseUrl}v2/dt-milestone-service/units/${unitId}/progress`;
    const url = year ? `${base}?year=${year}` : base;
    return this.http.get<UnitProgress>(url);
  }

  /**
   * Fetches unit series by unit ID.
   * Optionally supports period type filtering (monthly | weekly) via query param if backend supports it.
   */
  getUnitSeries(unitId: number, periodType?: 'monthly' | 'weekly', year?: number): Observable<UnitSeriesItem[]> {
    const url = `${this.baseUrl}v2/dt-milestone-service/units/${unitId}/series`;
    const params: string[] = [];
    if (periodType) params.push(`periodType=${periodType}`);
    if (typeof year === 'number') params.push(`year=${year}`);
    const finalUrl = params.length ? `${url}?${params.join('&')}` : url;
    return this.http.get<UnitSeriesItem[]>(finalUrl);
  }

  /**
   * Fetches KPIs list with server-side pagination.
   */
  getKpis(
    page: number,
    size: number,
    unitId: number,
    dimensions?: string[],
    year?: number
  ): Observable<KpiListResponse> {
    const url = `${this.baseUrl}v2/dt-milestone-service/kpi`;
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('unitId', String(unitId));

    if (Array.isArray(dimensions) && dimensions.length > 0) {
      const cleaned = dimensions
        .map((d) => (d ?? '').trim())
        .filter((d) => d.length > 0);
      if (cleaned.length > 0) {
        params = params.set('dimension', cleaned.join(','));
      }
    }

    if (typeof year === 'number') {
      params = params.set('year', String(year));
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
  getKpiLog(kpiId: number): Observable<KpiActivityLogEntry[]> {
    const url = `${this.baseUrl}v2/dt-milestone-service/kpi/log/${kpiId}`;
    return this.http.get<KpiActivityLogEntry[]>(url);
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
   * Delete KPI by ID
   */
  deleteKpi(kpiId: number): Observable<any> {
    const url = `${this.baseUrl}v2/dt-milestone-service/kpi/${kpiId}`;
    return this.http.delete(url);
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
