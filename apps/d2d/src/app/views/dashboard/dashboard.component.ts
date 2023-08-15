import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProgressCircleData, YearRangeObj } from '@stc-apps/shared-ui';
import { BarChartData } from '@stc-apps/shared-ui';
import { LineChartData } from '@stc-apps/shared-ui';
interface RegisteredCases {
  title : string;
  lineChartColors:string[];
  chartData:LineChartData[]
}
interface TeamUsers {
  title : string;
  barChartColors:string[];
  chartData:BarChartData[]
}
interface CaseTypes {
  title : string;
  chartColors:string[];
  chartData:ProgressCircleData[];
  totalCases:number;
}
@Component({
  selector: 'stc-apps-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  filterType = [
    {name: "User", value: 0},
    {name: "Team", value: 1},
  ]

  users = [
    {name: "User 1", value: 0},
    {name: "User 22", value: 1},
  ]

  teams = [
    {name: "Team 1", value: 0},
    {name: "Team 22", value: 1},
  ]


  filterValueForm: FormGroup = new FormGroup({
    filterType: new FormControl(this.filterType[0]),
    filterValue: new FormControl({})

  })

  registeredCasesChart:RegisteredCases = {
    title : "weekly trend chart for registered cases",
    lineChartColors : ['#45006F' , '#FF6A39'],
    chartData : [
      {
        category: 'Week One',
        value: 17,
      },
      {
        category: 'Week Two',
        value: 10,
      },
      {
        category: 'Week Three',
        value: 12,
      },
      {
        category: 'Week Four',
        value: 14,
      },
      {
        category: 'Week Five',
        value: 11,
      },
      {
        category: 'Week Six',
        value: 6,
      },
      {
        category: 'Week Seven',
        value: 7,
      },
      {
        category: 'Week Eight',
        value: 9,
      },
      {
        category: 'Week Nine',
        value: 13,
      },
      {
        category: 'Week Ten',
        value: 15,
      },
      {
        category: 'Week Eleven',
        value: 19,
      },
      {
        category: 'Week Twilve',
        value: 21,
      },
    ]
  }
  productivityTeamUsers:TeamUsers = {
    title : "froud team productivity users",
    barChartColors : ['#4F008C'],
    chartData : [
      {
        year: 'ahmed mohamed',
        income: 23.5,
        expenses: 21.1,
      },
      {
        year: 'tamer maged',
        income: 26.2,
        expenses: 30.5,
      },
      {
        year: 'ahmed mohsen',
        income: 30.1,
        expenses: 34.9,
      },
      {
        year: 'hany amer',
        income: 29.5,
        expenses: 31.1,
      },
      {
        year: 'tamer ahmed',
        income: 30.6,
        expenses: 28.2,
      },
      {
        year: 'hany amr',
        income: 34.1,
        expenses: 32.9,
      },
      {
        year: 'ahmed amr',
        income: 50,
        expenses: 22.9,
      },
      {
        year: 'ali ahmed',
        income: 20,
        expenses: 26.9,
      },
      {
        year: 'fawzey',
        income: 40,
        expenses: 50,
      },
      {
        year: 'seif ashraf',
        income: 10,
        expenses: 22.9,
      },
    ]
  };
  casesTypes: CaseTypes = {
    title : "chart to compare the cases to each other with case type",
    chartColors : ["#4f008c" , "#ff1a1a" , "#8e9aa0" , "#1bced8" , "#ffdd40" , "#ff6a39"],
    totalCases : 342,
    chartData : [
      {
        category: "219 Approved",
        value: 80,
        full: 100,
      },
      {
        category: "120 Rejected",
        value: 70,
        full: 100
      },
      {
        category: "76 Closed",
        value: 75,
        full: 100
      },
      {
        category: "23 Not Approved Yet",
        value: 66,
        full: 100
      },
      {
        category: "21 Escalation 1 Already sent",
        value: 90,
        full: 100
      },
      {
        category: "12 Escalation 2 Already sent",
        value: 90,
        full: 100
      },
    ]
  }
  stages:TeamUsers = {
    title : "count of cases in each stage",
    barChartColors : ['#4F008C'],
    chartData : [
      {
        year: 'stage one',
        income: 23.5,
        expenses: 21.1,
      },
      {
        year: 'stage two',
        income: 26.2,
        expenses: 30.5,
      },
      {
        year: 'stage three',
        income: 30.1,
        expenses: 34.9,
      },
      {
        year: 'stage four',
        income: 29.5,
        expenses: 31.1,
      },
      {
        year: 'stage five',
        income: 30.6,
        expenses: 28.2,
      },
      {
        year: 'stage six',
        income: 34.1,
        expenses: 32.9,
      },
      {
        year: 'stage seven',
        income: 50,
        expenses: 22.9,
      },
      {
        year: 'stage eight',
        income: 20,
        expenses: 26.9,
      },
      {
        year: 'stage nine',
        income: 40,
        expenses: 50,
      },
      {
        year: 'stage ten',
        income: 10,
        expenses: 22.9,
      },
    ]
  };

  filter(filterStr: string){
    console.log("Da filter", filterStr)
  }

  filterRangeDate(filterObj: Event){
    const filterObject = filterObj as unknown as YearRangeObj;
    console.log("Da filter", filterObject)
  }
}
