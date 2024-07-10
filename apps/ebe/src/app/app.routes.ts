import { Route } from '@angular/router';
import { ScorecardComponent } from './views/scorecard/scorecard.component';
import { StrategyProgramComponent } from './views/strategyProgram/strategyProgram.component';
import { RaqamiComponent } from './views/raqami/raqami.component';
import { PSRComponent } from './views/PSR/PSR.component';
export const appRoutes: Route[] = [
  {
    path : "",
    redirectTo : "scorecard",
    pathMatch : "full"
  },
  {
    path : "scorecard",
    component : ScorecardComponent
  },
  {
    path : "strategy-program",
    component : StrategyProgramComponent
  },
  {
    path : "raqami",
    component : RaqamiComponent
  },
  {
    path : "psr",
    component : PSRComponent
  }
];
