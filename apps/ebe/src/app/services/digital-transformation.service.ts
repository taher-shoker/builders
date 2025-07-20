import { inject, Injectable } from '@angular/core';
import {
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
  getKeyChallengrsData(): Observable<KeyChallengesModel[]> {
    return this.http.get<KeyChallengesModel[]>(
      `${environment.apiUrl}/business-excellence/dt/pages/keyChallenges`
    );
  }
}
