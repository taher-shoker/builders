import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ReportingService } from '../services/reporting.service';

export const reportingGuard: CanActivateFn = (route, state): boolean => {
  const pages = {
    home: 'Home',
    trend: 'Trend',
    performance: 'Performance',
    dashboard: 'Dashboard',
  };

  const reportingService: ReportingService = inject(ReportingService);
console.log("path")
  const pathTo: string = route.url[0]?.path; // Storing the path string which user is going to
  console.log(pathTo);
  if (pathTo) {
    if (pages[pathTo]) {
      reportingService.postReport(pages[pathTo]).subscribe((res) => {
        console.log('gon send', pages[pathTo]);
      });
    }
  }
  return true;
};
