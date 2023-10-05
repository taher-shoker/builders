/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit, inject } from '@angular/core';
import { LineChartData } from '@stc-apps/shared-ui';
import { DataService } from '../../shared/services/data.service';
import {
  Dimension,
  KpiDetails,
  KpiDetailsResponse,
  KpiItem,
  KpisCount,
  LevelTwoResponse,
} from '../../shared/models/http-response.model';
import { NumberToMonthNamePipe } from '../../shared/pipes/number-to-month-name.pipe';
import { ActivatedRoute } from '@angular/router';
import { KpiData } from '../../shared/components/kpis-holder/kpis-holder.component';
import { FormControl, FormGroup } from '@angular/forms';

interface Dropdown {
  id: number;
  name: string;
  kpiProperty: string;
}
@Component({
  selector: 'stc-apps-kpis-performance',
  templateUrl: './kpis-performance.component.html',
  styleUrls: ['./kpis-performance.component.scss'],
})
export class KpisPerformanceComponent implements OnInit {
  dataService = inject(DataService);
  route = inject(ActivatedRoute);

  filtersForm: FormGroup = new FormGroup({
    kpisStatusFilter: new FormControl(''),
    kpisDimensionsFilter: new FormControl(''),
    kpisObjectiveTwoFilter: new FormControl(''),
    kpisObjectiveThreeFilter: new FormControl(''),
    kpisUnitsFilter: new FormControl(''),
  });

  unitSector!: string;
  kpisCount!: KpisCount;

  kpisList!: KpiItem[];
  kpisListUnfiltered!: KpiItem[]; // To keep the original state of the kpis, with no filters

  kpiDetails!: KpiDetails[];
  selectedKpi!: KpiData;

  months: { name: string; value: string }[] = [
    { name: 'Jan', value: 'Jan' },
    { name: 'Feb', value: 'Feb' },
    { name: 'Mar', value: 'Mar' },
    { name: 'Apr', value: 'Apr' },
    { name: 'May', value: 'May' },
  ];

  //Hold the line of the data
  lineChartData: LineChartData[] = [];

  //Hold the line of the target
  lineChartTarget: LineChartData[] = [];

  lineChartColors = ['#45006F', '#FF6A39'];

  kpisStatus = [
    { id: 0, name: 'All', kpiProperty: 'all' },
    { id: 1, name: 'Achieved', kpiProperty: 'achievedFlag' },
    { id: 2, name: 'Not Achieved', kpiProperty: 'achievedFlag' },
  ];

  kpisDimensions: Dropdown[] = [
    { id: 0, name: 'All', kpiProperty: 'all' },
    { id: 1, name: 'Capability Building', kpiProperty: 'dimension' },
    { id: 2, name: 'Capability Utilization', kpiProperty: 'dimension' },
    { id: 3, name: 'Digital Experience & Impact', kpiProperty: 'dimension' },
  ];

  kpisObjectiveTwo: Dropdown[] = [
    { id: 0, name: 'All', kpiProperty: 'all' },
    { id: 1, name: 'Corporate Transformation', kpiProperty: 'objectiveTwo' },
    { id: 2, name: 'Business & Operations', kpiProperty: 'objectiveTwo' },
    { id: 3, name: 'Technology Enablement', kpiProperty: 'objectiveTwo' },
  ];

  kpisObjectiveThree: Dropdown[] = [
    { id: 0, name: 'All', kpiProperty: 'all' },
    { id: 1, name: 'Cybersecurity', kpiProperty: 'objectiveThree' },
    { id: 2, name: 'Partner Journey', kpiProperty: 'objectiveThree' },
    { id: 3, name: 'Digitization & Automation', kpiProperty: 'objectiveThree' },
    { id: 4, name: 'Process Foundations', kpiProperty: 'objectiveThree' },
    { id: 5, name: 'Agile Delivery', kpiProperty: 'objectiveThree' },
    { id: 6, name: 'Analytics Use Cases', kpiProperty: 'objectiveThree' },
    {
      id: 7,
      name: 'Digital Strategy & Governance',
      kpiProperty: 'objectiveThree',
    },
    { id: 8, name: 'Virtualization & Cloud', kpiProperty: 'objectiveThree' },
  ];

