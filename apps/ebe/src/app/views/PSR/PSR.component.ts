import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { TapModel } from '../../models/scorecard.model';
import { PSRService } from '../../services/psr.services';
import { TabDetailsComponent } from './components/tab-details/tab-details.component';
import { PSRProjectCardComponent } from './components/project-card/project-card.component';
import { PSRDataModel } from '../../models/psr.model';
@Component({
  selector: 'stc-apps-psr',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , SharedUiModule , TabDetailsComponent , PSRProjectCardComponent],
  templateUrl: './PSR.component.html',
  styleUrl: './PSR.component.scss',
})
export class PSRComponent implements OnInit {
  PSRTaps!:TapModel[];
  psrServices = inject(PSRService);
  currentTab!:TapModel;
  psrData!:PSRDataModel[];
  ngOnInit(): void {
    this.psrData = this.psrServices.getPSRData();
  }
  getClickedTap(tab:TapModel)
  {
    this.currentTab = tab;
    console.log(tab);
  }
}
