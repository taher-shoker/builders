import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { logs } from '../models/logsModel';


@Injectable({
  providedIn: 'root',
})
export class LogService {
  private logSubject = new BehaviorSubject<logs | null>(null);
 logFailedSubject = new BehaviorSubject<boolean>(false);
  get logUpdates(): Observable<logs | null> {
    return this.logSubject.asObservable();
  }

  addLog(log: logs) {
    this.logSubject.next(log);
  }
}
