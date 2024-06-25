import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss',
})
export class ExpansionPanelComponent {
  panelOpenState = false;
  cards = [
    {
      projectHeader: 'STC KSA Epit',
      kpisCode: 'APS1-2024',
      status: 'On track',
      direction: 'increasing',
      function: 'linear 2X',
      percent: 23
    },
    {
      projectHeader: 'STC KSA Epit',
      kpisCode: 'APS1-2023',
      status: 'Delayed',
      direction: 'increasing',
      function: 'linear 2X',
      percent: 46
    },
    {
      projectHeader: 'STC KSA Epit',
      kpisCode: 'APS1-2023',
      status: 'On track',
      direction: 'increasing',
      function: 'linear 2X',
      percent: 46
    },
  ];
 // items = [{ percent: 46 }, { percent: 23 }, { percent: 46 }];
}
