import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface DatesQuery {
  yearFrom: string,
  yearTo: string,
  monthFrom: string,
  monthTo: string,
  dayFrom: string,
  dayTo: string
}

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  constructor(private http: HttpClient) {}

  postReport(pageName: string){
    const bodyObj = {pageName, systemName: "Fraud Management"}
    return this.http.post(`${environment.apiUrl}/report/page`, bodyObj)
  }

  // getReport(datesObj? : DatesQuery){
  //   if(datesObj){
  //     return this.http.get(`${environment.apiUrl}/report/page?dateFrom=${datesObj.yearFrom}-${datesObj.monthFrom}-${datesObj.dayFrom}&dateTo=${datesObj.yearTo}-${datesObj.monthTo}-${datesObj.dayTo}`)
  //   }else{
  //     return this.http.get(`${environment.apiUrl}/report/page`)
  //   }
  // }

  // getLogin(datesObj? : DatesQuery){
  //   if(datesObj){
  //     return this.http.get(`${environment.apiUrl}/report/page?pageName=Authenticcation-Done&dateFrom=${datesObj.yearFrom}-${datesObj.monthFrom}-${datesObj.dayFrom}&dateTo=${datesObj.yearTo}-${datesObj.monthTo}-${datesObj.dayTo}`)
  //   }else{
  //     return this.http.get(`${environment.apiUrl}/report/page?pageName=Authenticcation-Done`)
  //   }
  // }

}
