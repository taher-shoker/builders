/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
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
  implements OnChanges
{
  @ContentChildren(MatOption) queryOptions!: QueryList<MatOption>;
  yet!: boolean;

  @Output() selectChange = new EventEmitter<any>();
  @Input({ required: true }) label!: string;
  @Input() selectType: 'filter-select-box' | 'default' = 'default';
  @Input() options: any[] = [];
  @Input() labelName = 'name';
  @Input() labelValue = 'id';
  @Input() groupName = 'groupName';
  @Input() groupOptions = 'roles';
  @Input() labelSize: number = 16;
  @Input() required = false;
  @Input() selectId: any;
  @Input() defaultAll = false;
  @Input() outputValue!: string; // if passed, the component should output this value from the object
  @Input() group = false;
  @Input() multi = false;

  onChangeValue(value: any) {
    if (this.outputValue) {
      this.selectChange.emit(value[this.outputValue]);
      console.warn('Da values', value[this.outputValue]);
    } else {
      this.selectChange.emit(value);
    }
  }
  // pokemonGroups: any[] = [
  //   {
  //     name: 'Grass',
  //     pokemon: [
  //       { value: 'bulbasaur-0', viewValue: 'Bulbasaur' },
  //       { value: 'oddish-1', viewValue: 'Oddish' },
  //       { value: 'bellsprout-2', viewValue: 'Bellsprout' },
  //     ],
  //   },
  //   {
  //     name: 'Water',
  //     pokemon: [
  //       { value: 'squirtle-3', viewValue: 'Squirtle' },
  //       { value: 'psyduck-4', viewValue: 'Psyduck' },
  //       { value: 'horsea-5', viewValue: 'Horsea' },
  //     ],
  //   },
  //   {
  //     name: 'Fire',
  //     disabled: true,
  //     pokemon: [
  //       { value: 'charmander-6', viewValue: 'Charmander' },
  //       { value: 'vulpix-7', viewValue: 'Vulpix' },
  //       { value: 'flareon-8', viewValue: 'Flareon' },
  //     ],
  //   },
  //   {
  //     name: 'Psychic',
  //     pokemon: [
  //       { value: 'mew-9', viewValue: 'Mew' },
  //       { value: 'mewtwo-10', viewValue: 'Mewtwo' },
  //     ],
  //   },
  // ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.options = changes['options'].currentValue;
      if (this.defaultAll) {
        this.options?.unshift({ id: 'all', [this.labelName]: '-' });
      }
    }
  }
}
