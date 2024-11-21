import { inject, Injectable } from '@angular/core';
import { AddProgramModel, ChartDetails, ColumnsSchema, PSRDataModel, PSRProjectDetailsModel } from '../models/psr.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
@Injectable({ providedIn: 'root' })
export class PSRService {
  programForm!:FormGroup;
  noSpacesValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { noSpaces: true };
  }
  tableHeader:ColumnsSchema[] = [
      {
        key : "id",
        type : "text",
        label : "ID"
      },
      {
        key : "major",
        type : "text",
        label : "Major Activities/Deliverables"
      },
      {
        key : "startDate",
        type : "text",
        label : "Start date"
      },
      {
        key : "endDate",
        type : "text",
        label : "end date"
      },
      {
        key : "completionLevel",
        type : "text",
        label : "Completion Level"
      },
      {
        key : "",
        type : "text",
        label : ""
      },
    ]
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
  addNewProject(data:AddProgramModel[]):Observable<any>
  {
      return this.http.post<any>(
        `${environment.apiUrl}/business-excellence/psr/executive`,
        data
      );
  }
  editProgram(data:AddProgramModel , programId:number):Observable<any>
  {
      return this.http.put<any>(
        `${environment.apiUrl}/business-excellence/psr/edit/executive/${programId}`,
        data
      );
  }
  deleteProgram(programId:number):Observable<any>
  {
      return this.http.delete<any>(`${environment.apiUrl}/business-excellence/psr/executive/${programId}`);
  }
  getProgramById(id:number):Observable<PSRDataModel>
  {
    return this.http.get<PSRDataModel>(`${environment.apiUrl}/business-excellence/psr/executive/${id}`);
  }
  uploadFile(pageType:string , selectedFile: any , groupName?:string): Observable<any> {
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
      `${environment.apiUrl}/business-excellence/psr/executiveViewData/upload/${groupName}`,
      formData
    );
  }
}
