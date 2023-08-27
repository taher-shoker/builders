import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateRange, ProgressCircleData, WeeklyDateObj, YearRangeObj } from '@stc-apps/shared-ui';
import { BarChartData } from '@stc-apps/shared-ui';
import { LineChartData } from '@stc-apps/shared-ui';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { LanguageManagerService } from '@stc-apps/lng-selector';
import { Subscription } from 'rxjs';
import { CasesService, Team, User } from '../casses-setting/casses.service';
import { DateAdapter } from '@angular/material/core';


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

  filterType = [
    {name: "User", value: 0},
    {name: "Team", value: 1},
  ]

  dateFilterOption = [
    {name: "Last year to date", id:0},
    {name: "Last 30 days", id:1},
    {name: "Last week", id:2},
    {name: "Today", id:3},
  ]

  users : User[] = []
  teams : Team[] = []

  filterValueForm: FormGroup = new FormGroup({
    filterType: new FormControl(this.filterType[1]),
    filterValue: new FormControl({})
  })

  filterProductivityGroup: FormGroup = new FormGroup({
    filterValue: new FormControl({})
  })

  productivityTeamUsers?:TeamUsers;
  registeredCasesChart?:RegisteredCases;
  casesTypes?: CaseTypes;
  stages?:TeamUsers;

  endDate: Date = new Date();
  startDate : Date = new Date(new Date().setDate(new Date().getDate() - 7))

  constructor(
    private dashboardService:DashboardService ,
    private authService:AuthService,
    private languageManagerService: LanguageManagerService,
    private casesService: CasesService,
    private dateAdapter: DateAdapter<any>
  ){}

  ngOnInit(): void {
    this.getDashboardInsights();
    this.getStatusChartData(this.startDate.toLocaleDateString('sv'), this.endDate.toLocaleDateString('sv'));
    this.getChartTypesData();
    this.getUsersAndTeams();
    this.langSub = this.languageManagerService.getSavedLanguageAsStream().subscribe((lang:string) => {
      this.direction = localStorage.getItem("language");
      this.dateAdapter.setLocale(this.direction)
    })

    this.filterProductivityGroup.get('filterValue')?.setValue(this.dateFilterOption[1])
    this.filterProductivityUser(this.dateFilterOption[1]);

  }

  getDashboardInsights()
  {
    // this.dashboardService.getDashboardUsersData().subscribe((data:DashboardUsersCases) => {
    //   this.dashboardUserCases = data;
    // })

    this.dashboardService.getStatusChartData(this.startDate.toLocaleDateString('sv'), this.endDate.toLocaleDateString('sv'))
  }

  getProductivityChartData(fromDate: string, toDate: string)
  {
    this.dashboardService.getProductivityChartData(fromDate, toDate).subscribe((data) => {
      const newData:{name:string , value:number}[] = [];
      data.data.forEach((chart:{fraudUserDisplayName:string , productivityFrequency:number}) => {
        newData.push({
          name : chart.fraudUserDisplayName,
          value : chart.productivityFrequency
        })
      });
      this.productivityTeamUsers = {
        titleEn : "Fraud Team Productivity",
        titleAr : "إنتاجية فريق مكافحة الاختلاسات",
        data : newData
      };
    })
  }

  insightsData: any[] = []

  getStatusChartData(fromDate?: string, toDate?: string)
  {
    this.dashboardService.getStatusChartData(fromDate, toDate).subscribe(data => {
      const newData:{name:string , value:number}[] = [];

      data.data.forEach((chart:{caseStatus:string , caseCount:number}) => {
        newData.push({
          name : chart.caseStatus,
          value : chart.caseCount
        });

        this.insightsData.push({
          name : chart.caseStatus,
          value : chart.caseCount
        })
      });

      this.stages = {
        titleEn : "Each stage count",
        titleAr : "عدد حالات كل مرحلة",
        data : newData
      };

    })
  }

  getTrendChartData(fromDate?: WeeklyDateObj, toDate?: WeeklyDateObj, user? : string, team?: string)
  {
    this.dashboardService.getWeeklyTrendChartData(user, team, fromDate, toDate).subscribe(data => {
      const newData:{category:number | string , value:string , caseCount:number}[] = [];
      data.data.forEach(chart => {
        newData.push({
          category : chart.yearNum.toString(),
          value : `W ${chart.weekNum}`,
          caseCount : chart.casesCount

        })
      })
      this.registeredCasesChart = {
        titleEn : "Weekly Trend For All Cases",
        titleAr : "الاتجاه الأسبوعي لكل الحالات",
        lineChartColors : ['#45006F' , '#FF6A39'],
        chartData : newData
      }
    })
  }

  getChartTypesData(fromDate?: string, toDate?: string)
  {

    this.dashboardService.getChartTypesData(fromDate, toDate).subscribe(data => {
      const newData:{category:string , value:number}[] = [];
      data.d2DCaseTypeCountDtoList.forEach(chart => {
        newData.push({
          category : chart.caseType,
          value : chart.caseCount,
        })
      })

      this.casesTypes = {
        titleEn : "Cases of each type",
        titleAr : "حالات كل نوع",
        chartColors : ["#4f008c" , "#ff1a1a" , "#8e9aa0" , "#1bced8" , "#ffdd40" , "#ff6a39"],
        totalCases : this.dashboardUserCases && this.dashboardUserCases.allCaseCount ? this.dashboardUserCases.allCaseCount : 0,
        chartData : newData
      }
    })
  }

  getUsersAndTeams(){
    this.authService.loggedUserStream.subscribe(res => {
      if(res?.roles.includes("APPROVERS")){

        this.casesService.setSystemTeams().subscribe(res => {

          this.teams = res
          this.teams = this.teams.filter((x: any) => x.name !== "Fraud")

          this.getTrendChartData(undefined, undefined, undefined, this.teams[0].name);
          // this.filterValueForm.get("filterType")?.setValue(this.filterType[1])
          this.filterValueForm.get("filterValue")?.setValue(this.teams[0])

        })

        this.casesService.setSystemUsers().subscribe(res => {


          this.users = res.filter(x => x.userGroups[0].groupName === "Creators")
        })
      }
    })
  }

  filterLineChartWithDate(filterObj: YearRangeObj){

    if(this.filterValueForm.get('filterValue')?.value.email){
      this.getTrendChartData(filterObj.fromDate, filterObj.toDate, this.filterValueForm.get('filterValue')?.value.email)

    }else{
      this.getTrendChartData(filterObj.fromDate, filterObj.toDate, undefined, this.filterValueForm.get('filterValue')?.value.name)

    }
  }

  filterProgressCircle(newDate: DateRange){

    this.getChartTypesData(newDate.fromDate.toLocaleDateString('sv'), newDate.toDate.toLocaleDateString('sv'))
  }

  filterLineChartWithUser(user: any){
    if(user.email){
      this.getTrendChartData(undefined, undefined, user.email)
    }else{
      this.getTrendChartData(undefined ,undefined, undefined, user.name)
    }
  }

  filterProductivityUser(dateObj : {name: string, id: number}){

    let filterValue;
    let fromDate;
    let toDate;

    if(dateObj.id === 0){
      const d = new Date();
      d.setFullYear(d.getFullYear())
      toDate = d.toLocaleDateString('sv');

      d.setFullYear(d.getFullYear() - 1)
      fromDate = d.toLocaleDateString('sv')


    }else if(dateObj.id === 1){

      // Get the current date
      const today = new Date();
      // Format the date as year-month-day
      toDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
      // Get the date one month before by subtracting 30 days in milliseconds
      const oneMonthBefore = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      // Format the date as year-month-day
      fromDate = oneMonthBefore.getFullYear() + "-" + (oneMonthBefore.getMonth() + 1) + "-" + oneMonthBefore.getDate();
      // Return an array of the two dates

    }else if(dateObj.id === 2){
      // Get the current date
      const today = new Date();
      // Format the date as year-month-day
      toDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
      // Get the date one month before by subtracting 30 days in milliseconds
      const oneMonthBefore = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      // Format the date as year-month-day
      fromDate = oneMonthBefore.getFullYear() + "-" + (oneMonthBefore.getMonth() + 1) + "-" + oneMonthBefore.getDate();
      // Return an array of the two dates

    }else {
       // Get the current date
       const today = new Date();
       // Format the date as year-month-day
       toDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
       fromDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    }
    this.getProductivityChartData(fromDate, toDate)
  }

  filterStages(newDate: DateRange){
    this.getStatusChartData(newDate.fromDate.toLocaleDateString('sv'), newDate.toDate.toLocaleDateString('sv'))
  }



}
