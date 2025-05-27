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
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
    this.dateFormGroup.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => {
          const prevStart =
            prev?.start instanceof Date ? prev.start.getTime() : null;
          const prevEnd = prev?.end instanceof Date ? prev.end.getTime() : null;
          const currStart =
            curr?.start instanceof Date ? curr.start.getTime() : null;
          const currEnd = curr?.end instanceof Date ? curr.end.getTime() : null;

          return prevStart === currStart && prevEnd === currEnd;
        })
      )
      .subscribe((value) => {
        if (value?.start instanceof Date && value?.end instanceof Date) {
          this.datePickerChangeEvent.emit(value);
        }
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
    if (!this.disableInput && event?.value && this.firstDateRange) {
      this.firstDateRange = event.value;
    }
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
