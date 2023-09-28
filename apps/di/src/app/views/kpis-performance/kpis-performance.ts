import { Component } from '@angular/core';
import { LineChartData } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-kpis-preformance',
  templateUrl: './kpis-performance.html',
  styleUrls: ['./kpis-performance.scss'],
})
export class KpisPerformanceComponent {

  months: any[] = [
    {name: 'Jan', value: 'Jan'},
    {name: 'Feb', value: 'Feb'},
    {name: 'Mar', value: 'Mar'},
    {name: 'Apr', value: 'Apr'},
    {name: 'May', value: 'May'},
  ]

  lineChartData : LineChartData[] = [
    {category: "cat 1", value: "val 1", caseCount: 5},
    {category: "cat 2", value: "val 2", caseCount: 7},
    {category: "cat 3", value: "val 3", caseCount: 5},
    {category: "cat 4", value: "val 4", caseCount: 9},
    {category: "cat 5", value: "val 5", caseCount: 14},
    // {category: "cat 5", value: "val 6", caseCount: 14},
    // {category: "cat 5", value: "val 7", caseCount: 11},
    // {category: "cat 5", value: "val 8", caseCount: 12},
    // {category: "cat 5", value: "val 9", caseCount: 14},
    // {category: "cat 5", value: "val 10", caseCount: 15},
    // {category: "cat 5", value: "val 11", caseCount: 14},
    // {category: "cat 5", value: "val 12", caseCount: 12},
  ]

  lineChartColors = ['#45006F', '#FF6A39']

  lineChartDataTarget : LineChartData[] = [
    {category: "cat 1", value: "val 1", caseCount: 8},
    {category: "cat 2", value: "val 2", caseCount: 8},
    {category: "cat 3", value: "val 3", caseCount: 8},
    {category: "cat 4", value: "val 4", caseCount: 8},
    {category: "cat 5", value: "val 5", caseCount: 8},
  ]

  kpisStatus = [
    { id: 1, name: 'Acheived' },
    { id: 1, name: 'Not Acheived' },
  ];
}
