import { Component, OnInit, inject } from '@angular/core';
import { LineChartData } from '@stc-apps/shared-ui';
import { DataService } from '../../shared/services/data.service';
import { KpiDetails, KpiDetailsResponse, KpiItem, KpisCount, LevelTwoResponse } from '../../shared/models/http-response.model';

@Component({
  selector: 'stc-apps-kpis-performance',
  templateUrl: './kpis-performance.component.html',
  styleUrls: ['./kpis-performance.component.scss'],
})
export class KpisPerformanceComponent implements OnInit{

  dataService = inject(DataService)

  kpisCount!: KpisCount;
  kpisList!: KpiItem[];
  kpiDetails!: KpiDetails[];

  months: {name: string, value: string}[] = [
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

  ngOnInit(): void {
    this.dataService.getKPIsOfBusinessName().subscribe( (res: LevelTwoResponse) => {
      console.log("DA RES", res)
      this.kpisCount = res.kpiCount
      this.kpisList = res.data
    })
  }

  fetchKpiDetails(id: string){
    this.dataService.getDetailsOfKPIs(id).subscribe((res: KpiDetailsResponse) => {
      this.kpiDetails = res.data
      console.log("elDetailso", this.kpiDetails)
    })
  }
}
