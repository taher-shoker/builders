/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Input, OnInit, forwardRef} from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

const APP_DATE_FORMATS = {
  parse: {
      dateInput: 'DD/MM/YYYY',
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'stc-apps-date-picker-weekly',
  templateUrl: './date-picker-weekly.component.html',
  styleUrls: ['./date-picker-weekly.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },

    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerWeeklyComponent),
      multi: true,
    },
  ],
})
export class DatePickerWeeklyComponent implements OnInit {
  isFirst: boolean = true;
  showCalendar: boolean = false;
  showYearsView: boolean = true;
  showWeeksView: boolean = false;

  selectedDate : string = "Choose year";
  selectedWeek : string = "";
  selectedYear : number | string = "";

  yearsArr : number[] = [];

  @Input() formControlParentalState: FormControl = new FormControl(moment()); // Variable to receive Form control from parent to maintain the last date user has inserted

  day = moment();

  currentYear: number = Number(this.day.format("Y"));
  currentYear2!: number;


  ngOnInit(){
    console.warn("El state", this.formControlParentalState.value)
    this.populateYears()
  }

  populateYears(){

    for(let i = 2011; i <= 2028; i++){
      this.yearsArr.push(i)
    }

    console.log(this.yearsArr)
  }

  cancelCalendar(){
    this.showCalendar = !this.showCalendar;
    this.showYearsView = true;
    this.showWeeksView = false;
    this.resetCalendar();
  }

  resetCalendar(){
    this.selectedDate = "Choose year";
    this.selectedWeek = "";
  }

  setYear(year: string | number){
    year = year.toString()
    this.selectedDate = year
    this.selectedYear = year
    console.log("selected year", this.selectedDate)
  }

  setWeek(week: string | number){
    this.selectedWeek = `Week No: ${week.toString()}`
  }

  increaseYear() {
    if (this.isFirst) {
      this.currentYear = Number(this.currentYear) + 1;
    }

    for (let index = 1; index <= 53; index++) {
      document.getElementById(`${index}day`)?.classList.remove("selectedClass");
    }
    // this.filterObject.frequent = 0;

    // this.calendarService.allFrequentsHolder.next(
    //   JSON.parse(localStorage.getItem("calendarFilter"))
    // );
  }

  decreaseYear() {
    if (this.isFirst) {
      this.currentYear = Number(this.currentYear) - 1;
    }
    for (let index = 1; index <= 53; index++) {
      document.getElementById(`${index}day`)?.classList.remove("selectedClass");
    }
    // this.filterObject.frequent = 0;

    // this.calendarService.allFrequentsHolder.next(
    //   JSON.parse(localStorage.getItem("calendarFilter"))
    // );
  }
}
