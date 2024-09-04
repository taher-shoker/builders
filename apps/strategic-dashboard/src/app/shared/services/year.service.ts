import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class YearService {
  private yearKey = 'selectedYear';

  constructor(private cookieService: CookieService) {}

  setYear(year: string): void {
    this.cookieService.set(this.yearKey, year, { expires: 7, path: '/' });
  }

  getSelectedYear(): string | null {
    return this.cookieService.get(this.yearKey) || null;
  }

  clearYear(): void {
    this.cookieService.delete(this.yearKey, '/');
  }
}
