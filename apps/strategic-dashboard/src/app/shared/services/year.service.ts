import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YearService {
  private yearKey = 'selectedYear';
  private yearChangeSubject = new Subject<number>();

  constructor(private cookieService: CookieService) {}

  setYear(year: string): void {
    this.cookieService.set(this.yearKey, year, { expires: 7, path: '/' });
    this.yearChangeSubject.next(+year);
  }

  getSelectedYear(): string | null {
    return this.cookieService.get(this.yearKey) || null;
  }

  clearYear(): void {
    this.cookieService.delete(this.yearKey, '/');
  }

  getYearChangeObservable() {
    return this.yearChangeSubject.asObservable();
  }
}
