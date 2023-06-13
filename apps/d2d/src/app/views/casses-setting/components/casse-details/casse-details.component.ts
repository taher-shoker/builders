import { Component } from '@angular/core';
import { DialogService } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-casse-details',
  templateUrl: './casse-details.component.html',
  styleUrls: ['./casse-details.component.scss'],
})
export class CasseDetailsComponent {
  constructor(protected dialogService: DialogService) {}
}
