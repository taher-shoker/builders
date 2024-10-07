import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { TapModel } from '../../models/scorecard.model';
import { RaqamiService } from '../../services/raqami.service';
import { RaqamiTapDetailsComponent } from './components/raqami-tap-details/raqami-tap-details.component';

@Component({
  selector: 'stc-apps-raqami',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , SharedUiModule , RaqamiTapDetailsComponent],
  templateUrl: './raqami.component.html',
  styleUrl: './raqami.component.scss',
})
export class RaqamiComponent implements OnInit{
  raqamiTaps!: TapModel[];
  raqamiService = inject(RaqamiService);
  clickedTap!:TapModel;
  ngOnInit(): void {
    this.raqamiTaps = this.raqamiService.getRaqamiTaps();
    this.clickedTap = this.raqamiTaps[0];
  }
  getClickedTap(e:TapModel){
    this.clickedTap = e;
  }
}
