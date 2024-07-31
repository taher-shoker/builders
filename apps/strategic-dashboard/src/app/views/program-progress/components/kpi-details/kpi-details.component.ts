import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'stc-apps-kpi-details',
  templateUrl: './kpi-details.component.html',
  styleUrl: './kpi-details.component.scss',
})
export class KpiDetailsComponent implements OnInit {
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
  precentagesKpis = [
    {
      percentage: 97,
      color: 'var(--stcOasisColor)',
    },
    {
      percentage: 100,
      color: 'var(--stc-color)',
    },
    {
      percentage: 87,
      color: 'var(--stc-pink-color)',
    },
  ];
  columnChartData = [
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
  ];
  lineChartColors = ['#D2D7D9', '#45006F'];

  kpiCode = '';
  constructor(private activeRouter: ActivatedRoute) {}
  ngOnInit(): void {
    this.activeRouter.paramMap.subscribe((paramMap) => {
      this.kpiCode = String(paramMap.get('kpiCode'));
    });
  }
}
