import { Component, InputSignal, input } from '@angular/core';

@Component({
  selector: 'stc-apps-expansion-panel-header',
  templateUrl: './expansion-panel-header.component.html',
  styleUrl: './expansion-panel-header.component.scss',
})
export class ExpansionPanelHeaderComponent {
  status: InputSignal<any> = input('On track');
  kpisCode: InputSignal<any> = input('KPI Code : APS 1-2023');
  projectHeader: InputSignal<any> = input('STC KSA Epit');
}
