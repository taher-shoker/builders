import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { SharedFormService } from './shared-form.service';

@Injectable({
  providedIn: 'root',
})
export class YearService {
  private yearKey = 'selectedYear';
  private quarterKey = 'selectedQuarter';
  private yearChangeSubject = new Subject<number>();
  private quarterChangeSubject = new Subject<string>();

  constructor(
    private cookieService: CookieService,
    private sharedFormService: SharedFormService
  ) {}

  // setYearQuarter(yearQuarter: string): void {
  //   console.log('yearQuarter', yearQuarter);
  //   const year = yearQuarter;
  //   const quarter = yearQuarter;
  //   this.cookieService.set(this.yearKey, year, { expires: 7, path: '/' });
  //   this.cookieService.set(this.quarterKey, quarter, { expires: 7, path: '/' });
  //   this.yearChangeSubject.next(+year);
  //   this.quarterChangeSubject.next(quarter);
  // }
  setYear(year: string): void {
    this.cookieService.set(this.yearKey, year, { expires: 7, path: '/' });
    this.yearChangeSubject.next(+year);
  }
  setQuarter(quarter:string):void{
    this.cookieService.set(this.quarterKey, quarter, { expires: 7, path: '/' });
    this.quarterChangeSubject.next(quarter);
  }
 
  getSelectedYear(): string | null {
    console.log(
      this.sharedFormService.getForm().controls['year'].value
    );

    return (
      this.cookieService.get(this.yearKey) ||
      this.sharedFormService.getForm().controls['year'].value
    );
  }
  getSelectedQuarter(): string | null {
    return (
      this.cookieService.get(this.quarterKey) ||
      this.sharedFormService.getForm().controls['quarter'].value
    );
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
