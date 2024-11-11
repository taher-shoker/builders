import { Component, inject , OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { EditModeViewComponent } from '../scorecard/components/edit-mode-view/edit-mode-view.component';
import { SharedUiModule , SharedService} from '@stc-apps/shared-ui';
import { FileModel } from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
import { FinancialReportingService } from '../../services/financial-reporting.service';
import { Subject, takeUntil } from 'rxjs';
import { CapexOpex, CapexOpexChart, CapexOpexModel, Tendering } from '../../models/financial.mode';
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
  capexOverallData!:CapexOpex;
  opexOverallData!:CapexOpex;
  sharedService = inject(SharedService);
  toastr = inject(ToastrService);
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
  chartData2:{
    category:string;
    value:number
  }[] = []
  chartData3:{
    category:string;
    value:number
  }[] = []
  chartData:CapexOpexChart[] = []
  chartData4:CapexOpexChart[] = []
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  ngOnInit()
  {
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
    this.getFinancialReportingData();
  }
  capexTendringData!:Tendering;
  opexTendringData!:Tendering;
  private getFinancialReportingData()
  {
    this.chartData4 = [];
    this.chartData = [];
    this.financialReportingService.getFinancialReportingData().pipe(takeUntil(this.endSubs$)).subscribe({
      next : (res:CapexOpexModel) => {
        console.log(res);
        this.capexOpexData = res;
        this.capexOverallData = this.capexOpexData.capexOpex.filter((data:CapexOpex) => data.expenditureType === "capex" && data.expenditureSubtype === "overall")[0];
        const capexChartData:CapexOpex[] = this.capexOpexData.capexOpex.filter((data:CapexOpex) => data.expenditureType === "capex" && data.expenditureSubtype !== "overall")
        const opexChartData:CapexOpex[] = this.capexOpexData.capexOpex.filter((data:CapexOpex) => data.expenditureType === "opex" && data.expenditureSubtype !== "overall")
        this.opexOverallData = opexChartData[0];
        this.capexTendringData = this.capexOpexData.tendering.filter((data:Tendering) => data.expenditureType === "capex")[0]
        this.opexTendringData = this.capexOpexData.tendering.filter((data:Tendering) => data.expenditureType === "opex")[0]
        this.chartData2 = [
          {
            category : "Accural",
            value : +opexChartData[0].accrualPercentage
          },
          {
            category : "Spend",
            value : +opexChartData[0].spendPercentage
          }
        ]
        this.chartData3 = [
          {
            category : "Target",
            value : opexChartData[0].gepTarget ? opexChartData[0].gepTarget : 0
          },
          {
            category : "Achieved",
            value : opexChartData[0].gepAchieved ? opexChartData[0].gepAchieved : 0
          }
        ]
        const colors = ["#B999D1" , "#61CBD6" , "#00C48C" , "#4F008C"];
        this.capexTenderingChart = [
          {
            title : "Awarded",
            value : +this.capexTendringData.awardedProjects,
            color : "#00C48C"
          },
          {
            title : "Saved/dropped",
            value : +this.capexTendringData.savedDroppedProjects,
            color : "#8E9AA0"
          },
          {
            title : "in progress",
            value : +this.capexTendringData.inProgressProjects,
            color : "#4F008C"
          }
        ]
        this.opexTenderingChart = [
          {
            title : "Awarded",
            value : +this.opexTendringData.awardedProjects,
            color : "#00C48C"
          },
          {
            title : "Saved/dropped",
            value : +this.opexTendringData.savedDroppedProjects,
            color : "#8E9AA0"
          },
          {
            title : "in progress",
            value : +this.opexTendringData.inProgressProjects,
            color : "#4F008C"
          }
        ]
        capexChartData.forEach((data2:CapexOpex , index:number) => {
          this.chartData.push({
            title: data2.expenditureSubtype,
            value1: +data2.spendPercentage,
            value2: +data2.accrualPercentage,
            color:colors[index]
          })
        })
        this.chartData4 = [...this.chartData];
        console.log(this.chartData4);
        // this.sharedService.chartData.next(this.chartData);
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
