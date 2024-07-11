import { NgModule } from '@angular/core';
import { ScorecardComponent } from './scorecard.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { FinancialScorecardComponent } from './components/financialScorecard/financial-scorecard.component';
import { StrategicScorecardComponent } from './components/strategicScorecard/strategic-scorecard.component';
import { PrioritiesScorecardComponent } from './components/prioritiesScorecard/priorities-scorecard.component';
import { RelationalScorecardComponent } from './components/relationalScorecard/relational-scorecard.component';
import { OperationalScorecardComponent } from './components/operationalScorecard/operational-scorecard.component';
import { ScorecardService } from '../../services/scorecard.service';
const routes: Route[] = [
  {
    path : '',
    component : ScorecardComponent
  }
]
@NgModule({
  declarations: [
    ScorecardComponent,
    FinancialScorecardComponent,
    StrategicScorecardComponent,
    PrioritiesScorecardComponent,
    RelationalScorecardComponent,
    OperationalScorecardComponent
  ],
  imports : [SharedUiModule , RouterModule.forChild(routes) , CommonModule],
  providers: [ScorecardService],
})
export class ScorecardModule {}
