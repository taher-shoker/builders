import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivityMonitoringService {
  private readonly apiUrl = `${environment.apiUrl}/v1/Activities`;
  private readonly http = inject(HttpClient);

  getActivities(start?: number, end?: number): Observable<any> {
    let params = new HttpParams();

    if (start !== undefined) {
      params = params.set('start', start.toString());
    }
    if (end !== undefined) {
      params = params.set('end', end.toString());
    }

    return this.http.get(this.apiUrl, { params });
  }
}
