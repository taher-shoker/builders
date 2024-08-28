import { inject, Injectable } from '@angular/core';
import { ChartDetails, PSRDataModel, PSRProjectDetailsModel } from '../models/psr.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class PSRService {
  http = inject(HttpClient);
  getExecuteViewData(): Observable<PSRDataModel[]> {
    return this.http.get<PSRDataModel[]>(
      `${environment.apiUrl}/business-excellence/psr/executiveView`
    );
  }
  getExecuteProjectDetailsData(groupName:string):Observable<PSRProjectDetailsModel[]>
  {
    return this.http.get<PSRProjectDetailsModel[]>(
      `${environment.apiUrl}/business-excellence/psr/executiveViewData/groups/${groupName}`
    );
  }
  downloadExecutiveViewTemplate():Observable<string>
  {
    return this.http.get<string>(
      `${environment.apiUrl}/business-excellence/psr/executiveView/download`,
      { observe: 'body', responseType: 'text' as 'json' }
    );
  }
  downloadProjectDetailsTemplate(projectName:string):Observable<string>
  {
    return this.http.get<string>(
      `${environment.apiUrl}/business-excellence/psr/executiveViewData/groups/${projectName}/download`,
      { observe: 'body', responseType: 'text' as 'json' }
    );
  }
  addNewChartDetails(id:number , body:ChartDetails[]):Observable<ChartDetails[]>
  {
      return this.http.put<ChartDetails[]>(
        `${environment.apiUrl}/business-excellence/psr/executiveViewData/cards/${id}/chart-details`,
        body
      );
  }
  uploadFile(pageType:string , selectedFile: any): Observable<any> {
    const formData = new FormData();
    formData.append('multipartFile', selectedFile, selectedFile.name);
    if(pageType === 'executiveView')
    {
      return this.http.post<any>(
        `${environment.apiUrl}/business-excellence/psr/executiveView/upload`,
        formData
      );
    }
    return this.http.post<any>(
      `${environment.apiUrl}/business-excellence/psr/executiveViewData/upload`,
      formData
    );
  }
}
