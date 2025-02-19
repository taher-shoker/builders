import { inject, Injectable } from '@angular/core';
import { AddProgramModel, AddProjectModel, ChartDetails, ColumnsSchema, PSRDataModel, PSRProjectDetailsModel } from '../models/psr.model';
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
      `${environment.apiUrl}/business-excellence/psr/executiveViewData/groups?groupName=${groupName}`
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
      `${environment.apiUrl}/business-excellence/psr/executiveViewData/groups/download?groupName=${projectName}`,
      { observe: 'body', responseType: 'text' as 'json' }
    );
  }
  addNewChartDetails(id:number , body:ChartDetails[] , groupName:string , programName:string):Observable<ChartDetails[]>
  {
      return this.http.put<ChartDetails[]>(
        `${environment.apiUrl}/business-excellence/psr/executiveViewData/cards/${id}/chart-details?groupName=${groupName}&programName=${programName}`,
        body
      );
  }
  addNewProgram(data:AddProgramModel[]):Observable<any>
  {
      return this.http.post<any>(
        `${environment.apiUrl}/business-excellence/psr/executive`,
        data
      );
  }
  addNewProject(data:AddProjectModel[] , groupName:string):Observable<any>
  {
      return this.http.post<any>(
        `${environment.apiUrl}/business-excellence/psr/executive-data?groupName=${groupName}`,
        data
      );
  }
  editProgram(data:AddProgramModel , programId:number):Observable<any>
  {
      return this.http.put<any>(
        `${environment.apiUrl}/business-excellence/psr/executive/${programId}`,
        data
      );
  }
  deleteProgram(programId:number):Observable<any>
  {
    return this.http.delete<any>(`${environment.apiUrl}/business-excellence/psr/executive/${programId}`);
  }
  deleteProject(projectId:number , groupName:string):Observable<any>
  {
    return this.http.delete<any>(`${environment.apiUrl}/business-excellence/psr/executive-data/${projectId}?groupName=${groupName}`);
  }
  getProgramById(id:number):Observable<PSRDataModel>
  {
    return this.http.get<PSRDataModel>(`${environment.apiUrl}/business-excellence/psr/executive/${id}`);
  }
  updateProject(projectId:number , project:AddProjectModel , groupName:string):Observable<any>
  {
    return this.http.put<any>(`${environment.apiUrl}//business-excellence/psr/executive-data/${projectId}?groupName=${groupName}`,
      project
    );
  }
  getProjectById(gd:string , id:number):Observable<PSRProjectDetailsModel>
  {
    return this.http.get<PSRProjectDetailsModel>(`${environment.apiUrl}/business-excellence/psr/psr-data/group/${id}?groupName=${gd}`);
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
      `${environment.apiUrl}/business-excellence/psr/executiveViewData/upload?groupName=${groupName}`,
      formData
    );
  }
}
