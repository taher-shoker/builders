import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ReportingService } from '../reporting.service';

export const reportingGuard: CanActivateFn = (route, state): boolean => {
  const pages = {
    home: 'Home',
    add_case: "Add case",
    case_details: "Case details",
    dashboard: "Dashboard",
    // fixed_experience: 'Fixed Experience page',
  };

  const reportingService: ReportingService = inject(ReportingService);

  const pathTo: string = route.url[0]?.path; // Storing the path string which user is going to

  if (pathTo) {
    // console.warn("route is", route)
    // console.warn("the pathTo", pathTo)
    if (pages[pathTo]) {
      reportingService.postReport(pages[pathTo]).subscribe(() => {
        console.log('gon send', pages[pathTo])
      });
    }
  }
  return true;
};
