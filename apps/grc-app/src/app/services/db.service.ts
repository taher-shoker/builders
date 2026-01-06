import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DbDataModel } from '../models/db';
@Injectable({ providedIn: 'root' })
export class DbService {
  http = inject(HttpClient);
  getKriTapsDetails(
    year: number,
    period: string,
    gd: string,
    sort: string,
    group: 'quarterly' | 'monthly'
  ): Observable<DbDataModel> {
    return this.http.get<DbDataModel>(
      `${environment.apiUrl}/kri/groups/${group}?year=${year}&period=${period}&gd=${gd}&sort=${sort}`
    );
  }
}
