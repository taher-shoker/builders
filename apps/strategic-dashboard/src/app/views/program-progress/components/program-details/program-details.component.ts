import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss'],
})
export class ProgramDetailsComponent {
  title: InputSignal<string> = input('Business efficiency program');

  yearsArray: any = [
    { name: 2020 },
    { name: 2021 },
    { name: 2022 },
    { name: 2023 },
  ];

  cardItems = [
    {
      title: 'Status of the program',
      chartType: 'donut',
      progress: [
        { value: 15, label: 'Actul', bgColor: '#00c48c' },
        { value: 13, label: 'Planned', bgColor: '#4f008c' },
        { value: 15.4, label: 'deviation', bgColor: '#ff1a1a' },
      ],
    },
    { title: 'Budget variance', chartType: 'line' },
    { title: 'Completion VS plan', chartType: 'line' },
    { title: 'KPIs Performance', chartType: 'progress' },
  ];

  kpisItems = [
    {
      id: '1',
      title:
        '% of analytics capabilities implemented in alignment with northstar to-be architecture analytics roadmap',
    },
    {
      id: '2',
      title: ' #self-service capability enabled for BU/FU',
    },
    {
      id: '3',
      title:
        ' % implementation of data lake first principle “store everything on the lake first”',
    },
    { id: '4', title: 'stc TRUST Maturity Score' },
    {
      id: '5',
      title: ' #self-service capability enabled for BU/FU',
    },
    {
      id: '6',
      title:
        '% of analytics capabilities implemented in alignment with northstar to-be architecture analytics roadmap',
    },
  ];
}
