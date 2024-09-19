import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgramKPIService } from '../../services/program-kpi.service';
import { KPIDetails, KPIItem, KpiValue } from '../../models/kpi-details.model';

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
      chartData: [] as any[],
    },
    {
      title: 'Status of the KPI',
      chartType: 'donut',
      progress: [] as any[],
    },
  ];

  kpiData: KPIItem[] = [];

  kpiCode = '';
  programName = '';
  kpiDefinition = '';
  kpiFormula = '';
  kpiDetails!: KPIDetails;

  constructor(
    private route: ActivatedRoute,
    private programKPIService: ProgramKPIService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.kpiCode = params['kpiCode'] || '';
      this.programName = params['programName'] || '';

      this.chunkedTitles = this.chunkArray(this.kpiData, 4);

      this.getKPIDetails();
    });
  }

  chunkArray(array: any[], size: number): any[][] {
    // eslint-disable-next-line prefer-const
    let chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }

  getKPIDetails() {
    if (this.kpiCode) {
      this.programKPIService
        .getKPIDetails({ kpiCode: this.kpiCode })
        .subscribe((result: KPIDetails) => {
          this.kpiDetails = result;
          if (this.kpiDetails) {
            this.mapKpiDetailsToData(this.kpiDetails);
          }
        });
    }
  }

  mapKpiDetailsToData(details: KPIDetails): void {
    this.kpiInfo = [
      {
        overView: '',
        overViewDesc: details.direction === '1.0' ? 'Increasing' : 'Decreasing',
        backgroundColor:
          details.direction === '1.0'
            ? 'rgba(0, 196, 140, 0.1)'
            : 'rgba(255, 0, 0, 0.1)',
        color:
          details.direction === '1.0'
            ? 'var(--stcOasisColor)'
            : 'var(--stc-red-color)',
      },
      {
        overView: 'Owner: ',
        overViewDesc: details.kpiOwner || 'N/A',
        backgroundColor: 'rgba(79, 0, 140, 0.1)',
        color: 'var(--stc-color)',
      },
      {
        overView: 'Function: ',
        overViewDesc: details.function || 'N/A',
        backgroundColor: 'rgba(97, 203, 214, 0.1)',
        color: 'var(--stc-terqouiseColor)',
      },
    ];

    this.kpiData = [
      {
        title: 'Strategic objective',
        desc: details.strategicObjective || 'N/A',
      },
      {
        title: 'Strategic objective relative',
        desc: details.strategicObjectiveRelative || 'N/A',
      },
      { title: 'Activation period', desc: details.activationPeriod || 'N/A' },
      {
        title: 'Reporting frequency',
        desc: details.reportingFrequency || 'N/A',
      },
      { title: 'Data source', desc: details.dataSource || 'N/A' },
      {
        title: 'Validation Authority',
        desc: details.validationAuthority || 'N/A',
      },
      { title: 'Custodian email', desc: details.custodianEmail || 'N/A' },
      { title: 'Custodian Title', desc: details.custodianTitle || 'N/A' },
    ];

    this.kpiDefinition = details.definition || 'N/A';
    this.kpiFormula = details.formula || 'N/A';

    this.cardItems[0].chartData = this.mapChartData(details.values);
    this.cardItems[1].progress = [
      {
        value: details.baseline || 0,
        label: 'Baseline',
        bgColor: 'var(--stcOasisColor)',
      },
      {
        value: details.celing || 0,
        label: 'Celing',
        bgColor: 'var(--stc-color)',
      },
      {
        value: details.kpiTarget * 100 || 0,
        label: 'Target',
        bgColor: 'var(--stc-pink-color)',
      },
    ];
    this.chunkedTitles = this.chunkArray(this.kpiData, 4);
  }

  shouldRotateArrow(overViewDesc: string): boolean {
    return overViewDesc.toLowerCase().includes('decreasing');
  }

  mapChartData(values: KpiValue[]): any[] {
    return values.map((value: KpiValue) => ({
      year: value.yearNum,
      Actual: value.kpiValue,
      Target: value.kpiTarget,
    }));
  }
}
