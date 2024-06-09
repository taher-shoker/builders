import { Component, InputSignal, input } from '@angular/core';

@Component({
  selector: 'stc-apps-expansion-panel-body',
  templateUrl: './expansion-panel-body.component.html',
  styleUrl: './expansion-panel-body.component.scss',
})
export class ExpansionPanelBodyComponent {
  percentage: InputSignal<number> = input(0);

  listItems = [
    {
      section: 'left',
      items: [
        { label: 'Weight', value: '15%' },
        { label: 'Unit', value: '%' },
      ],
    },
    {
      section: 'right',
      items: [
        { label: 'Actual perf%', value: '87.69 %' },
        { label: 'Applied perf %', value: '87.69 %' },
      ],
    },
  ];
}
