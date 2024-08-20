import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PSRProjectDetailsModel } from '../../../../models/psr.model';
import { SharedUiModule } from '@stc-apps/shared-ui';
@Component({
  selector: 'stc-apps-project-details-card',
  standalone: true,
  imports: [CommonModule , SharedUiModule],
  templateUrl: './project-details-card.component.html',
  styleUrl: './project-details-card.component.scss',
})
export class ProjectDetailsCardComponent {
  projectData:InputSignal<PSRProjectDetailsModel> = input.required<PSRProjectDetailsModel>()
}
