/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { ProgressCircleData } from '@stc-apps/shared-ui';
import { LevelOneResponse } from '../../../shared/models/http-response.model';

@Component({
  selector: 'stc-apps-kpis-trend',
  templateUrl: './kpis-trend.component.html',
  styleUrls: ['./kpis-trend.component.scss'],
})
export class KpisTrendComponent implements OnInit {

  dataService = inject(DataService);

  data: ProgressCircleData[] = [
    { category: 'TECHNOLOGY DI ', value: 20 },
    { category: 'FU DI', value: 50 },
    { category: 'CLUSTER DI', value: 90 },
  ];

  tabs: string[] = ['BUs', 'FUs', 'Technology'];

  activeTab: string = 'BUs';

  ngOnInit(): void {
    this.dataService.getLevelOneData().subscribe(res => {
      console.log("The res :", res)
    })
  }

  activateTab(tabName: string){
    if(tabName !== this.activeTab){
      this.activeTab = tabName
    }
  }

  distributeBusinessNameOverall(data: LevelOneResponse, businessName: string, lookUpPropName: string){
    // this[businessName][1].value = data[lookUpPropName][0].score + "%";
    // const temp = {[businessName]: this[businessName]}
    // this[businessName] = [...temp[businessName]]

    // if(businessName === "busLabels"){
    //   this.data[0].value = data.data[lookUpPropName][0].score

    // }else if(businessName === "fusLabels"){
    //   this.data[1].value = data.data[lookUpPropName][0].score

    // }else{
    //   this.data[2].value = data.data[lookUpPropName][0].score
    // }

    // const dataTemp = this.data;
    // this.data = [...dataTemp]
  }
}
