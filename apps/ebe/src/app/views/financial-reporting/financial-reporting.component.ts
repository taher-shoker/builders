import { Component, inject , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { EditModeViewComponent } from '../scorecard/components/edit-mode-view/edit-mode-view.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { FileModel } from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
@Component({
  selector: 'stc-apps-financial-reporting',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , EditModeViewComponent , SharedUiModule , SharedUiModule],
  templateUrl: './financial-reporting.component.html',
  styleUrl: './financial-reporting.component.scss',
})
export class FinancialReportingComponent implements OnInit {
  currentMode!: 'editMode' | 'viewMode';
  scorecardService = inject(ScorecardService);
  visible = false;
  colors:string[] = ["#61CBD6" , "#00c48c"];
  chartData4 = [
    {
      title : "Awarded",
      value : 34,
      color : "#00C48C"
    },
    {
      title : "Saved/dropped",
      value : 20,
      color : "#8E9AA0"
    },
    {
      title : "in progress",
      value : 79,
      color : "#4F008C"
    }
  ];
  chartData2 = [
    {
      category : "Actual",
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
  chartData = [
    {
      title: 'AE',
      value: 80,
      color:"#B999D1"
    },
    {
      title: 'AA',
      value: 35,
      color : "#61CBD6"
    },
    {
      title: 'SA',
      value: 92,
      color:"#00C48C"
    },
    {
      title: 'DG',
      value: 50,
      color:"#4F008C"
    },
  ]
  ngOnInit()
  {
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
  }
  showDialog()
  {
    this.visible = true;
  }
  downloadTemplate()
  {
    console.log('download');
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
