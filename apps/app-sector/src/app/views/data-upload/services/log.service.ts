import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { logs } from '../models/logModel';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private logSubject = new BehaviorSubject<logs | null>(null);

  get logUpdates(): Observable<logs | null> {
    return this.logSubject.asObservable();
  }

  addLog(log: logs) {
    this.logSubject.next(log);
  }
}
