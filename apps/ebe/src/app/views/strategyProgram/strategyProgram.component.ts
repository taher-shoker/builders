import { Component, inject , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { StrategyProgramService } from '../../services/strategy-program.service';
import { StrategyProgramModel } from '../../models/strategy-program.model';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { StrategyKpiCardComponent } from './components/strategy-kpi-card/strategy-kpi-card.component';

@Component({
  selector: 'stc-apps-strategy-program',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , SharedUiModule , StrategyKpiCardComponent],
  templateUrl: './strategyProgram.component.html',
  styleUrl: './strategyProgram.component.scss',
})
export class StrategyProgramComponent implements OnInit {
  strategyProgramService = inject(StrategyProgramService);
  strategyProgramData!:StrategyProgramModel;
  // export interface ProgressInfo {
  //   prefixText: string;
  //   prefixValue: number | string;
  //   suffixText: string;
  //   suffixValue: number | string;
  //   progressValue: number;
  //   indexes?: Index[];
  //   barColor?: string;
  //   bgBarColor?: string
  // }
  ngOnInit()
  {
    this.strategyProgramData = this.strategyProgramService.getStrategyProgramDaya();
  }
}
