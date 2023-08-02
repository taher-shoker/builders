import {
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { ControlValueAccessorDirective } from '../control-value-accessor.directive';

interface Option {
  [key: string]: string;
  value: string;
}

@Component({
  selector: 'stc-apps-select-drop-down',
  templateUrl: './select-drop-down.component.html',
  styleUrls: ['./select-drop-down.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDropDownComponent),
      multi: true,
    },
  ],
})
export class SelectDropDownComponent<T>
  extends ControlValueAccessorDirective<T>
  implements AfterViewInit
{
  @ContentChildren(MatOption) queryOptions!: QueryList<MatOption>;
  yet!: boolean;

  @Output() selectChange = new EventEmitter<string>();
  @Input({ required: true }) label!: string;
  @Input() selectType: 'filter-select-box' | 'default' = 'default';
  @Input() options: any[] = [];
  @Input() labelName = 'name';
  @Input() labelValue = 'id';
  @Input() required = false;
  @Input() selectId = '';

  onChangeValue(value: string) {
    this.selectChange.emit(value);
  }

  ngAfterViewInit() {
    this.options = this.queryOptions.map((x) => {
      return { name: x.viewValue, id: x.value };
    });
    setTimeout(() => {
      this.yet = true;
    });
  }
}
