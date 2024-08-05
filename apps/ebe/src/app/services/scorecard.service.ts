import { inject, Injectable } from '@angular/core';
import {
  NavLinks,
  ScorecardModel,
  ScorecardTaps
} from '../models/scorecard.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class ScorecardService {
  private currMode:BehaviorSubject<'editMode' | 'viewMode'> = new BehaviorSubject<'editMode' | 'viewMode'>('viewMode')
  http = inject(HttpClient);
  private readonly scorecardsTaps:ScorecardTaps[] = [
    {
      id: 1,
      name: 'financial',
    },
    {
      id: 2,
      name: 'strategic',
    },
    {
      id: 3,
      name: 'relational',
    },
    {
      id: 4,
      name: 'operational',
    },
    {
      id: 5,
      name: 'corporate priorities',
    },
  ];
  private readonly navItems:NavLinks[] = [
    {
      id : 1,
      name: 'scorecard',
      url: '/scorecard',
    },
    {
      id : 2,
      name: 'CAD strategy program',
      url: '/strategy-program',
    },
    {
      id : 3,
      name: 'raqami',
      url: '/raqami',
    },
    {
      id : 4,
      name: 'PSR',
      url: '/psr',
    },
  ];
  getScorecardsTaps():ScorecardTaps[]
  {
    return this.scorecardsTaps;
  }
  getNavLinks():NavLinks[]
  {
    return this.navItems;
  }
  getScorecardData(groupName:string , month:number , year:number):Observable<ScorecardModel[]>
  {
    return this.http.get<ScorecardModel[]>(`${environment.apiUrl}/business-excellence/scorecards?month=${month}&year=${year}&group=${groupName}`)
  }
  setEditMode(mode:'editMode' | 'viewMode')
  {
    this.currMode.next(mode);
  }
  getCurrentMode():BehaviorSubject<'editMode' | 'viewMode'>
  {
    return this.currMode
  }
  uploadFile(selectedFile:any):Observable<any>
  {
    const formData = new FormData();
    formData.append('multipartFile', selectedFile, selectedFile.name);
    return this.http.post<any>(`${environment.apiUrl}/business-excellence/scorecards/upload` , formData)
  }
}
