import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  OverallScore,
  OverallScoreParams,
} from '../../models/overallScore.model';
import { OverallScoreService } from './overall-score.service';
import {
  KpiDetailsResponse,
  SectorKpisDetailsParams,
} from '../../models/SectorKpisDetails.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private overallScoreService: OverallScoreService
  ) {}

  getOverallScore(params: OverallScoreParams): Observable<OverallScore[]> {
    const httpParams = new HttpParams()
      .set('year', params.year)
      .set('quarter', params.quarter)
      .set('sectorName', params.sectorName);

    return this.http
      .get<OverallScore[]>(this.baseUrl + '/v2/scrs/dashboard/overall-score', {
        params: httpParams,
      })
      .pipe(
        tap((result: OverallScore[]) => {
          this.overallScoreService.setOverallScore(result);
        })
      );
  }

  getSectorKpisDetails(
    params: SectorKpisDetailsParams
  ): Observable<KpiDetailsResponse> {
    let httpParams = new HttpParams();
    if (params.kpiCode) {
      httpParams = new HttpParams()
        .set('year', params.year)
        .set('quarter', params.quarter)
        .set('sectorName', params.sectorName)
        .set('scorecardTitle', params.scorecardTitle)
        .set('kpiCode', params.kpiCode);
    } else {
      httpParams = new HttpParams()
        .set('year', params.year)
        .set('quarter', params.quarter)
        .set('sectorName', params.sectorName)
        .set('scorecardTitle', params.scorecardTitle);
    }
    return this.http.get<KpiDetailsResponse>(
      this.baseUrl + '/v2/scrs/dashboard/sector/kpi-details',
      { params: httpParams }
    );
  }
}
