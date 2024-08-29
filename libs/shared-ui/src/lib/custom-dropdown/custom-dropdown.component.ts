/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Component,
  computed,
  effect,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  input,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators,
} from '@angular/forms';
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
export class CustomDropdownComponent implements ControlValueAccessor, OnInit {
  label = input<string>();
  searchable = input<boolean>(false);
  resetable = input<boolean>(false);
  // required = input<boolean>(false);
  required: WritableSignal<boolean> = signal(false);
  displayNameProperty = input<string>('displayName');
  valueProperty = input<string>('value');
  list = input.required<Item[]>();
  outputProperty = input<string>('');

  @Output() itemSelected: EventEmitter<Item> = new EventEmitter<Item>();

  filtrationText: WritableSignal<string> = signal('');
  control: FormControl | undefined;

  mutatedList = computed(() => {
    if (this.list().length > 0) {
      const mappedList = this.list().map((item) => ({
        ...item,
        componentScopedNameAccessor: item[this.displayNameProperty()],
        componentScopedValueAccessor: item[this.valueProperty()],
        componentScopedOutputPropertyAccessor: item[this.outputProperty()],
      }));
      return mappedList;
    }
    return [];
  });

  filteredList = computed(() => {
    if (this.mutatedList().length > 0) {
      const filtered = this.mutatedList().filter((item) => {
        if (typeof item['componentScopedNameAccessor'] === 'string') {
          return item['componentScopedNameAccessor']
            .toLowerCase()
            .includes(this.filtrationText());
        }
        return false;
      });

      return filtered;
    }
    return [];
  });

  showItemsList: WritableSignal<boolean> = signal(false);
  chosenItem: WritableSignal<Item | null> = signal(null);

  constructor(@Inject(Injector) private injector: Injector) {}

  ngOnInit() {
    this.setFormControl();
    this.required.set(this.control?.hasValidator(Validators.required) ?? false);
  }

  setFormControl() {
    try {
      const formControl = this.injector.get(NgControl);

      switch (formControl.constructor) {
        case FormControlName:
          this.control = this.injector
            .get(FormGroupDirective)
            .getControl(formControl as FormControlName);
          break;
        default:
          this.control = (formControl as FormControlDirective)
            .form as FormControl;
          break;
      }
    } catch (err) {
      this.control = new FormControl();
    }
  }

  // Implement ControlValueAccessor methods
  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: unknown): void {
    console.log("Curr VAL is :", value)
    if (this.list().length > 0) {
      const selected =
        this.mutatedList().find( (item) => {
          return item['componentScopedValueAccessor'] === value
        }
          
        ) || null;

        console.log("SELECTED IS:::", selected)
      this.chosenItem.set(selected);
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }


  registerOnTouched(fn: () => void): void {
    
    this.onTouched = fn;
  }

  // Optional: Handle the touched state when interacting with the control
  disableDropdownHead: WritableSignal<boolean> = signal(false);
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      // this.control?.disable();
      this.disableDropdownHead.set(true);
    } else {
      // this.control?.enable();
      this.disableDropdownHead.set(false);
    }
  }

  // End of Implement ControlValueAccessor methods^^

  protected alternateList() {
    // if (!this.firstTimeTouched) {
    //   this.firstTimeTouched = true; // For error handling
    // }
    this.showItemsList.set(!this.showItemsList());
    this.filtrationText.set('');
  }

  protected selectItem(item: Item) {

    if(item['componentScopedValueAccessor'] === this.chosenItem()?.['componentScopedValueAccessor']){
      this.chosenItem.set(null)
      return;
    }

    this.chosenItem.set(item);
    this.onChange(item['componentScopedValueAccessor']); // Notify parent form control of the change
    this.alternateList();

    if (this.outputProperty() !== '') {
      this.itemSelected.emit((<any>item).componentScopedOutputPropertyAccessor);
    } else {
      this.itemSelected.emit(item);
    }
  }

  filterList(event: KeyboardEvent) {
    this.filtrationText.set(
      (<HTMLInputElement>event.target).value.toLowerCase()
    );
  }

  toggleOverlay() {
    this.alternateList();
  }
}
