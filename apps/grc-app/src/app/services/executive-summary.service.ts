import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { ExecutiveSummaryModel, TapApiModel, TapModel } from '../models';
@Injectable({ providedIn: 'root' })
export class ExecutiveSummaryService {
  http = inject(HttpClient);
  getKriDashboardTaps(): Observable<TapModel[]> {
    return this.http.get<TapApiModel[]>(`${environment.apiUrl}/kri/tabs`).pipe(
      map((res) => {
        return res.map((tap) => ({
          id: tap.id,
          name: tap.tabName,
          value: tap.tabName,
        }));
      })
    );
  }
  getExecutiveSummaryData(
    year: number,
    periodType: string,
    period: string,
    gd: string
  ): Observable<ExecutiveSummaryModel> {
    return this.http.get<ExecutiveSummaryModel>(
      `${environment.apiUrl}/kri/executive-summary?year=${year}&periodType=${periodType}&period=${period}&gd=${gd}`
    );
  }
}
