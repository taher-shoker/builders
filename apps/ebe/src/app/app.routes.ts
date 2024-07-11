import { Route } from '@angular/router';
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
    loadChildren: () =>
      import('./views/scorecard/scorecard.module').then(
        (m) => m.ScorecardModule
      ),
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
