import { Component, input, InputSignal, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaqamiKpiData } from '../../../../models/raqami.model';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
@Component({
  selector: 'stc-apps-raqami-kpi-card',
  standalone: true,
  imports: [CommonModule , SharedUiModule , OverlayPanelModule],
  templateUrl: './raqami-kpi-card.component.html',
  styleUrl: './raqami-kpi-card.component.scss',
})
export class RaqamiKpiCardComponent implements OnInit {
  raqamiKpiData:InputSignal<RaqamiKpiData> = input.required<RaqamiKpiData>();
  @ViewChild('overlayPanel2') overlayPanel2!: OverlayPanel;
  titleArr!:string[];
  ngOnInit(): void {
    this.titleArr = this.raqamiKpiData().kpiName.split(" ");
  }
  displayDrilldown()
  {
    this.overlayPanel2.toggle(event);
  }
}
