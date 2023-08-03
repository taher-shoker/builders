import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'stc-apps-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  @Input() isEditing!: boolean;

  userForm = new FormGroup({
    email: new FormControl('', Validators.required),
    jobtitle: new FormControl('', Validators.required),
    privilage: new FormControl(),
    team: new FormControl(),
  });

  onSubmit() {
    alert('');
  }
  privilages = [
    { name: 'Creator', value: 'creator' },
    { name: 'Approved', value: 'approved' },
  ];
  teams = [
    { name: 'Filed Operation', value: 'filed_operation' },
    { name: 'Customer Care ', value: 'customer_care' },
    { name: 'Digital Care', value: 'digital_care' },
    { name: 'Fraud', value: 'fraud' },
  ];
}
