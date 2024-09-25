import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';

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
export class StrategyProgramComponent implements OnInit , OnDestroy {
  strategyProgramService = inject(StrategyProgramService);
  strategyProgramData!: StrategyProgramModel;
  currentMode!: 'editMode' | 'viewMode';
  scorecardService = inject(ScorecardService);
  endSubs$:Subject<boolean> = new Subject();
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
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  private getStrategyProgramSummary() {
    this.strategyProgramService.getStrategyProgramSummary().pipe(takeUntil(this.endSubs$)).subscribe({
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
  downloadTemplate()
  {
    this.strategyProgramService.downloadStrategyProgram().subscribe({
      next : (response) => {
        this.downloadFile(response, `cad_summary.csv`);
      }
    })
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
}
