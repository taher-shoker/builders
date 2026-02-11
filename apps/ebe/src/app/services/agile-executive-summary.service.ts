import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RadarBubble } from '@stc-apps/shared-ui';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MaturityIndexMetadata {
  overviewScore: number;
  targetProgress: number;
  labels: string[];
  bubbles: RadarBubble[];
}

export interface TimePeriodMetadata {
  years: number[];
  quarters: string[];
}

export interface MaturityIndexResponse {
  id: number;
  lob: string;
  year: number;
  quarter: string;
  strategy: number;
  structure: number;
  processes: number;
  people: number;
  technology: number;
  titleKeyHighlights: string | null;
  keyHighlights: string;
}

export interface MaturityIndexSaveRequest {
  id?: number;
  lob: string;
  year: number;
  quarter: string;
  strategy: number;
  structure: number;
  people: number;
  technology: number;
  processes: number;
  titleKeyHighlights: string;
  keyHighlights: string;
}

export interface OverallMaturityIndexResponse {
  id: number;
  year: number;
  quarter: string;
  overallMaturityScore: number;
  maturityTarget: number;
  strategyScore: number;
  processScore: number;
  technologyScore: number;
  peopleScore: number;
  structureScore: number;
  progressToTarget: number;
}

export interface HeatmapMetadataResponse {
  lineOfBusinesses: string[];
  tribes: string[];
  quarters: string[];
}

export interface HeatmapSummary {
  id: number;
  lob: string;
  tribeName: string;
  year: number;
  quarter: string;
  strategyTotal: number;
  structureTotal: number;
  processesTotal: number;
  peopleTotal: number;
  technologyTotal: number;
  totalTribe: number;
}

export interface HeatmapSquadValue {
  id: number;
  heatmapId: number;
  squadName: string;
  strategy: number;
  structure: number;
  processes: number;
  people: number;
  technology: number;
  totalAverage: number;
}

export interface HeatmapSquadsValuesResponse {
  heatmap: HeatmapSummary;
  squadValues: HeatmapSquadValue[];
}

@Injectable({
  providedIn: 'root',
})
export class AgileExecutiveSummaryService {
  http = inject(HttpClient);

  getTimePeriodMetadata(): Observable<TimePeriodMetadata> {
    return this.http.get<TimePeriodMetadata>(
      `${environment.apiUrl}/business-excellence/agile/executive-summary/time-period-metadata`
    );
  }

  getHeatmapMetadata(
    year: number,
    quarter: string
  ): Observable<HeatmapMetadataResponse> {
    const params = new URLSearchParams({
      year: String(year),
      quarter,
    });
    return this.http.get<HeatmapMetadataResponse>(
      `${
        environment.apiUrl
      }/business-excellence/agile/executive-summary/heatmap-metadata?${params.toString()}`
    );
  }

  getHeatmapMetadataByLOB(
    lineOfBusiness: string,
    year: number,
    quarter: string
  ): Observable<HeatmapMetadataResponse> {
    const params = new HttpParams()
      .set('lineOfBusiness', lineOfBusiness)
      .set('year', String(year))
      .set('quarter', quarter);
    return this.http.get<HeatmapMetadataResponse>(
      `${environment.apiUrl}/business-excellence/agile/executive-summary/heatmap-metadata`,
      { params }
    );
  }

  getAgileMaturityIndex(
    year: number,
    quarter: string,
    lob: string
  ): Observable<MaturityIndexResponse> {
    const params = new URLSearchParams({
      year: String(year),
      quarter,
      lineOfBusiness: lob,
    });

    return this.http.get<MaturityIndexResponse>(
      `${
        environment.apiUrl
      }/business-excellence/agile/executive-summary/maturity-index?${params.toString()}`
    );
  }

  getHeatmapSquadsValues(
    year: number,
    quarter: string,
    lineOfBusiness: string,
    tribe: string
  ): Observable<HeatmapSquadsValuesResponse> {
    let params = new HttpParams()
      .set('year', String(year))
      .set('quarter', quarter);
    if (lineOfBusiness && lineOfBusiness !== 'All') {
      params = params.set('lineOfBusiness', lineOfBusiness);
    }
    if (tribe && tribe !== 'All') {
      params = params.set('tribe', tribe);
    }

    return this.http.get<HeatmapSquadsValuesResponse>(
      `${environment.apiUrl}/business-excellence/agile/executive-summary/heatmap-squads-values`,
      { params }
    );
  }

  getOverallMaturityIndex(
    year: number,
    quarter: string
  ): Observable<OverallMaturityIndexResponse> {
    const params = new URLSearchParams({
      year: String(year),
      quarter,
    });

    return this.http.get<OverallMaturityIndexResponse>(
      `${
        environment.apiUrl
      }/business-excellence/agile/executive-summary/overall-maturity-index?${params.toString()}`
    );
  }

  downloadExecutiveSummaryCsv(dashboardName: string): Observable<string> {
    const params = new URLSearchParams({
      dashboardName,
    });
    return this.http.get<string>(
      `${
        environment.apiUrl
      }/business-excellence/agile/executive-summary/export?${params.toString()}`,
      { observe: 'body', responseType: 'text' as 'json' }
    );
  }

  saveMaturityIndex(body: MaturityIndexSaveRequest): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/business-excellence/agile/executive-summary/maturity-index`,
      body
    );
  }

  importExecutiveSummary(
    dashboardName: string,
    selectedFile: any,
    opts: {
      year: number;
      quarter: string;
      // lineOfBusiness?: string;
      // tribe?: string;
    }
  ): Observable<any> {
    const formData = new FormData();
    formData.append('multipartFile', selectedFile, selectedFile.name);
    formData.append('dashboardName', dashboardName);
    let params = new HttpParams()
      .set('year', String(opts.year))
      .set('quarter', opts.quarter);
    const shouldIncludeContext =
      dashboardName !== 'overall_maturity_index' &&
      dashboardName !== 'executive_summary_performance_heatmap';
    // if (shouldIncludeContext && opts.lineOfBusiness) {
    //   params = params.set('lineOfBusiness', opts.lineOfBusiness);
    // }
    // if (shouldIncludeContext && opts.tribe) {
    //   params = params.set('tribe', opts.tribe);
    // }
    return this.http.post<any>(
      `${environment.apiUrl}/business-excellence/agile/executive-summary/import`,
      formData,
      { params }
    );
  }
}
