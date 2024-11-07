import { inject, Injectable } from '@angular/core';
import {BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CapexOpexChart, CapexOpexModel } from '../models/financial.mode';
@Injectable({ providedIn: 'root' })
export class FinancialReportingService {
  http = inject(HttpClient);
  chartData: BehaviorSubject<CapexOpexChart[]> = new BehaviorSubject<CapexOpexChart[]>([]);
  getFinancialReportingData():Observable<CapexOpexModel>
  {
    return this.http.get<CapexOpexModel>(`${environment.apiUrl}/business-excellence/financial`);
  }
}
