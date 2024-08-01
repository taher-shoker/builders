import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'stc-apps-kpi-details',
  templateUrl: './kpi-details.component.html',
  styleUrl: './kpi-details.component.scss',
})
export class KpiDetailsComponent implements OnInit {
  kpiDataRoute = window.history.state.kpi;
  chunkedTitles: any[][] = [];

  kpiInfo = [
    {
      overView: '',
      overViewDesc: 'Increasing',
      backgroundColor: 'rgba(0, 196, 140, 0.1)',
      color: 'var(--stcOasisColor)',
    },
    {
      overView: 'Owner: ',
      overViewDesc: 'Owner Name',
      backgroundColor: 'rgba(79, 0, 140, 0.1)',
      color: 'var(--stc-color)',
    },
    {
      overView: 'Function: ',
      overViewDesc: 'Linear 2X',
      backgroundColor: 'rgba(97, 203, 214, 0.1)',
      color: 'var(--stc-terqouiseColor)',
    },
  ];
  cardItems = [
    {
      title: 'FY Target',
      chartType: 'column',
      chartData: [
        {
          year: '2022',
          Actual: 50,
          Target: 0,
        },
        {
          year: '2023',
          Actual: 70,
          Target: 0,
        },
        {
          year: '2024',
          Actual: 20,
          Target: 0,
        },
        {
          year: '2025',
          Actual: 0,
          Target: 0,
        },
      ],
    },
    {
      title: 'Status of the KPI',
      chartType: 'donut',
      progress: [
        { value: 97, label: 'Baseline', bgColor: 'var(--stcOasisColor)' },
        { value: 100, label: 'Celing', bgColor: 'var(--stc-color)' },
        { value: 87, label: 'Target', bgColor: 'var(--stc-pink-color)' },
      ],
    },
  ];

  kpiData = [
    {
      title: 'Strategic objective',
      desc: 'Strategic objective',
    },
    {
      title: 'Strategic objective relative',
      desc: 'Strategic objective relative',
    },
    {
      title: 'Activation period',
      desc: '3 months',
    },
    {
      title: 'Reporting frequency',
      desc: 'Reporting frequency',
    },
    {
      title: 'Data source',
      desc: 'Data source',
    },
    {
      title: 'Validation Authority',
      desc: 'Validation Authority',
    },
    {
      title: 'Custodian email',
      desc: 'Custodian email',
    },
    {
      title: 'Custodian Title',
      desc: 'Custodian Title',
    },
  ];
  kpiCode = '';
  kpiDefinition = `This KPI will measure the completion of External assessment, market study,
best practices to get a grip of global digital transformation
priorities of top digital services enterprises This KPI will measure the completion of External assessment, market study,
best practices to get a grip of global digital transformation
priorities of top digital services enterprises`;
  kpiFormula = `This KPI will measure the completion of External assessment, market study,
best practices to get a grip of global digital transformation
priorities of top digital services enterprises This KPI will measure the completion of External assessment, market study,
best practices to get a grip of global digital transformation
priorities of top digital services enterprises`;
  constructor(private activeRouter: ActivatedRoute) {}
  ngOnInit(): void {
    this.chunkedTitles = this.chunkArray(this.kpiData, 4);
    console.log(this.chunkedTitles);
  }
  private chunkArray(array: any[], size: number): any[][] {
    // eslint-disable-next-line prefer-const
    let chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }
}
