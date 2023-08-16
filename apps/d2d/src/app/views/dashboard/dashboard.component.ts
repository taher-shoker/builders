import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProgressCircleData } from '@stc-apps/shared-ui';
import { BarChartData } from '@stc-apps/shared-ui';
import { LineChartData } from '@stc-apps/shared-ui';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { LanguageManagerService } from '@stc-apps/lng-selector';
import { Subscription } from 'rxjs';
interface RegisteredCases {
  titleEn? : string;
  titleAr? : string;
  lineChartColors:string[];
  chartData:LineChartData[]
}
interface TeamUsers {
  titleEn? : string;
  titleAr? : string;
  data:BarChartData[]
}
interface CaseTypes {
  titleEn? : string;
  titleAr? : string;
  chartColors:string[];
  chartData:ProgressCircleData[];
  totalCases:number;
}
export interface DashboardUsersCases {
  titleEn? : string;
  titleAr? : string;
  allCaseCount : number;
  approvedCaseCount : number;
  rejectedCaseCount : number;
}
@Component({
  selector: 'stc-apps-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit{
  dashboardUserCases?:DashboardUsersCases;
  langSub!: Subscription;
  direction:string | null = '';
  constructor(
    private dashboardService:DashboardService ,
    private authService:AuthService,
    private languageManagerService: LanguageManagerService
  ){}
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
  productivityTeamUsers?:TeamUsers;
  registeredCasesChart?:RegisteredCases;
  casesTypes?: CaseTypes;
  stages?:TeamUsers;
  getDashboardUsers()
  {
    this.dashboardService.getDashboardUsersData().subscribe((data:DashboardUsersCases) => {
      this.dashboardUserCases = data;
    })
  }
  getProductivityChartData()
  {
    this.dashboardService.getProductivityChartData().subscribe((data) => {
      const newData:{name:string , value:number}[] = [];
      data.data.forEach((chart:{fraudUserDisplayName:string , productivityFrequency:number}) => {
        newData.push({
          name : chart.fraudUserDisplayName,
          value : chart.productivityFrequency
        })
      });
      this.productivityTeamUsers = {
        titleEn : "Fraud Team Productivity Users",
        titleAr : "مستخدمي إنتاجية فريق الاحتيال",
        data : newData
      };
    })
  }
  getStatusChartData()
  {
    this.dashboardService.getStatusChartData().subscribe(data => {
      console.log(data);
      const newData:{name:string , value:number}[] = [];
      data.data.forEach((chart:{caseStatus:string , caseCount:number}) => {
        newData.push({
          name : chart.caseStatus,
          value : chart.caseCount
        })
      });
      this.stages = {
        titleEn : "Fraud Team Productivity Users",
        titleAr : "مستخدمي إنتاجية فريق الاحتيال",
        data : newData
      };
    })
  }
  getTrendChartData()
  {
    // console.log(this.authService.getLoggedInUser());
    this.dashboardService.getWeeklyTrendChartData("hussien.essam@qeema.net").subscribe(data => {
      console.log(data);
      // if(data.data.length > 0)
      // {
      // }
      const newData:{category:number | string , value:number}[] = [];
      data.data.forEach(chart => {
        newData.push({
          category : chart.yearNum.toString(),
          value : chart.weekNum,
        })
      })
      this.registeredCasesChart = {
        titleEn : "weekly trend chart for registered cases",
        titleAr : "مخطط الاتجاه الأسبوعي للحالات المسجلة",
        lineChartColors : ['#45006F' , '#FF6A39'],
        chartData : newData
      }
    })
  }
  getChartTypesData()
  {
    this.dashboardService.getChartTypesData().subscribe(data => {
      console.log(data);
      let newData:{category:string , value:number}[] = [];
      data.d2DCaseTypeCountDtoList.forEach(chart => {
        newData.push({
          category : chart.caseType,
          value : chart.caseCount,
        })
      })
      newData = newData.splice(newData.length - 6,6);
      this.casesTypes = {
        titleEn : "chart to compare the cases to each other with case type",
        titleAr : "مخطط لمقارنة الحالات مع بعضها البعض بنوع الحالة",
        chartColors : ["#4f008c" , "#ff1a1a" , "#8e9aa0" , "#1bced8" , "#ffdd40" , "#ff6a39"],
        totalCases : this.dashboardUserCases && this.dashboardUserCases.allCaseCount ? this.dashboardUserCases.allCaseCount : 0,
        chartData : newData
      }
    })
  }
  ngOnInit(): void {
    this.getDashboardUsers();
    this.getProductivityChartData();
    this.getStatusChartData();
    this.getTrendChartData();
    this.getChartTypesData();
    this.langSub = this.languageManagerService.getSavedLanguageAsStream().subscribe((lang:string) => {
      this.direction = localStorage.getItem("language");
    })
  }
}