  kpisUnits: Dropdown[] = [
    { id: 0, name: 'All', kpiProperty: 'all' },
    { id: 1, name: 'Weeks', kpiProperty: 'objectiveThree' },
    { id: 1, name: 'Days', kpiProperty: 'objectiveThree' },
    { id: 1, name: '%', kpiProperty: 'objectiveThree' },
    { id: 1, name: '#', kpiProperty: 'objectiveThree' },
  ];

  ngOnInit(): void {
    // this.route.paramMap.subscribe
    this.filtersForm.get('kpisStatusFilter')?.setValue(this.kpisStatus[0]);
    this.filtersForm
      .get('kpisDimensionsFilter')
      ?.setValue(this.kpisDimensions[0]);
    this.filtersForm
      .get('kpisObjectiveTwoFilter')
      ?.setValue(this.kpisObjectiveTwo[0]);
    this.filtersForm
      .get('kpisObjectiveThreeFilter')
      ?.setValue(this.kpisObjectiveThree[0]);
    this.filtersForm.get('kpisUnitsFilter')?.setValue(this.kpisUnits[0]);

    this.unitSector = this.route.snapshot.paramMap.get('unit_sector')!;

    if (this.unitSector) {
      this.dataService
        .getKPIsOfBusinessName(this.unitSector)
        .subscribe((res: LevelTwoResponse) => {
          console.log('DA RES', res);
          this.kpisCount = res.kpiCount;
          res.data.forEach(
            (x) => (x.date = new Date(x.yearNum, x.frequencyNum - 1))
          );

          this.kpisList = res.data;
          this.kpisListUnfiltered = res.data;
          this.unitSector = res.data[0].unitSectorGroup;
        });
    }
  }

  fetchKpiDetails(kpiItem: KpiData) {
    this.selectedKpi = kpiItem;
    this.dataService
      .getDetailsOfKPIs(kpiItem.id)
      .subscribe((res: KpiDetailsResponse) => {
        this.kpiDetails = res.data;

        this.populateTrend(res);
        console.log('El details', this.kpiDetails);
      });
  }

  populateTrend(trendCard: KpiDetailsResponse) {
    for (let i = 0; i < trendCard.data.length; i++) {
      // Push an object into each of the 3 arrays , data - target - baseline :

      this.lineChartData.push({
        category: this.dataService.formatDate(
          trendCard.data[i].frequencyNum,
          trendCard.data[i].yearNum
        ),
        value: trendCard.data[i].actualValue,
      });
      this.lineChartTarget.push({
        category: this.dataService.formatDate(
          trendCard.data[i].frequencyNum,
          trendCard.data[i].yearNum
        ),
        value: trendCard.data[i].target,
      });
    }
  }

  currentChosenFilters: { name: string; kpiProperty: string }[] = [];

  filterWith({ name, kpiProperty }: { name: string; kpiProperty: string }) {
    if (kpiProperty === 'achievedFlag') {
      if (name === 'Achieved') {
        name = '1';
      } else {
        name = '0';
      }
    }
    console.log('El event', name);

    const filterObj = { name, kpiProperty };

    const idx = this.currentChosenFilters.findIndex(
      (obj) => obj.kpiProperty === filterObj.kpiProperty
    );

    if (idx >= 0) {
      this.currentChosenFilters[idx] = filterObj;
    } else {
      this.currentChosenFilters.push({ name, kpiProperty });
    }

    this.kpisList = [];

    const filteredKpis: KpiItem[] = [];

    this.kpisListUnfiltered.forEach((kpi) => {
      let isMatched: boolean = true;

      for (const filterObj of this.currentChosenFilters) {
        isMatched = kpi[filterObj.kpiProperty] === filterObj.name;
        if (!isMatched) {
          return;
        }
      }
      if (isMatched) {
        filteredKpis.push(kpi);
      }
    });
    this.kpisList = filteredKpis;
  }

  resetFilters() {
    this.kpisList = this.kpisListUnfiltered;
  }


}
