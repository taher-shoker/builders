import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

interface Animal {
  name: string;
  sound: string;
}

@Component({
  selector: 'stc-apps-select-drop-down',
  templateUrl: './select-drop-down.component.html',
  styleUrls: ['./select-drop-down.component.scss'],
})
export class SelectDropDownComponent {
  @Input({ required: true }) label!: string;
  @Input() selectType: 'filter-select-box' | 'default' = 'default';

  animalControl = new FormControl<Animal | null>(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  animals: Animal[] = [
    { name: 'Dog', sound: 'Woof!' },
    { name: 'Cat', sound: 'Meow!' },
    { name: 'Cow', sound: 'Moo!' },
    { name: 'Fox', sound: 'Wa-pa-pa-pa-pa-pa-pow!' },
  ];
}
