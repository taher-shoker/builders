import { Component, input, InputSignal, OnInit } from '@angular/core';
import { ProgramKPIService } from '../../services/program-kpi.service';
import { ActivatedRoute } from '@angular/router';
import { ProgramKPIDetails } from '../../models/program-kpi-details.model';
import { ProgramKPI } from '../../models/program-kpi.model';
import {
  KPIValue,
  StrategicProgramKPIDetails,
} from '../../models/strategic-program-kpi-details.model';
import { KpiValue } from '../../models/kpi-details.model';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SharedFormService } from 'apps/strategic-dashboard/src/app/shared/services/shared-form.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { YearService } from 'apps/strategic-dashboard/src/app/shared/services/year.service';

@Component({
  selector: 'stc-apps-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss'],
})
export class ProgramDetailsComponent implements OnInit {
  title: InputSignal<string> = input('Business efficiency program');
  programData = window.history.state.program;
  programName = '';
  programDetails: ProgramKPIDetails = {} as ProgramKPIDetails;
  programsKPIs: ProgramKPI[] = [];
  currentDate = new Date();
  year = this.currentDate.getFullYear();
  currentYear = this.currentDate.getFullYear() - 1;
  cardItems: any[] = [];
  selectedYearRange: { start: number; end: number } = {
    start: 2000,
    end: 2024,
  };
  constructor(
    private route: ActivatedRoute,
    private programKPIService: ProgramKPIService,
    private sharedForm:SharedFormService,
    private yearService: YearService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.programName = params.get('programName') || '';

      if (this.programName) {
        this.getAllProgramsKPIs();
        this.getProgramDetails();
      }
    });
    this.yearService.getQuarterChangeObservable().subscribe((quarter: string) => {
      this.getProgramDetails();
    });
  }
  yearsArray: any[] = [
    { name: this.currentYear },
    { name: this.currentDate.getFullYear() },
  ];
  setChartsData(programDetailsValues: any) {
    console.log(this.programDetails.values);

    this.cardItems = [
      {
        title: 'Status of the program',
        chartType: 'donut',
        progress: [
          {
            value: this.programDetails.actualValue * 100,
            label: 'Actul',
            bgColor: 'var(--stcOasisColor)',
          },
          {
            value: this.programDetails.target * 100,
            label: 'Planned',
            bgColor: 'var(--stc-color)',
          },
          {
            value: Math.abs(this.programDetails.deviation * 100),
            label: 'deviation',
            bgColor: 'var(--stc-pink-color)',
          },
        ],
      },
      {
        title: 'Budget variance',
        chartType: 'line',
        progress: programDetailsValues?.map((value: any) => {
          const obj: KpiValue = {} as KpiValue;
          obj.yearNum = value.year;
          obj.kpiValue = value.budgetSpend;
          obj.kpiTarget = value.budgetTarget;
          return obj;
        }),
      },
      {
        title: 'Completion VS plan',
        chartType: 'line',
        progress: programDetailsValues?.map((value: any) => {
          console.log(value);
          const obj: KpiValue = {} as KpiValue;
          obj.yearNum = value.year;
          obj.kpiValue = value.completionActual;
          obj.kpiTarget = value.completionTarget;
          return obj;
        }),
      },
      {
        title: 'KPIs Performance',
        chartType: 'progress',
        progress: [
          {
            value: this.programDetails.actualValue,
            target: this.programDetails.target,
            bgColor: this.getChartColors(
              this.programDetails.actualValue,
              this.programDetails.redThreshold,
              this.programDetails.greenThreshold
            ),
          },
        ],
      },
    ];
  }
  getAllProgramsKPIs() {
    this.programKPIService
      .getAllProgramsKPIs({ programName: this.programName })
      .subscribe((result: ProgramKPI[]) => {
        this.programsKPIs = result;
      });
  }
  getProgramDetails() {
    const yearQuarter:string=this.sharedForm.getForm().controls['year'].value;
    const params = {
      programName: this.programName,
      quarter: yearQuarter.split('-')[1],
    };
    this.programKPIService
      .getKPIProgramDetails(params)
      .subscribe((result: StrategicProgramKPIDetails) => {
        console.log('program details api', result);
        this.programDetails = result;
        this.setChartsData(this.programDetails.values);
      });
  }

  getChartColors(
    value: number,
    redThershold: number,
    greenThershold: number
  ): string {
    console.log(value, redThershold, greenThershold);

    if (value >= greenThershold) {
      return 'var(--stcOasisColor)';
    } else if (value <= redThershold) {
      console.log('inside red');

      return 'var(--stc-red-color)';
    } else {
      console.log('inside orange');
      return 'var(--stcSunsetColor)';
    }
  }
  onRangeChange(range: { start: number; end: number }) {
    this.selectedYearRange = range;

    const filteredDetails = this.programDetails.values?.filter((value) => {
      return +value.year >= range.start && +value.year <= range.end;
    });
    this.setChartsData(filteredDetails);
    console.log(filteredDetails);
  }
}
