import { inject, Injectable } from '@angular/core';
import { StrategyProgramKpiDetailsModel, StrategyProgramKpiProjectsDetailsModel, StrategyProgramModel, UpdatedData } from '../models/strategy-program.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class StrategyProgramService {
  http = inject(HttpClient);
  clickedProjects:BehaviorSubject<StrategyProgramKpiProjectsDetailsModel[]> = new BehaviorSubject<StrategyProgramKpiProjectsDetailsModel[]>([]);
  clickedProject:BehaviorSubject<any> = new BehaviorSubject<any>({});
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
  downloadStrategyProgram():Observable<string>
  {
    return this.http.get<string>(
      `${environment.apiUrl}/business-excellence/cad/summary/download`,
      { observe: 'body', responseType: 'text' as 'json' }
    );
  }
  downloadStrategyProgramDetails(groupName:string):Observable<string>
  {
    return this.http.get<string>(
      `${environment.apiUrl}/business-excellence/cad/details/${groupName}/download`,
      { observe: 'body', responseType: 'text' as 'json' }
    );
  }
  uploadCadSummaryFile(selectedFile: any): Observable<any> {
    const formData = new FormData();
    formData.append('multipartFile', selectedFile, selectedFile.name);
    return this.http.post<any>(
      `${environment.apiUrl}/business-excellence/cad/summary/upload`,
      formData
    );
  }
  uploadCadSummaryDetailsFile(selectedFile: any , cadTitle:string): Observable<any> {
    const formData = new FormData();
    formData.append('multipartFile', selectedFile, selectedFile.name);
    return this.http.post<any>(
      `${environment.apiUrl}/business-excellence/cad/details/${cadTitle}/upload`,
      formData
    );
  }
  updateProjects(projectName:string , objective:number , data:UpdatedData[]):Observable<UpdatedData[]>
  {
    return this.http.put<UpdatedData[]>(
      `${environment.apiUrl}/business-excellence/cad/projectName/${projectName}/objective/${objective}/projects`,
      data
    );
  }
}
