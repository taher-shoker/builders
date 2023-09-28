/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LabelLine, DonutChartData, LineChartData } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-trend-card',
  templateUrl: './trend-card.component.html',
  styleUrls: ['./trend-card.component.scss'],
})
export class TrendCardComponent {

  @Input() id!: string;
  @Input() hideDetailsBtn: boolean = false;

  router = inject(Router)

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

  lineChartDataTarget : LineChartData[] = [
    {category: "cat 1", value: "val 1", caseCount: 8},
    {category: "cat 2", value: "val 2", caseCount: 8},
    {category: "cat 3", value: "val 3", caseCount: 8},
    {category: "cat 4", value: "val 4", caseCount: 8},
    {category: "cat 5", value: "val 5", caseCount: 8},
  ]

  lineChartDataTarget2 : LineChartData[] = [
    {category: "cat 1", value: "val 1", caseCount: 2},
    {category: "cat 2", value: "val 2", caseCount: 2},
    {category: "cat 3", value: "val 3", caseCount: 2},
    {category: "cat 4", value: "val 4", caseCount: 2},
    {category: "cat 5", value: "val 5", caseCount: 2},
  ]

  lineChartColors = ['#45006F', '#FF6A39']

  donutLabels : LabelLine[] = [
    {html: `<p style="color:#00c48c; font-weight:bold; font-size: 13px">65.32%<span style="font-weight:normal; color:black; margin-left:6px">/63%</span></p>`, centerY: 60},
    {html: `<p><i style="color:#00c48c;font-size: 14px" class="fas fa-solid fa-arrow-up"></i> 4.6%</p>`, centerY: 30},
    {html: `<p style="font-size: 10px">From last month</p>`, centerY: 0},
  ]

  donutData1 : DonutChartData[] = [
    {category: "TECHNOLOGY DI ", value: 62},
    {category: "FU DI", value: 40},
    {category: "CLUSTER DI", value: 20},
  ]

  donutColors = ['#ff6a39', '#ffdd40', '#1cced8']


  navToKpiDetails(){
    this.router.navigate(["/performance"])
  }
}
