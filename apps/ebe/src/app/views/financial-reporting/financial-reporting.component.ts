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
@Component({
  selector: 'stc-apps-financial-reporting',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , EditModeViewComponent , SharedUiModule],
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
    category:string;
    value:number
  }[] = []
  gepTargetChart:{
    category:string;
    value:number
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
  }
  private getFinancialReportingData()
  {
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
        this.spendingTargetChart = [
          {
            category : "Accural",
            value : +this.capexOpexData.opex[0].accrualPercentage
          },
          {
            category : "Spend",
            value : +this.capexOpexData.opex[0].spendPercentage
          }
        ]
        console.log(this.spendingTargetChart);
        this.gepTargetChart = [
          {
            category : "Target",
            value : this.capexOpexData.opex[0].gepTargetPercentage ? this.capexOpexData.opex[0].gepTargetPercentage : 0
          },
          {
            category : "Achieved",
            value : this.capexOpexData.opex[0].gepAchievedPercentage ? this.capexOpexData.opex[0].gepAchievedPercentage : 0
          }
        ]
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
