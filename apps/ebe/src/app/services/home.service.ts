import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardData } from '../models/dashboard';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class HomeService {  
    http = inject(HttpClient);
    getDashboardData():Observable<DashboardData>
    {
        return this.http.get<DashboardData>(`${environment.apiUrl}/business-excellence/mobile/dashboard`);
    }
}