import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
// import { NG_VALUE_ACCESSOR } from '@angular/forms';
// import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
// import { ControlValueAccessorDirective } from '../control-value-accessor.directive';

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

export interface DateRange{
  fromDate: Date,
  toDate: Date
}

@Component({
  selector: 'stc-apps-date-picker-range',
  templateUrl: './date-picker-range.component.html',
  styleUrls: ['./date-picker-range.component.scss'],
  // providers: [
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  //   },
  //   { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },

  //   {
  //     provide: NG_VALUE_ACCESSOR,
  //     useExisting: forwardRef(() => DatePickerRangeComponent),
  //     multi: true,
  //   },
  // ],
})
export class DatePickerRangeComponent{
  @Output() valueChangedEvent: EventEmitter<DateRange> = new EventEmitter<DateRange>(); // Mat datepicker emits event of type "any"

  @Input() inputName!: string;
  @Input() inputId!: string;
  @Input() inputPlaceholder!: string;
  @Input() required!: boolean;

  firstDateRange! : Date | null;

  firstValueChanged(event: MatDatepickerInputEvent<Date>){
    this.firstDateRange = event.value
  }

  valueChanged(event: MatDatepickerInputEvent<Date>){
    if(event?.value && this.firstDateRange){

      const rangedObj : DateRange = {fromDate: this.firstDateRange, toDate: event.value}
      this.valueChangedEvent.emit(rangedObj)
    }
  }
}
