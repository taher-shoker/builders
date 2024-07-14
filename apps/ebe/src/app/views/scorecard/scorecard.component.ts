import { Component, OnInit } from '@angular/core';
import { FinancialScorecardModel, OperationalScorecardModel, PrioritiesScorecardModel, RelationalScorecardModel, ScorecardTaps, StrategicScorecardModel } from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
import { FinancialScorecardComponent } from './components/financialScorecard/financial-scorecard.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
@Component({
  selector: 'stc-apps-scorecard',
  standalone: true,
  imports : [FinancialScorecardComponent , SharedUiModule],
  templateUrl: './scorecard.component.html',
  styleUrl: './scorecard.component.scss',
})
export class ScorecardComponent implements OnInit{
  currentClickedTapIndex = 0;
  kpisData!:FinancialScorecardModel | StrategicScorecardModel | RelationalScorecardModel | PrioritiesScorecardModel | OperationalScorecardModel;
  currentClickedTapData:ScorecardTaps;
  scorecardsTaps:ScorecardTaps[] = [
    {
      id : 1,
      name : "financial"
    },
    {
      id : 2,
      name : "strategic"
    },
    {
      id : 3,
      name : "relational"
    },
    {
      id : 4,
      name : "operational"
    },
    {
      id : 5,
      name : "corporate priorities"
    },
  ];
  constructor(
    private scorecardService:ScorecardService
  ){
    this.currentClickedTapData = this.scorecardsTaps[0];
  }
  ngOnInit(): void {
    this.kpisData = this.scorecardService.financialScorcardData;
  }
  getClickedTap(clickedTap:ScorecardTaps)
  {
    this.currentClickedTapData = clickedTap;
    if(clickedTap.id === 1)
    {
      this.kpisData = this.scorecardService.financialScorcardData;
    }
    else if(clickedTap.id === 2)
    {
      this.kpisData = this.scorecardService.strategicScorcardData;
    }
    else if(clickedTap.id === 3)
    {
      this.kpisData = this.scorecardService.rationalScorcardData;
    }
    else if(clickedTap.id === 4)
    {
      this.kpisData = this.scorecardService.operationalScorcardData;
    }
    else if(clickedTap.id === 5)
    {
      this.kpisData = this.scorecardService.prioritieslScorcardData;
    }
  }
}
