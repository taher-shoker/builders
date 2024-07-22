import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import {
  FinancialScorecardModel,
  OperationalScorecardModel,
  PrioritiesScorecardModel,
  RelationalScorecardModel,
  ScorecardTaps,
  StrategicScorecardModel,
} from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
import { FinancialScorecardComponent } from './components/financialScorecard/financial-scorecard.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
@Component({
  selector: 'stc-apps-scorecard',
  standalone: true,
  imports: [FinancialScorecardComponent, SharedUiModule, PageHeaderComponent],
  templateUrl: './scorecard.component.html',
  styleUrl: './scorecard.component.scss',
})
export class ScorecardComponent implements OnInit {
  currentClickedTapIndex = 0;
  currentMode!:'editMode' | 'viewMode';
  kpisData:WritableSignal<
  | FinancialScorecardModel[]
  | StrategicScorecardModel[]
  | RelationalScorecardModel[]
  | PrioritiesScorecardModel[]
  | OperationalScorecardModel[]> = signal([]);
  currentClickedTapData: ScorecardTaps;
  scorecardsTaps: ScorecardTaps[] = [
    {
      id: 1,
      name: 'financial',
    },
    {
      id: 2,
      name: 'strategic',
    },
    {
      id: 3,
      name: 'relational',
    },
    {
      id: 4,
      name: 'operational',
    },
    {
      id: 5,
      name: 'corporate priorities',
    },
  ];
  constructor(private scorecardService: ScorecardService) {
    this.currentClickedTapData = this.scorecardsTaps[0];
  }
  ngOnInit(): void {
    this.kpisData.set(this.scorecardService.financialScorcardData);
    this.scorecardService.getEditMode().subscribe({
      next : (res) => {
        this.currentMode = res;
      }
    })
  }
  getClickedTap(clickedTap: ScorecardTaps) {
    this.currentClickedTapData = clickedTap;
    if (clickedTap.id === 1) {
      this.kpisData.set(this.scorecardService.financialScorcardData)
    } else if (clickedTap.id === 2) {
      this.kpisData.set(this.scorecardService.strategicScorcardData)
    } else if (clickedTap.id === 3) {
      this.kpisData.set(this.scorecardService.rationalScorcardData)
    } else if (clickedTap.id === 4) {
      this.kpisData.set(this.scorecardService.operationalScorcardData)
    } else if (clickedTap.id === 5) {
      this.kpisData.set(this.scorecardService.prioritieslScorcardData)
    }
  }
}
