import { inject, Injectable } from '@angular/core';
import { PSRDataModel, PSRProjectDetailsModel } from '../models/psr.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class PSRService {
  http = inject(HttpClient);
  PSRDetailsData:PSRProjectDetailsModel[] = [
    {
      title : "cover stc subsidiaries with basic data protection and privacy standards",
      projectOwner : "walid alrashed",
      orginazation : "KPMG",
      status : "execution",
      domain : "project health",
      domainIndicator : "R",
      projectTimeline : {
        startDate : "1-Aug-2023",
        endDate : "1-Jun-2024"
      },
      spendingStatus : {
        amount :345234523,
        actual : 34234223
      },
      progressBarData : {
        actualValue : 35,
        plannedValue : 60,
        progressValue : 74,
        details : [
          {
            id : 1,
            majorTitle : "plan, project management, and quality assurance over the project",
            start:31,
            duration:47,
            completeLevel:80,
          },
          {
            id : 2,
            majorTitle : "assess stc subsidiaries maturity & DPP framework",
            start:36,
            duration:13,
            completeLevel:80,
          },
          {
            id : 3,
            majorTitle : "data protection & privacy program design for stc subsidiaries",
            start:50,
            duration:18,
            completeLevel:33,
          },
          {
            id : 4,
            majorTitle : "data protection & privacy program implementation for stc subsidiaries",
            start:58,
            duration:22,
            completeLevel:50,
          },
        ]
      }
    },
    {
      title : "data protection and privacy compliance-build businessrecords of processing assets",
      projectOwner : "walid alrashed",
      orginazation : "cognizant",
      status : "execution",
      domain : "project health",
      domainIndicator : "G",
      projectTimeline : {
        startDate : "1-Iun-2023",
        endDate : "1-Jun-2024"
      },
      spendingStatus : {
        amount :12634424,
        actual : 34534534
      },
      progressBarData : {
        actualValue : 80,
        plannedValue : 80,
        progressValue : 74,
        details : [
          {
            id : 1,
            majorTitle : "plan, project management, and quality assurance over the project",
            start:31,
            duration:47,
            completeLevel:80,
          },
          {
            id : 2,
            majorTitle : "assess stc subsidiaries maturity & DPP framework",
            start:36,
            duration:13,
            completeLevel:80,
          },
          {
            id : 3,
            majorTitle : "data protection & privacy program design for stc subsidiaries",
            start:50,
            duration:18,
            completeLevel:80,
          },
          {
            id : 4,
            majorTitle : "data protection & privacy program implementation for stc subsidiaries",
            start:58,
            duration:22,
            completeLevel:80,
          },
          {
            id : 5,
            majorTitle : "assess stc subsidiaries maturity & DPP framework",
            start:36,
            duration:13,
            completeLevel:80,
          },
        ]
      }
    },
    {
      title : "improve data quality",
      projectOwner : "mushari alrashed",
      orginazation : "cognizant",
      status : "planning",
      domain : "project health",
      domainIndicator : "G",
      projectTimeline : {
        startDate : "1-Iun-2023",
        endDate : "1-Jun-2024"
      },
      spendingStatus : {
        amount :12634424,
        actual : 34534534
      },
      progressBarData : {
        actualValue : 80,
        plannedValue : 80,
        progressValue : 74,
        details : [
          {
            id : 1,
            majorTitle : "plan, project management, and quality assurance over the project",
            start:31,
            duration:47,
            completeLevel:80,
          },
          {
            id : 2,
            majorTitle : "assess stc subsidiaries maturity & DPP framework",
            start:36,
            duration:13,
            completeLevel:80,
          }
        ]
      }
    },
    {
      title : "DQ hardware sizing and implementation",
      projectOwner : "mushari alrashed",
      orginazation : "TCS",
      status : "planning",
      domain : "project health",
      domainIndicator : "R",
      projectTimeline : {
        startDate : "1-Iun-2023",
        endDate : "1-Jun-2024"
      },
      spendingStatus : {
        amount :12634424,
        actual : 34534534
      },
      progressBarData : {
        actualValue : 80,
        plannedValue : 80,
        progressValue : 74,
        details : [
          {
            id : 1,
            majorTitle : "plan, project management, and quality assurance over the project",
            start:31,
            duration:47,
            completeLevel:80,
          }
        ]
      }
    },
  ]
  getExecuteViewData():Observable<PSRDataModel[]>
  {
    return this.http.get<PSRDataModel[]>(`${environment.apiUrl}/business-excellence/psr/executiveView`);
  }
}
