import { Route } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
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
      )
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
  {
    path : "strategy-project-form/:title/:objective",
    loadComponent: () =>
      import('./views/strategyProgram/components/add-project-form/add-project-form.component').then(
        (m) => m.AddProjectFormComponent
      ),
      canActivate:[AuthGuard]
  },
  {
    path : "strategy-project-form/:id",
    loadComponent: () =>
      import('./views/strategyProgram/components/add-project-form/add-project-form.component').then(
        (m) => m.AddProjectFormComponent
      ),
      canActivate:[AuthGuard]
  },
  {
    path : "financial-reporting",
    loadComponent: () =>
      import('./views/financial-reporting/financial-reporting.component').then(
        (m) => m.FinancialReportingComponent
      )
  },
  // {
  //   path : "raqami",
  //   loadComponent: () =>
  //     import('./views/raqami/raqami.component').then(
  //       (m) => m.RaqamiComponent
  //     ),
  // },
  {
    path : "psr",
    loadComponent: () =>
      import('./views/PSR/PSR.component').then(
        (m) => m.PSRComponent
    )
  },
  {
    path : "psr/add-program",
    loadComponent: () =>
      import('./views/PSR/components/add-psr-project-form/add-psr-project-form.component').then(
        (m) => m.AddPsrProjectFormComponent
    ),
    canActivate:[AuthGuard]
  },
  {
    path : "psr/add-project/:sector/:group",
    loadComponent: () =>
      import('./views/PSR/components/add-psr-project-form/add-psr-project-form.component').then(
        (m) => m.AddPsrProjectFormComponent
    ),
    canActivate:[AuthGuard]
  },
  {
    path : "psr/edit-program/:id",
    loadComponent: () =>
      import('./views/PSR/components/add-psr-project-form/add-psr-project-form.component').then(
        (m) => m.AddPsrProjectFormComponent
    ),
    canActivate:[AuthGuard]
  },
  {
    path : "psr/edit-project/:sector/:group/:projId",
    loadComponent: () =>
      import('./views/PSR/components/add-psr-project-form/add-psr-project-form.component').then(
        (m) => m.AddPsrProjectFormComponent
    ),
    canActivate:[AuthGuard]
  },
  {
    path : "psr/:id",
    loadComponent: () =>
      import('./views/PSR/components/psr-details-page/psr-details-page.component').then(
        (m) => m.PsrDetailsPageComponent
      ),
  },
];
