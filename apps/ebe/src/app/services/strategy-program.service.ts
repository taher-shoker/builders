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
      `${environment.apiUrl}/business-excellence/cad/summary`
    ); 
  }
  getStrategyProgramDetails(summaryName:string):Observable<StrategyProgramKpiDetailsModel[]>
  {
    return this.http.get<StrategyProgramKpiDetailsModel[]>(
      `${environment.apiUrl}/business-excellence/cad/details/${summaryName}`
    );
  }
}
