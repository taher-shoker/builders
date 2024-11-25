import { inject, Injectable } from '@angular/core';
import {BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CapexOpexModel } from '../models/financial.mode';
import saveAs from 'file-saver';
@Injectable({ providedIn: 'root' })
export class FinancialReportingService {
  http = inject(HttpClient);
  getFinancialReportingData():Observable<CapexOpexModel>
  {
    return this.http.get<CapexOpexModel>(`${environment.apiUrl}/business-excellence/financial`);
  }
  downloadFinancialReportingData()
  {
    this.http.get<any>(
      `${environment.apiUrl}/business-excellence/financial/download`,
      { responseType: 'blob' as 'json' }
    ).subscribe({
      next : response => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'financial-reporting.xlsx');
      }
    });
  }
  uploadCadSummaryFile(selectedFile: any): Observable<any> {
    const formData = new FormData();
    formData.append('multipartFile', selectedFile, selectedFile.name);
    return this.http.post<any>(
      `${environment.apiUrl}/business-excellence/financial/upload`,
      formData
    );
  }
}
