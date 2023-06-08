import { Component, Input } from '@angular/core';

@Component({
  selector: 'stc-apps-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  @Input() isEditing!:boolean
}
