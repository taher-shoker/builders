import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { PSRProjectCardComponent } from "../project-card/project-card.component";
import { PSRDataModel } from '../../../../models/psr.model';

@Component({
  selector: 'stc-apps-tab-details',
  standalone: true,
  imports: [CommonModule, SharedUiModule, PSRProjectCardComponent],
  templateUrl: './tab-details.component.html',
  styleUrl: './tab-details.component.scss',
})
export class TabDetailsComponent {
  projects:InputSignal<PSRDataModel[]> = input.required<PSRDataModel[]>()
}
