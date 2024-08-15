import { inject, Injectable } from '@angular/core';
import { StrategyProgramKpiDetailsModel, StrategyProgramModel } from '../models/strategy-program.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class StrategyProgramService {
  http = inject(HttpClient);
  getStrategyProgramSummary():Observable<StrategyProgramModel>
  {
    return this.http.get<StrategyProgramModel>(
      `${environment.apiUrl}/business-excellence/cadstrategyprograms/summary`
    ); 
  }
  private strategyProgramKpiDetailsModel:StrategyProgramKpiDetailsModel[] = [
    {
      id:1,
      description:'introduce stc brain as an innovation hub to act as accelerator of new businesses and partnerships',
      weight:10,
      formula:'in progress',
      actualStatus:3.5,
      projects : [
        {
          id:1,
          title : "ML-Ops activation plan maturity level",
          actualValue : 10,
          plannedValue : 60,
          progressValue : 20
        },
        {
          id:2,
          title : "ML-Ops activation plan maturity level",
          actualValue : 50,
          plannedValue : 25,
          progressValue : 29
        },
        {
          id:3,
          title : "ML-Ops activation plan maturity level",
          actualValue : 50,
          plannedValue : 66,
          progressValue : 44
        },
      ]
    },
    {
      id:2,
      description:'introduce stc brain as an innovation hub to act as accelerator of new businesses and partnerships',
      weight:10,
      formula:'in progress',
      actualStatus:3.5,
      projects : [
        {
          id:1,
          title : "ML-Ops activation plan maturity level",
          actualValue : 20,
          plannedValue : 23,
          progressValue : 84
        }
      ]
    },
    {
      id:3,
      description:'introduce stc brain as an innovation hub to act as accelerator of new businesses and partnerships',
      weight:10,
      formula:'in progress',
      actualStatus:3.5,
      projects : []
    },
  ]
  getStrategyProgramKpiDetailsModel():StrategyProgramKpiDetailsModel[]
  {
    return this.strategyProgramKpiDetailsModel;
  }
}
