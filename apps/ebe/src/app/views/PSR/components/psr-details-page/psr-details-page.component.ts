import { Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { PSRService } from '../../../../services/psr.services';
import { PSRProjectDetailsModel } from '../../../../models/psr.model';
import { ProjectDetailsCardComponent } from '../project-details-card/project-details-card.component';
@Component({
  selector: 'stc-apps-psr-details-page',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , SharedUiModule , ProjectDetailsCardComponent],
  templateUrl: './psr-details-page.component.html',
  styleUrl: './psr-details-page.component.scss',
})
export class PsrDetailsPageComponent implements OnInit {
  psrServices = inject(PSRService)
  PSRDetailsData!:PSRProjectDetailsModel[];
  ngOnInit(): void {
    this.PSRDetailsData = this.psrServices.PSRDetailsData;
  }
}
