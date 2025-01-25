import { Component, inject , OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { EditModeViewComponent } from '../scorecard/components/edit-mode-view/edit-mode-view.component';
import { SharedUiModule , SharedService} from '@stc-apps/shared-ui';
import { FileModel } from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
import { FinancialReportingService } from '../../services/financial-reporting.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CapexModel, CapexOpexModel, TenderingModel } from '../../models/financial.mode';
import { ToastrService } from 'ngx-toastr';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { DatePipe } from '@angular/common';
import { ActivityLog } from '../../models/activity-logs';
@Component({
  selector: 'stc-apps-financial-reporting',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , EditModeViewComponent , SharedUiModule , OverlayPanelModule],
  templateUrl: './financial-reporting.component.html',
  styleUrl: './financial-reporting.component.scss',
})
export class FinancialReportingComponent implements OnInit , OnDestroy{
  currentMode!: 'editMode' | 'viewMode';
  scorecardService = inject(ScorecardService);
  financialReportingService = inject(FinancialReportingService);
  visible = false;
  colors:string[] = ["#61CBD6" , "#00c48c"];
  endSubs$:Subject<boolean> = new Subject();
  capexOpexData!:CapexOpexModel;
  sharedService = inject(SharedService);
  toastr = inject(ToastrService);
  activityLogsTableHeader!:ColumnsSchema[];
  activityLogsTableBody!:ActivityLog[];
  chartColors = ["#B999D1" , "#61CBD6" , "#00C48C" , "#4F008C" , "#000"];
  opexTenderingChart:{
    title:string;
    value:number;
    color:string;
  }[] = [
    {
      title : "Awarded",
      value : 40,
      color : "#00C48C"
    },
    {
      title : "Saved/dropped",
      value : 20,
      color : "#8E9AA0"
    },
    {
      title : "in progress",
      value : 40,
      color : "#4F008C"
    }
  ];
  capexTenderingChart:{
    title:string;
    value:number;
    color:string;
  }[] = [];
  spendingTargetChart:{
    name:string;
    value:number,
    color?:string
  }[] = []
  gepTargetChart:{
    name:string;
    value:number,
    color?:string
  }[] = [];
  capexChartData:{
    title: string,
    value1: number,
    value2: number,
    color:string
  }[] = [];
  capexTenderingData!:TenderingModel;
  opexTenderingData!:TenderingModel;
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  constructor(private datePipe:DatePipe){}
  // myObservable$ = new Observable(observer => {
  //   observer.next(1);
  //   observer.next(2);
  //   observer.next(3);
  // }).subscribe({
  //   next : (res) => {
  //     console.log(res);
  //   }
  // });
  // myPromise = new Promise((resolve , reject) => {
  //   resolve(1);
  //   resolve(2);
  //   resolve(3);
  // }).then(res => console.log(res))
  ngOnInit()
  {
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
    this.getFinancialReportingData();
    this.activityLogsTableBody = [
      {
        username:"Hamed Rahed",
        type:"import",
        details:"financial of scorecards",
        time:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!
      },
      {
        username:"Hamed Rahed",
        type:"import",
        details:"financial of scorecards",
        time:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!
      },
      {
        username:"Hamed Rahed",
        type:"import",
        details:"financial of scorecards",
        time:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!
      },
      {
        username:"Hamed Rahed",
        type:"import",
        details:"financial of scorecards",
        time:this.datePipe.transform(new Date(), 'dd MMM yyyy \'at\' hh:mm a')!
      },
    ]
    this.activityLogsTableHeader = [
      {
        key : "username",
        type : "text",
        label : "User Name"
      },
      {
        key : "type",
        type : "text",
        label : "Activity Type"
      },
      {
        key : "details",
        type : "text",
        label : "Activity Details"
      },
      {
        key : "time",
        type : "text",
        label : "Time Stamp"
      },
    ]
  }
  showActivityLogsPopup = false;
  showActivityLogs()
  {
    // this.activityLogsPanel.toggle(event);
    this.showActivityLogsPopup = !this.showActivityLogsPopup;
  }
  popupClosed()
  {
    this.showActivityLogsPopup = false;
  }
  private getFinancialReportingData()
  {
    // this.capexOpexData = {"opex":[],"capex":[],"tendering":[]};
    this.financialReportingService.getFinancialReportingData().pipe(takeUntil(this.endSubs$)).subscribe({
      next : (res:CapexOpexModel) => {
        this.capexOpexData = res;     
        this.capexTenderingData = this.capexOpexData.tendering.filter(d => d.expenditureType.toLowerCase() === 'capex')[0]
        this.opexTenderingData = this.capexOpexData.tendering.filter(d => d.expenditureType.toLowerCase() === 'opex')[0]
        const chartData:{
          title: string,
          value1: number,
          value2: number,
          color:string
        }[] = []
        this.capexOpexData.capex.forEach((data2:CapexModel , index:number) => {
          chartData.push({
            title: data2.expenditureSubtype,
            value1: +data2.spendPercentage,
            value2: +data2.accrualPercentage,
            color:this.chartColors[index]
          })
        })
        this.capexChartData = [...chartData];        
        if(this.capexTenderingData)
        {
          this.capexTenderingChart = [
            {
              title : "Awarded",
              value : +this.capexTenderingData.awardedProjects,
              color : "#00C48C"
            },
            {
              title : "Saved/dropped",
              value : +this.capexTenderingData.savedDroppedProjects,
              color : "#8E9AA0"
            },
            {
              title : "in progress",
              value : +this.capexTenderingData.inProgressProjects,
              color : "#4F008C"
            }
          ]
        }
        if(this.opexTenderingData)
        {
          this.opexTenderingChart = [
            {
              title : "Awarded",
              value : +this.opexTenderingData.awardedProjects,
              color : "#00C48C"
            },
            {
              title : "Saved/dropped",
              value : +this.opexTenderingData.savedDroppedProjects,
              color : "#8E9AA0"
            },
            {
              title : "in progress",
              value : +this.opexTenderingData.inProgressProjects,
              color : "#4F008C"
            }
          ]
        }
        // console.log(res);
        // console.log(this.capexTenderingData);
        // console.log(this.opexTenderingData);
        // console.log(this.capexTenderingChart);
        // console.log(this.opexTenderingChart);
        if(this.capexOpexData.opex[0] && this.capexOpexData.opex[0].accrualPercentage)
        {
          this.spendingTargetChart = [
            {
              name : "Accural",
              value : +this.capexOpexData.opex[0].accrualPercentage,
              color : "#4F008C"
            },
            {
              name : "Spent",
              value : +this.capexOpexData.opex[0].spendPercentage,
              color : "#00B050"
            }
          ]
        }
        console.log(this.spendingTargetChart);
        if(this.capexOpexData.opex[0] && this.capexOpexData.opex[0].gepTargetPercentage)
        {
          this.gepTargetChart = [
            {
              name : "Target",
              value : this.capexOpexData.opex[0].gepTargetPercentage ? this.capexOpexData.opex[0].gepTargetPercentage : 0,
              color : "#4F008C"
            },
            {
              name : "Achieved",
              value : this.capexOpexData.opex[0].gepAchievedPercentage ? this.capexOpexData.opex[0].gepAchievedPercentage : 0,
              color : "#00B050"
            }
          ]
        }
      }
    })
  }
  showDialog()
  {
    this.visible = true;
  }
  downloadTemplate()
  {
    this.financialReportingService.downloadFinancialReportingData();
  }
  importData(file:FileModel)
  {
    if(file)
    {
      console.log(file);
      this.financialReportingService.uploadCadSummaryFile(file).subscribe({
        next:() => {
          this.getFinancialReportingData();
          this.toastr.success("The File is Saved Successfully");
          this.visible = false;
        },
        error : () => {
          this.visible = false;
        }
      })
    }
  }
  onHide()
  {
    this.visible = false;
  }
}
