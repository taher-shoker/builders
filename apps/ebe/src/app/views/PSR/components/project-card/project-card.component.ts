import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PSRDataModel } from '../../../../models/psr.model';
import { SharedUiModule } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-psr-project-card',
  standalone: true,
  imports: [CommonModule , SharedUiModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class PSRProjectCardComponent {
  project:InputSignal<PSRDataModel> = input.required<PSRDataModel>();
  colors:string[] = ['#4F008C' , '#B999D1'];
}
