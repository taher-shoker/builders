import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { StrategyProgramService } from '../../services/strategy-program.service';
import { StrategyProgramModel } from '../../models/strategy-program.model';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { StrategyKpiCardComponent } from './components/strategy-kpi-card/strategy-kpi-card.component';
import { ScorecardService } from '../../services/scorecard.service';
import { EditModeViewComponent } from '../scorecard/components/edit-mode-view/edit-mode-view.component';
import { DialogModalComponent } from '../../components/dialog/dialog.component';
import { FileModel } from '../../models/scorecard.model';

@Component({
  selector: 'stc-apps-strategy-program',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    SharedUiModule,
    StrategyKpiCardComponent,
    EditModeViewComponent,
    DialogModalComponent
  ],
  templateUrl: './strategyProgram.component.html',
  styleUrl: './strategyProgram.component.scss',
})
export class StrategyProgramComponent implements OnInit {
  strategyProgramService = inject(StrategyProgramService);
  strategyProgramData!: StrategyProgramModel;
  currentMode!: 'editMode' | 'viewMode';
  scorecardService = inject(ScorecardService);
  ngOnInit() {
    // this.strategyProgramData = [];
    this.getStrategyProgramSummary();
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
  }
  isEmptyData!: boolean;
  private getStrategyProgramSummary() {
    this.strategyProgramService.getStrategyProgramSummary().subscribe({
      next: (res: StrategyProgramModel) => {
        this.strategyProgramData = res;
        if (this.strategyProgramData.cadStrategyProgramDTO.length === 0) {
          this.isEmptyData = true;
        } else {
          this.isEmptyData = false;
        }
      },
    });
  }
  visible!:boolean;
  showDialog() {
    this.visible = true;
  }
  ImportFile(e:FileModel | null)
  {
    if(e)
    {
      console.log(e);
    }
  }
  downloadTemplate() {
    console.log('testt');
  }
}
