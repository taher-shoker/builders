import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss',
})
export class ExpansionPanelComponent {
  panelOpenState = false;

  items = [
    { percent: 46 },
    { percent: 23 },
    { percent: 46 },
  ];
}
