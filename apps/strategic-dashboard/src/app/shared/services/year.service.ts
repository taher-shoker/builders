import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YearService {
  private yearKey = 'selectedYear';
  private quarterKey='selectedQuarter';
  private yearChangeSubject = new Subject<number>();
  private quarterChangeSubject = new Subject<string>();

  constructor(private cookieService: CookieService) {}

  setYearQuarter(yearQuarter: string): void {
    const year=yearQuarter.split('-')[0];
    const quarter=yearQuarter.split('-')[1];
    this.cookieService.set(this.yearKey, year, { expires: 7, path: '/' });
    this.cookieService.set(this.quarterKey, quarter, { expires: 7, path: '/' });
    this.yearChangeSubject.next(+year);
    this.quarterChangeSubject.next(quarter);
  }

  getSelectedYear(): string | null {
    return this.cookieService.get(this.yearKey) || null;
  }
  getSelectedQuarter(): string | null {
    return this.cookieService.get(this.quarterKey) || null;
  }
  clearYear(): void {
    this.cookieService.delete(this.yearKey, '/');
  }
  clearQuarter(): void {
    this.cookieService.delete(this.quarterKey, '/');
  }

  getYearChangeObservable() {
    return this.yearChangeSubject.asObservable();
  }
  getQuarterChangeObservable() {
    return this.quarterChangeSubject.asObservable();
  }
}
