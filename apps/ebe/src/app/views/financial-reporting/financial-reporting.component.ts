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
  colors:string[] = ["#4F008C","#B999D1"];
  chartData = [
    {
      title: 'Research',
      value: 80,
      color:"#f00"
    },
    {
      title: 'Marketing',
      value: 35,
      color : "#634"
    },
    {
      title: 'Distribution',
      value: 92,
      color:"#000"
    },
    {
      title: 'Human Resources',
      value: 68,
      color:"#123"
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
