import { inject, Injectable } from '@angular/core';
import {
  RunMultipleTestsResponse,
  RunTestRequest,
} from '../models/run-test.models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.stage';

@Injectable({
  providedIn: 'root',
})
export class RunTestService {
  private readonly apiUrl = `${environment.apiUrl}/api/v2/compliance`;
  private readonly http = inject(HttpClient);

  runMultipleTests(
    request: RunTestRequest[]
  ): Observable<RunMultipleTestsResponse> {
    return this.http.post<RunMultipleTestsResponse>(this.apiUrl, request);
  }
}
