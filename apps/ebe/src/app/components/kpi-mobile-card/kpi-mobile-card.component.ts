import { Component, input, InputSignal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiModel } from '../../models/scorecard.model';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'stc-apps-kpi-mobile-card',
  standalone: true,
  imports: [CommonModule , SharedUiModule , OverlayPanelModule],
  templateUrl: './kpi-mobile-card.component.html',
  styleUrl: './kpi-mobile-card.component.scss',
})
export class KpiMobileCardComponent {
  kpi:InputSignal<KpiModel> = input.required<KpiModel>();
  @ViewChild('textOverlayPanel') textOverlayPanel!: OverlayPanel;
  activeIndex = 0;
}
