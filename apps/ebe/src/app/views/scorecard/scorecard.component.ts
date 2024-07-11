import { Component, OnInit } from '@angular/core';
import { FinancialScorecardModel, OperationalScorecardModel, PrioritiesScorecardModel, RelationalScorecardModel, ScorecardTaps, StrategicScorecardModel } from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
@Component({
  selector: 'stc-apps-scorecard',
  standalone: false,
  templateUrl: './scorecard.component.html',
  styleUrl: './scorecard.component.scss',
})
export class ScorecardComponent implements OnInit{
  currentClickedTapIndex = 0;
  financialScorcardData!:FinancialScorecardModel;
  strategicScorcardData!:StrategicScorecardModel;
  relationalScorcardData!:RelationalScorecardModel;
  operationalScorcardData!:OperationalScorecardModel;
  prioritiesScorcardData!:PrioritiesScorecardModel;
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
    this.financialScorcardData = this.scorecardService.financialScorcardData;
    this.strategicScorcardData = this.scorecardService.strategicScorcardData;
    this.relationalScorcardData = this.scorecardService.rationalScorcardData;
    this.operationalScorcardData = this.scorecardService.operationalScorcardData;
    this.prioritiesScorcardData = this.scorecardService.prioritieslScorcardData;
  }
  getClickedTap(clickedTap:ScorecardTaps)
  {
    this.currentClickedTapData = clickedTap;
  }
}
