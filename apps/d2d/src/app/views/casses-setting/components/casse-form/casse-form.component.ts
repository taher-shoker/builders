import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-casse-form',
  templateUrl: './casse-form.component.html',
  styleUrls: ['./casse-form.component.scss'],
})
export class CasseFormComponent {
  @Input() isEditing!: boolean;
  @Input() isSubmited!: boolean;
  constructor(protected dialogService: DialogService) {}
  casseForm = new FormGroup({
    customer_name: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    existing_service_order: new FormControl('', Validators.required),
    service_type: new FormControl('', Validators.required),
    existing_plate: new FormControl('', Validators.required),
    existing_phone_number: new FormControl('', Validators.required),
    activation_date: new FormControl('', Validators.required),
    WFM_order: new FormControl('', Validators.required),
    new_plate: new FormControl('', Validators.required),
    new_service_order: new FormControl('', Validators.required),
    new_phone_number: new FormControl('', Validators.required),
    contact_number: new FormControl('', Validators.required),
    case_label: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  onSubmit() {
    console.log(this.casseForm.value);
  }
  onApproved() {
    this.dialogService.open('5');
  }
}
