import { Route } from '@angular/router';
import { AgileTransformationGuard } from './guards/agileTransformation.guard';
import { AuthGuard } from './guards/auth.guard';
import { IsAdminGuard } from './guards/isAdmin.guard';
import { IsMobileGuard } from './guards/isMobile.guard';
import { IsNotMobileGuard } from './guards/isNotMobile.guard';
function getDefaultRedirect() {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
    ? 'home'
    : 'scorecard';
}
export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: getDefaultRedirect(),
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./views/homepage-mobile/homepage-mobile.component').then(
        (m) => m.HomepageMobileComponent
      ),
    canActivate: [IsMobileGuard],
  },
  {
    path: 'sector-scorecards',
    loadComponent: () =>
      import('./views/scorecard/scorecard.component').then(
        (m) => m.ScorecardComponent
      ),
  },
  {
    path: 'ai-ds-strategy-programs',
    loadComponent: () =>
      import('./views/strategyProgram/strategyProgram.component').then(
        (m) => m.StrategyProgramComponent
      ),
    canActivate: [IsNotMobileGuard],
  },
  {
    path: 'activity-log-center',
    loadComponent: () =>
      import('./views/activity-logs/activity-logs.component').then(
        (m) => m.ActivityLogsComponent
      ),
    canActivate: [IsAdminGuard, IsNotMobileGuard],
  },
  {
    path: 'activity-log-center/:title',
    loadComponent: () =>
      import('./views/activity-logs/activity-logs.component').then(
        (m) => m.ActivityLogsComponent
      ),
    canActivate: [IsAdminGuard, IsNotMobileGuard],
  },
  {
    path: 'ai-ds-strategy-programs/:programName/:programId',
    loadComponent: () =>
      import(
        './views/strategyProgram/components/kpi-details/kpi-details.component'
      ).then((m) => m.KpiDetailsComponentTsComponent),
    canActivate: [IsNotMobileGuard],
  },
  {
    path: 'strategy-project-form/:title/:objective',
    loadComponent: () =>
      import(
        './views/strategyProgram/components/add-project-form/add-project-form.component'
      ).then((m) => m.AddProjectFormComponent),
    canActivate: [AuthGuard, IsNotMobileGuard],
  },
  {
    path: 'strategy-project-form/:id',
    loadComponent: () =>
      import(
        './views/strategyProgram/components/add-project-form/add-project-form.component'
      ).then((m) => m.AddProjectFormComponent),
    canActivate: [AuthGuard, IsNotMobileGuard],
  },
  {
    path: 'deleted-projects',
    loadComponent: () =>
      import(
        './views/deleted-project-page/deleted-projects-page.component'
      ).then((m) => m.DeletedProjectsPageComponent),
    canActivate: [AuthGuard, IsNotMobileGuard],
    children: [
      {
        path: 'programs',
        loadComponent: () =>
          import(
            './views/deleted-project-page/deleted-programs/deleted-programs.component'
          ).then((m) => m.DeletedProgramsComponent),
      },
      {
        path: 'psr-projects/:title/:sector',
        loadComponent: () =>
          import(
            './views/deleted-project-page/deleted-psr-projects/deleted-psr-projects.component'
          ).then((m) => m.DeletedPsrProjectsComponent),
      },
      {
        path: 'psr-projects/:sector',
        loadComponent: () =>
          import(
            './views/deleted-project-page/deleted-psr-projects/deleted-psr-projects.component'
          ).then((m) => m.DeletedPsrProjectsComponent),
      },
      {
        path: 'cad-projects/:id/:resNum',
        loadComponent: () =>
          import(
            './views/deleted-project-page/deleted-cad-project/deleted-cad-project.component'
          ).then((m) => m.DeletedCadProjectComponent),
      },
    ],
  },
  // {
  //   path : "raqami",
  //   loadComponent: () =>
  //     import('./views/raqami/raqami.component').then(
  //       (m) => m.RaqamiComponent
  //     ),
  // },
  {
    path: 'financial-status',
    loadComponent: () =>
      import('./views/financial-reporting/financial-reporting.component').then(
        (m) => m.FinancialReportingComponent
      ),
  },
  // {
  //   path: 'raqami',
  //   loadComponent: () =>
  //     import('./views/raqami/raqami.component').then((m) => m.RaqamiComponent),
  // },
  {
    path: 'project-execution',
    loadComponent: () =>
      import('./views/PSR/PSR.component').then((m) => m.PSRComponent),
  },
  {
    path: 'digital-transformation',
    loadComponent: () =>
      import(
        './views/digital-transformation/digital-transformation.component'
      ).then((m) => m.DigitalTransformationComponent),
    // canActivate: [IsNotMobileGuard],
  },
  {
    path: 'project-execution/add-program',
    loadComponent: () =>
      import(
        './views/PSR/components/add-psr-project-form/add-psr-project-form.component'
      ).then((m) => m.AddPsrProjectFormComponent),
    canActivate: [AuthGuard, IsNotMobileGuard],
  },
  {
    path: 'project-execution/add-project/:sector',
    loadComponent: () =>
      import(
        './views/PSR/components/add-psr-project-form/add-psr-project-form.component'
      ).then((m) => m.AddPsrProjectFormComponent),
    canActivate: [AuthGuard, IsNotMobileGuard],
  },
  {
    path: 'project-execution/edit-program/:id',
    loadComponent: () =>
      import(
        './views/PSR/components/add-psr-project-form/add-psr-project-form.component'
      ).then((m) => m.AddPsrProjectFormComponent),
    canActivate: [AuthGuard, IsNotMobileGuard],
  },
  {
    path: 'project-execution/edit-project/:sector/:projId',
    loadComponent: () =>
      import(
        './views/PSR/components/add-psr-project-form/add-psr-project-form.component'
      ).then((m) => m.AddPsrProjectFormComponent),
    canActivate: [AuthGuard, IsNotMobileGuard],
  },
  {
    path: 'project-execution/:id/:sectorId',
    loadComponent: () =>
      import(
        './views/PSR/components/psr-details-page/psr-details-page.component'
      ).then((m) => m.PsrDetailsPageComponent),
  },
  {
        path: 'agile-transformation',
        loadComponent: () =>
            import(
                './views/agile-transformation/agile-transformation.component'
            ).then((m) => m.AgileTransformationComponent),
        canActivate: [AgileTransformationGuard],
    },
];
