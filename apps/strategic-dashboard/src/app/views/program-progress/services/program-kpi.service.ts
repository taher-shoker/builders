import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgramKPIDetails } from '../models/program-kpi-details.model';
import { StrategicProgramKPIDetails } from '../models/strategic-program-kpi-details.model';
import { ProgramKPI } from '../models/program-kpi.model';
import { KPIDetails } from '../models/kpi-details.model';

@Injectable({
  providedIn: 'root',
})
export class ProgramKPIService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllStrategicPrograms(params: {
    year: string;
    quarter?: string;
  }): Observable<ProgramKPIDetails[]> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('year', params.year);
    if (params?.quarter) {
      httpParams = httpParams.set('quarter', params.quarter);
    }
    return this.http.get<ProgramKPIDetails[]>(
      this.baseUrl + 'v1/dashboard/program',
      {
        params: httpParams,
      }
    );
  }

  getAllProgramsKPIs(params: {
    programName: string;
  }): Observable<ProgramKPI[]> {
    const httpParams = new HttpParams().set('programName', params.programName);
    return this.http.get<ProgramKPI[]>(
      this.baseUrl + 'v1/dashboard/program/kpi',
      {
        params: httpParams,
      }
    );
  }

  getKPIProgramDetails(params: {
    programName: string;
    year: number;
    quarter?: string;
  }): Observable<StrategicProgramKPIDetails> {
    let httpParams = new HttpParams().set('programName', params.programName);
    httpParams = httpParams.set('year', params.year);
    if (params.quarter) {
      httpParams = httpParams.set('quarter', params.quarter);
    }

    return this.http.get<StrategicProgramKPIDetails>(
      this.baseUrl + 'v1/dashboard/program/detail',
      {
        params: httpParams,
      }
    );
  }

  getKPIDetails(params: { kpiCode: string }): Observable<KPIDetails> {
    const httpParams = new HttpParams().set('kpiCode', params.kpiCode);

    return this.http.get<KPIDetails>(
      this.baseUrl + 'v1/dashboard/strategic/kpi/detail',
      {
        params: httpParams,
      }
    );
  }
}
