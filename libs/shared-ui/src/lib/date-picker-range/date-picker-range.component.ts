import {
  Component,
  Input,
  forwardRef,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  InputSignal,
  input,
  effect,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export interface DateRange {
  fromDate: Date;
  toDate: Date;
}

@Component({
  selector: 'stc-apps-date-picker-range',
  templateUrl: './date-picker-range.component.html',
  styleUrls: ['./date-picker-range.component.scss'],
  standalone: false,
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
export class DatePickerRangeComponent implements OnInit, OnChanges {
  @Output() valueChangedEvent: EventEmitter<DateRange> =
    new EventEmitter<DateRange>(); // Mat datepicker emits event of type "any"
  @Output() datePickerChangeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() inputName!: string;
  @Input() inputId!: string;
  @Input() inputPlaceholder!: string;
  @Input() required!: boolean;
  @Input() disableInput!: boolean;
  @Input() disableFilterFlag!: boolean;
  @Input()
  startDate!: Date;
  @Input() endDate!: Date;

  firstDateRange!: Date | null;
  resetFormFlag: InputSignal<boolean> = input(false);

  dateFormGroup = new FormGroup({
    start: new FormControl(this.startDate),
    end: new FormControl(this.endDate),
  });
  ngOnInit(): void {
    // this.disableInput=false;
    console.log(this.disableInput);

    this.dateFormGroup.valueChanges.subscribe((value) => {
      this.datePickerChangeEvent.emit(value);
    });
  }
  constructor() {
    effect(() => {
      if (this.resetFormFlag()) {
        this.resetForm();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startDate']) {
      //&& !changes['chartData'].firstChange
      this.dateFormGroup.get('start')?.setValue(this.startDate);
      this.dateFormGroup.get('end')?.setValue(this.endDate);
      // this.endDate = changes['endDate'].currentValue;
    }
  }

  firstValueChanged(event: MatDatepickerInputEvent<Date>) {
    this.firstDateRange = event.value;
  }

  valueChanged(event: MatDatepickerInputEvent<Date>) {
    if (event?.value && this.firstDateRange) {
      const rangedObj: DateRange = {
        fromDate: this.firstDateRange,
        toDate: event.value,
      };
      this.valueChangedEvent.emit(rangedObj);
    }
  }

  filteredDays(calendarDate: Date): boolean {
    return calendarDate < new Date() && calendarDate >= new Date('2023-1-1');
  }
  disableFilter(calendarDate: Date): boolean {
    return true;
  }
  resetForm() {
    this.dateFormGroup.reset();
  }
}
