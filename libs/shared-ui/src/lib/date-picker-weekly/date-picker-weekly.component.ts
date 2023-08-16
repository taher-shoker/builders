/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, EventEmitter, OnInit, Output, forwardRef} from '@angular/core';
// import { FormControl } from '@angular/forms';
// import * as moment from 'moment';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { LanguageManagerService } from '@stc-apps/lng-selector';

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

export interface YearObj{
  yearNum: number,
  id: number
}

export interface WeeklyDateObj {
  year: string | number,
  week: string | number
}

export interface YearRangeObj{
  fromDate: WeeklyDateObj,
  toDate: WeeklyDateObj,
}

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

  @Output() date: EventEmitter<string> = new EventEmitter<string>();
  // @Input() formControlParentalState: FormControl = new FormControl(moment()); // Variable to receive Form control from parent to maintain the last date user has inserted

  showCalendar: boolean = false;
  langDirection: string = 'en';

  showYearsView: boolean = true;
  showWeeksView: boolean = false;

  stringifiedDate : string = "Choose year"; // That prop mixes the selectedWeek and selectedYearNo for the template-view
  selectedWeek : string = ""; // That prop holds the text of Week no:

  selectedYearNo : number | string = "";
  selectedWeekNo : string | number = "";

  selectedYearObject!: YearObj;
  yearsArr : YearObj[] = [];
  showSaveButton: boolean = false;

  constructor(private langService: LanguageManagerService){}

  ngOnInit(){
    this.populateYears()

    this.langService.currentLanguageStream.subscribe(res => {
      this.langDirection = res;
    })
  }

  populateYears(){
    for(let yearNum = 2023, i = 0; yearNum <= new Date().getFullYear(); yearNum++, i++){
      this.yearsArr.push({yearNum: yearNum, id: i})
    }
  }

  cancelCalendar(){
    this.closeCalendar();
    this.resetCalendar();
  }

  showYearView(){
    this.showYearsView = true;
    this.showWeeksView = false;
  }

  showWeekView(){
    this.showYearsView = false;
    this.showWeeksView = true;
    this.showSaveButton = false;
  }

  closeCalendar(){
    this.showCalendar = !this.showCalendar;
  }

  resetCalendar(){

    this.showYearView();
    this.showSaveButton = false;

    this.stringifiedDate = "Choose year";
    this.selectedYearNo = "";

    this.selectedWeek = "";
    this.selectedWeekNo = "";
  }

  setYear(year: YearObj){

    this.selectedYearNo = "";
    this.stringifiedDate = year.yearNum.toString()
    this.selectedYearNo = year.yearNum

    console.log("selected year", this.stringifiedDate)
    this.selectedYearObject = year

  }

  setWeek(week: string | number){
    this.selectedWeek = `Week No: ${week.toString()}`
    this.selectedWeekNo = week.toString()
    this.showSaveButton = true;
  }

  moveYearBack(){
    if(this.selectedYearObject.id > 0){
      this.selectedYearNo = this.yearsArr[this.selectedYearObject.id-1].yearNum
      this.selectedYearObject = this.yearsArr[this.selectedYearObject.id - 1]
    }
  }

  moveYearForward(){

    if(this.selectedYearObject.id < this.yearsArr.length-1){
      this.selectedYearNo = this.yearsArr[this.selectedYearObject.id+1].yearNum
      this.selectedYearObject = this.yearsArr[this.selectedYearObject.id + 1]
    }
  }

  sendDate(){
    const outputDate = `${this.selectedYearNo}/${this.selectedWeekNo}`
    console.warn(outputDate)
    this.date.emit(outputDate);
    this.closeCalendar();
    this.showYearView();
  }

}
