import { Injectable } from '@angular/core';
import { ReportingService } from './reporting.service';

@Injectable()
export class AppInitService {
  constructor(private _reportingService: ReportingService) {}

  Init() {
    console.log('init app init');
    return new Promise<void>((resolve, reject) => {
      if (!sessionStorage.getItem('Fraud-InitLogReport')) {
        console.log('Need for InitLogReport');
        this._reportingService
          .postReport('Authenticcation-Done')
          .subscribe(() => {
            console.log('Fraud App Init Log');
            sessionStorage.setItem('Fraud-InitLogReport', '1');
            resolve();
          });
      } else {
        console.log('No need for InitLogReport');
        resolve();
      }
    });
  }
}
