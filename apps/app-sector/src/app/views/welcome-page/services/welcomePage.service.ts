import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/app-sector/src/environments/environment';
import { Observable } from 'rxjs';
import { sectorsList } from '../models/userSector.model';
@Injectable({ providedIn: 'root' })
export class WelcomePageService {
  constructor(private http: HttpClient) {}
  getUserSectors(): Observable<sectorsList> {
    return this.http.get<sectorsList>(
      `${environment.apiUrl}v2/scrs/dashboard/user/sectors`
    );
  }
}
