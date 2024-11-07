import { Component, inject , OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { EditModeViewComponent } from '../scorecard/components/edit-mode-view/edit-mode-view.component';
import { SharedUiModule , SharedService} from '@stc-apps/shared-ui';
import { FileModel } from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
import { FinancialReportingService } from '../../services/financial-reporting.service';
import { Subject, takeUntil } from 'rxjs';
import { CapexOpex, CapexOpexChart, CapexOpexModel } from '../../models/financial.mode';

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
  chartData4 = [
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
  chartData2 = [
    {
      category : "Accural",
      value : 20
    },
    {
      category : "Spend",
      value : 40
    }
  ]
  chartData3 = [
    {
      category : "Target",
      value : 200
    },
    {
      category : "Achieved",
      value : 123
    }
  ]
  chartData:CapexOpexChart[] = []
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
  private getFinancialReportingData()
  {
    this.financialReportingService.getFinancialReportingData().pipe(takeUntil(this.endSubs$)).subscribe({
      next : (res:CapexOpexModel) => {
        console.log(res);
        this.capexOpexData = res;
        this.capexOverallData = this.capexOpexData.capexOpex.filter((data:CapexOpex) => data.expenditureType === "capex" && data.expenditureSubtype === "overall")[0];
        this.opexOverallData = this.capexOpexData.capexOpex.filter((data:CapexOpex) => data.expenditureType === "opex" && data.expenditureSubtype === "overall")[0];
        const capexChartData:CapexOpex[] = this.capexOpexData.capexOpex.filter((data:CapexOpex) => data.expenditureType === "capex" && data.expenditureSubtype !== "overall")
        const colors = ["#B999D1" , "#61CBD6" , "#00C48C" , "#4F008C"];
        capexChartData.forEach((data2:CapexOpex , index:number) => {
          this.chartData.push({
            title: data2.expenditureSubtype,
            value1: +data2.spendAmount,
            value2: +data2.accrualAmount,
            color:colors[index]
          })
        })
        this.sharedService.chartData.next(this.chartData);
        console.log(this.chartData);
      }
    })
  }
  showDialog()
  {
    this.visible = true;
  }
  downloadTemplate()
  {
    console.log('download');
  }
  downloadFile(data: string, filename: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  importData(file:FileModel)
  {
    if(file)
    {
      console.log(file);
    }
  }
  onHide()
  {
    this.visible = false;
  }
}
