import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { Observable, tap } from 'rxjs';
import {
  OverallScore,
  OverallScoreParams,
} from '../../models/overallScore.model';
import { OverallScoreService } from './overall-score.service';

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
}
