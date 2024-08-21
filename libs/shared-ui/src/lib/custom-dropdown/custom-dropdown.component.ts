/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Component,
  computed,
  effect,
  EventEmitter,
  forwardRef,
  input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
export interface Item {
  [key: string]: unknown;
  displayName: unknown;
  value: unknown;
}
@Component({
  selector: 'stc-apps-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDropdownComponent),
      multi: true,
    },
  ],
})
export class CustomDropdownComponent implements ControlValueAccessor {
  label = input<string>();
  displayNameProperty = input<string>('displayName');
  valueProperty = input<string>('value');
  list = input.required<Item[]>();

  @Output() itemSelected: EventEmitter<Item> = new EventEmitter<Item>();

  mutatedList = computed(() => {
    const mappedList = this.list().map((item) => ({
      ...item,
      componentScopedNameAccessor: item[this.displayNameProperty()],
      componentScopedValueAccessor: item[this.valueProperty()],
    }));
    return mappedList;
  });

  showItemsList: WritableSignal<boolean> = signal(false);
  chosenItem: WritableSignal<Item | null> = signal(null);

  constructor(){
    effect(() => {
      console.log("Changes:", this.list())
    })
  }

  // Implement ControlValueAccessor methods
  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: unknown): void {
    const selected = this.list().find((item) => item.value === value) || null;
    this.chosenItem.set(selected);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Optional: Handle the touched state when interacting with the control
  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed, e.g., to disable the dropdown
  }

  // End of Implement ControlValueAccessor methods^^

  protected alternateList() {
    this.showItemsList.set(!this.showItemsList());
  }

  protected selectItem(item: Item) {
    this.chosenItem.set(item);
    this.onChange(item['componentScopedValueAccessor']); // Notify parent form control of the change
    this.alternateList();
    this.itemSelected.emit(item)
  }
}
