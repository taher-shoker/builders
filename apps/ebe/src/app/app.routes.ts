import { Route } from '@angular/router';
export const appRoutes: Route[] = [
  {
    path : "",
    redirectTo : "scorecard",
    pathMatch : "full"
  },
  {
    path : "scorecard",
    loadComponent: () =>
      import('./views/scorecard/scorecard.component').then(
        (m) => m.ScorecardComponent
      ),
  },
  {
    path : "strategy-program",
    loadComponent: () =>
      import('./views/strategyProgram/strategyProgram.component').then(
        (m) => m.StrategyProgramComponent
      ),
  },
  {
    path : "strategy-program/:kpiId",
    loadComponent: () =>
      import('./views/strategyProgram/components/kpi-details/kpi-details.component').then(
        (m) => m.KpiDetailsComponentTsComponent
      ),
  },
  // {
  //   path : "raqami",
  //   loadComponent: () =>
  //     import('./views/raqami/raqami.component').then(
  //       (m) => m.RaqamiComponent
  //     ),
  // },
  // {
  //   path : "psr",
  //   loadComponent: () =>
  //     import('./views/PSR/PSR.component').then(
  //       (m) => m.PSRComponent
  //     ),
  // }
];
