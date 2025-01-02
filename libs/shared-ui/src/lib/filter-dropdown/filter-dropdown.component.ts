import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';

@Component({
  selector: 'stc-apps-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss'],
})
export class FilterDropdownComponent {
  dropdownOptions: InputSignal<{ label: string; value: any }[]> = input<
    { label: string; value: any }[]
  >([]);
  placeholder: InputSignal<string> = input('');
  selectedValue: InputSignal<any> = input(null);

  @Output() valueChange = new EventEmitter();

  onValueChange(event: any) {
    this.valueChange.emit(event);
  }
}
