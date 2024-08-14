import { Component, inject , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { StrategyProgramService } from '../../services/strategy-program.service';
import { StrategyProgramModel } from '../../models/strategy-program.model';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { StrategyKpiCardComponent } from './components/strategy-kpi-card/strategy-kpi-card.component';
import { ScorecardService } from '../../services/scorecard.service';
import { EditModeViewComponent } from '../scorecard/components/edit-mode-view/edit-mode-view.component';

@Component({
  selector: 'stc-apps-strategy-program',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , SharedUiModule , StrategyKpiCardComponent , EditModeViewComponent],
  templateUrl: './strategyProgram.component.html',
  styleUrl: './strategyProgram.component.scss',
})
export class StrategyProgramComponent implements OnInit {
  strategyProgramService = inject(StrategyProgramService);
  strategyProgramData!:StrategyProgramModel;
  currentMode!: 'editMode' | 'viewMode';
  scorecardService = inject(ScorecardService);
  ngOnInit()
  {
    this.strategyProgramData = this.strategyProgramService.getStrategyProgramDaya();
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
  }
  showDialog()
  {
    console.log('testt');
  }
  downloadTemplate()
  {
    console.log('testt');
  }
}
