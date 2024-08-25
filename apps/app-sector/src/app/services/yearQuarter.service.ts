import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class YearQuarterService {
  private yearKey = 'selectedYear';
  private quarterKey = 'selectedQuarter';

  constructor(private cookieService: CookieService) {}

  setYear(year: string): void {
    this.cookieService.set(this.yearKey, year, { expires: 7, path: '/' });
  }
  setQuarter(quarter: string): void {
    this.cookieService.set(this.quarterKey, quarter, { expires: 7, path: '/' });
  }

  getSelectedYear(): string | null {
    return this.cookieService.get(this.yearKey) || null;
  }
  getSelectedQuarter(): string | null {
    return this.cookieService.get(this.quarterKey) || null;
  }

  clearYearQuarter(): void {
    this.cookieService.delete(this.yearKey, '/');
    this.cookieService.delete(this.quarterKey, '/');
  }
}
