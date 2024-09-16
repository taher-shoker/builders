import { Component, input, InputSignal, OnInit } from '@angular/core';
import { ProgramKPIService } from '../../services/program-kpi.service';
import { ActivatedRoute } from '@angular/router';
import { ProgramKPIDetails } from '../../models/program-kpi-details.model';
import { ProgramKPI } from '../../models/program-kpi.model';
import {
  KPIValue,
  StrategicProgramKPIDetails,
} from '../../models/strategic-program-kpi-details.model';

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
  cardItems: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private programKPIService: ProgramKPIService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.programName = params.get('programName') || '';

      if (this.programName) {
        this.getAllProgramsKPIs();
        this.getProgramDetails();
      }
    });
  }

  yearsArray: any = [
    { name: 2020 },
    { name: 2021 },
    { name: 2022 },
    { name: 2023 },
  ];
  setChartsData() {
    console.log(this.programDetails.values);

    this.cardItems = [
      {
        title: 'Status of the program',
        chartType: 'donut',
        progress: [
          {
            value: this.programDetails.actualValue * 100,
            label: 'Actul',
            bgColor: this.getChartColors(
              this.programDetails.actualValue,
              this.programDetails.redThreshold,
              this.programDetails.greenThreshold
            ),
          },
          {
            value: this.programDetails.target * 100,
            label: 'Planned',
            bgColor: this.getChartColors(
              this.programDetails.target,
              this.programDetails.redThreshold,
              this.programDetails.greenThreshold
            ),
          },
          {
            value: Math.abs(this.programDetails.deviation * 100),
            label: 'deviation',
            bgColor: this.getChartColors(
              this.programDetails.deviation,
              this.programDetails.redThreshold,
              this.programDetails.greenThreshold
            ),
          },
        ],
      },
      {
        title: 'Budget variance',
        chartType: 'line',
        // progress: this.programDetails.values?.map((value) => {
        //   let obj: any;
        //   obj.year = value.year;
        //   obj.actual = value.budgetSpend;
        //   obj.target = value.budgetTarget;
        //   return obj;
        // }),
      },
      {
        title: 'Completion VS plan',
        chartType: 'line',
        progress: this.programDetails.values?.map((value) => {
          console.log(value);

          let obj: any;
          obj.budgetTarget = value.budgetTarget;

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
    this.programKPIService
      .getKPIProgramDetails({ programName: this.programName })
      .subscribe((result: StrategicProgramKPIDetails) => {
        console.log('program details api', result);
        this.programDetails = result;
        this.setChartsData();
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
}
