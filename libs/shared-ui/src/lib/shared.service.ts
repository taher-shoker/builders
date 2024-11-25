import { inject, Injectable } from '@angular/core';
import {BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class SharedService {
  http = inject(HttpClient);
  chartData: BehaviorSubject<{
    title:string;
    value1:number;
    value2:number;
    color:string;
  }[]> = new BehaviorSubject<{
    title:string;
    value1:number;
    value2:number;
    color:string;
  }[]>([]);
}