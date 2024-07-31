import { inject, Injectable } from '@angular/core';
import {
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
  getScorecardsTaps():ScorecardTaps[]
  {
    return this.scorecardsTaps;
  }
  getScorecardData(group:string , month:number , year:number):Observable<ScorecardModel[]>
  {
    return this.http.get<ScorecardModel[]>(`${environment.apiUrl}/business-excellence/scorecards?month=${month}&year=${year}&group=${group}`)
  }
  setEditMode(mode:'editMode' | 'viewMode')
  {
    this.currMode.next(mode);
  }
  getCurrentMode():BehaviorSubject<'editMode' | 'viewMode'>
  {
    return this.currMode
  }
}
