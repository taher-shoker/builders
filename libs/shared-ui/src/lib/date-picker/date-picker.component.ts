import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorDirective } from '../control-value-accessor.directive';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import moment, { Moment } from 'moment';

export const APP_DATE_FORMATS = {
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

@Component({
  selector: 'stc-apps-date-picker',
  templateUrl: './date-picker.component.html',
  standalone: false,
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },

    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent<T> extends ControlValueAccessorDirective<T> {
  readonly date = new FormControl(moment());

  @Input() inputName!: string;
  @Input() inputId!: string;
  @Input() inputPlaceholder!: string;
  @Input() required!: boolean;
  @Input() myFilter!: (date: Date | null) => boolean;
  @Input() minDate!: Date;
  @Input() maxDate!: Date;
  @Input() disabledInput = false;
  @Input() monthView = false;
  @Input() override control!: FormControl;

  @Output() selectChange: EventEmitter<MatDatepickerInputEvent<Date>> =
    new EventEmitter();

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.selectChange.emit(event);
  }

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.control.value
      ? moment(this.control.value)
      : moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    ctrlValue.date(1); // Set to first day of month

    this.control.setValue(ctrlValue);

    const fakeInputEvent: MatDatepickerInputEvent<Date> = {
      value: ctrlValue.toDate(),
      target: null as any, // required by type but unused
      targetElement: null as any, // required by type but unused
    };

    this.selectChange.emit(fakeInputEvent);
    datepicker.close();
  }
}
