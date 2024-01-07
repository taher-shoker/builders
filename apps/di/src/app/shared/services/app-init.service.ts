import { Injectable } from '@angular/core';
import { ReportingService } from './reporting.service';

@Injectable()
export class AppInitService {
  constructor(private _reportingService: ReportingService) {}

  Init() {
    return new Promise<void>((resolve, reject) => {
      if (!sessionStorage.getItem('DT-InitLogReport')) {
        console.log('Need for InitLogReport');
        this._reportingService
          .postReport('Authenticcation-Done')
          .subscribe(() => {
            console.log('DT App Init Log');
            sessionStorage.setItem('DT-InitLogReport', '1');
            resolve();
          });
      } else {
        console.log('No need for InitLogReport');
        resolve();
      }
    });
  }
}
