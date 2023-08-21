/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { YearRangeObj, YearObj } from '../date-picker-weekly/date-picker-weekly.component';

@Component({
  selector: 'stc-apps-date-picker-weekly-range',
  templateUrl: './date-picker-weekly-range.component.html',
  styleUrls: ['./date-picker-weekly-range.component.scss'],
})
export class DatePickerWeeklyRangeComponent implements OnInit{

  @Output() dateRange: EventEmitter<YearRangeObj> = new EventEmitter<YearRangeObj>();
  @Input() formControlParentalState: FormControl = new FormControl(moment()); // Variable to receive Form control from parent to maintain the last date user has inserted

  isFirst: boolean = true;
  showCalendar: boolean = false;

  showYearsView: boolean = true;
  showWeeksView: boolean = false;

  selectedDate : string = "Choose year"; // That prop mixes the selectedWeek and selectedYearNo for the template-view
  selectedWeek : string = ""; // That prop holds the text of Week no:

  selectedYearNo : number | string = "";
  selectedWeekNo : string | number = "";

  selectedYearObject!: YearObj;
  yearsArr : YearObj[] = [];

  // Props for range calendar :

  selectedDateOne : string = "Choose year"; // That prop mixes the selectedWeekNoOne and selectedYearNoOne for the template-view
  selectedDateTwo : string = "Choose year"; // That prop mixes the selectedYearNoTwo and selectedWeekNoTwo for the template-view

  selectedYearNoOne : number | string = "";
  selectedWeekNoOne : string | number = "";

  selectedYearNoTwo : number | string = "";
  selectedWeekNoTwo : string | number = "";

  selectedWeekOne: string = ""; // That prop holds the text of Week no:
  selectedWeekTwo: string = ""; // That prop holds the text of Week no:

  showSaveButton: boolean = false;

  ngOnInit(){
    this.populateYears()
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

    if(this.selectedWeekNoOne !== "" && this.selectedWeekNoTwo !== ""){
      this.showSaveButton = true;
    }else{
      this.showSaveButton = false;
    }
  }

  closeCalendar(){
    this.showCalendar = !this.showCalendar;
  }

  resetCalendar(){

    this.showYearView();
    this.showSaveButton = false;

    this.selectedDate = "Choose year";
    this.selectedDateOne = "Choose year";
    this.selectedDateTwo = "";

    this.selectedYearNo = "";
    this.selectedYearNoOne = "";
    this.selectedYearNoTwo = "";

    this.selectedWeek = "";
    this.selectedWeekOne = "";
    this.selectedWeekTwo = "";

    this.selectedWeekNo = "";
    this.selectedWeekNoOne = "";
    this.selectedWeekNoTwo = "";
  }

  setYear(year: YearObj){

    this.selectedYearNo = "";
    this.selectedYearNoOne = "";

    this.selectedDateOne = year.yearNum.toString()
    this.selectedYearNoOne = year.yearNum

    this.selectedYearObject = year

  }

  setWeek(week: string | number){

    if(this.selectedWeekOne == ""){
      this.selectedWeekOne = `Week No: ${week.toString()}`
      this.selectedWeekNoOne = week.toString()

      this.showSaveButton = false;

    }else{
      this.selectedDateTwo = this.selectedYearObject.yearNum.toString()
      this.selectedYearNoTwo = this.selectedYearObject.yearNum
      this.selectedWeekTwo = `Week No: ${week.toString()}`
      this.selectedWeekNoTwo = week.toString()

      this.showSaveButton = true;

    }
  }

  moveYearBack(){
    if(this.selectedYearObject.id > 0){
      this.selectedYearNoTwo = this.yearsArr[this.selectedYearObject.id - 1].yearNum
      this.selectedYearObject = this.yearsArr[this.selectedYearObject.id - 1]
    }
  }

  moveYearForward(){
    if(this.selectedYearObject.id < this.yearsArr.length-1){
      this.selectedYearNoTwo =  this.yearsArr[this.selectedYearObject.id + 1].yearNum
      this.selectedYearObject = this.yearsArr[this.selectedYearObject.id + 1]
    }
  }

  sendDate(){
    const outputDate : YearRangeObj = {
      fromDate: {year: this.selectedYearNoOne, week: this.selectedWeekNoOne },
      toDate: {year: this.selectedYearNoTwo, week: this.selectedWeekNoTwo}
    }
    console.warn(outputDate)
    this.dateRange.emit(outputDate);
    this.closeCalendar();
    this.showYearView();
  }

}
