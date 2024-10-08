import { Component, input, InputSignal, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrategyProgramKpiModel } from '../../../../models/strategy-program.model';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { OverlayPanel , OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'stc-apps-strategy-kpi-card',
  standalone: true,
  imports: [CommonModule, SharedUiModule , RouterModule , OverlayPanelModule],
  templateUrl: './strategy-kpi-card.component.html',
  styleUrl: './strategy-kpi-card.component.scss',
})
export class StrategyKpiCardComponent implements OnInit {
  strategyKpiCard:InputSignal<StrategyProgramKpiModel> = input.required<StrategyProgramKpiModel>();
  titleArr:string[] = [];
  descArr:string[] = [];
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  @ViewChild('overlayPanel2') overlayPanel2!: OverlayPanel;
  ngOnInit(): void {
    this.titleArr = this.strategyKpiCard().strategyProjectName.split(" ");
    this.descArr = this.strategyKpiCard().description.split(" ");
  }
  displayDrilldown()
  {
    this.overlayPanel.toggle(event);
  }
  displayDrilldown2()
  {
    this.overlayPanel2.toggle(event);
  }
}
