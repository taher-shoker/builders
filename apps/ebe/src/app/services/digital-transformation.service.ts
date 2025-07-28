import { inject, Injectable } from '@angular/core';
import {
  AddKeyChallengeDataModel,
  CreateWorkStreamModel,
  IDigitalTransformationTap,
  KeyChallengesModel,
  pageDetailsModel,
} from '../models/digital-transformation';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DigitalTransformationService {
  http = inject(HttpClient);
  getDigitalTransformationData(): Observable<IDigitalTransformationTap[]> {
    return this.http.get<IDigitalTransformationTap[]>(
      `${environment.apiUrl}/business-excellence/dt/pages`
    );
  }
  getDigitalTransformationDetailsData(
    pageId: number
  ): Observable<pageDetailsModel[]> {
    return this.http.get<pageDetailsModel[]>(
      `${environment.apiUrl}/business-excellence/dt/pages/${pageId}`
    );
  }
  getKeyChallengrsData(
    page = 1,
    pageSize = 10,
    sort = 'desc',
    sortBy?: string
  ): Observable<KeyChallengesModel> {
    if (sortBy) {
      return this.http.get<KeyChallengesModel>(
        `${environment.apiUrl}/business-excellence/dt/pages/keyChallenges?page=${page}&pageSize=${pageSize}&sort=${sort}&sortBy=${sortBy}`
      );
    }
    return this.http.get<KeyChallengesModel>(
      `${environment.apiUrl}/business-excellence/dt/pages/keyChallenges?page=${page}&pageSize=${pageSize}&sort=${sort}`
    );
  }
  addKeyChallengrsData(data: AddKeyChallengeDataModel) {
    return this.http.post<any>(
      `${environment.apiUrl}/business-excellence/dt/pages/keyChallenges`,
      data
    );
  }
  editKeyChallengrsData(id: number, data: AddKeyChallengeDataModel) {
    return this.http.put<any>(
      `${environment.apiUrl}/business-excellence/dt/pages/keyChallenges/${id}`,
      data
    );
  }
  deleteKeyChallengrsData(id: number) {
    return this.http.delete(
      `${environment.apiUrl}/business-excellence/dt/pages/keyChallenges/${id}`
    );
  }
  createNewWorkStream(data: CreateWorkStreamModel) {
    return this.http.post(
      `${environment.apiUrl}/business-excellence/dt/pages/workstream`,
      data
    );
  }
  createNewProjectInWorkStream(
    pageId: number,
    workstreamId: number,
    data: any
  ) {
    return this.http.post(
      `${environment.apiUrl}/business-excellence/dt/pages/workstream/project/${pageId}/${workstreamId}`,
      data
    );
  }
}
