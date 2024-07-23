import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss',
})
export class KpiCardComponent {
  title = 'Digitize STC';
  iconPath = 'assets/images/interaction-icon.svg';
}
