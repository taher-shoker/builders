import { inject, Injectable } from '@angular/core';
import { PSRDataModel, PSRProjectDetailsModel } from '../models/psr.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class PSRService {
  http = inject(HttpClient);
  PSRDetailsData: PSRProjectDetailsModel[] = [
    {
      id: 1,
      group: 'dg',
      kpiName: 'cover stc subdiaries',
      kpiOwner: 'walid alrashed',
      vendor: 'kpmg',
      kpiStatus: 'execution ',
      indicator: 'r',
      domain: 'Project Health',
      startDate: '2023-01-08',
      endDate: '2024-01-07',
      poAmount: '7.4',
      actual: '1.8',
      chartDetails: [],
      vactual: 55,
      vplanned: 57,
    },
    {
      id: 2,
      group: 'dg',
      kpiName: 'data protection and privacy compliance/build',
      kpiOwner: 'walid alrashed',
      vendor: 'congnizant',
      kpiStatus: 'execution ',
      indicator: 'g',
      domain: 'Project Health',
      startDate: '2023-01-06',
      endDate: '2024-01-07',
      poAmount: '3.4',
      actual: '1',
      chartDetails: [],
      vactual: 80,
      vplanned: 80,
    },
    {
      id: 4,
      group: 'dg',
      kpiName: 'dq hardware sizing and implementation',
      kpiOwner: 'mushari alrashed',
      vendor: 'tcs',
      kpiStatus: 'execution ',
      indicator: 'r',
      domain: 'Project Health',
      startDate: '2023-01-11',
      endDate: '2026-07-10',
      poAmount: '785k',
      actual: '2.4',
      chartDetails: [],
      vactual: 16,
      vplanned: 25,
    },
    {
      id: 3,
      group: 'dg',
      kpiName: 'improve data quality',
      kpiOwner: 'mushari alrashed',
      vendor: 'congnizant',
      kpiStatus: 'planning',
      indicator: 'r',
      domain: 'Project Health',
      startDate: '2023-01-10',
      endDate: '2024-01-08',
      poAmount: '1.9',
      actual: '669',
      chartDetails: [
        {
          id: 1,
          major: 'plan',
          start: 31,
          duration: 47,
          completion_level: 80,
        },
        {
          id: 2,
          major: 'assess',
          start: 36,
          duration: 13,
          completion_level: 80,
        },
        {
          id: 3,
          major: 'data protection',
          start: 50,
          duration: 18,
          completion_level: 80,
        },
        {
          id: 4,
          major: 'data',
          start: 58,
          duration: 22,
          completion_level: 80,
        },
      ],
      vactual: 35,
      vplanned: 38,
    },
  ];
  getExecuteViewData(): Observable<PSRDataModel[]> {
    return this.http.get<PSRDataModel[]>(
      `${environment.apiUrl}/business-excellence/psr/executiveView`
    );
  }
  getExecuteProjectDetailsData(groupName:string):Observable<PSRProjectDetailsModel[]>
  {
    return this.http.get<PSRProjectDetailsModel[]>(
      `${environment.apiUrl}/business-excellence/psr/executiveViewData?group=${groupName}`
    );
  }
}
