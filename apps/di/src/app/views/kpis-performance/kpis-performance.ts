import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-kpis-preformance',
  templateUrl: './kpis-performance.html',
  styleUrls: ['./kpis-performance.scss'],
})
export class KpisPerformanceComponent {
  kpisStatus = [
    { id: 1, name: 'Acheived' },
    { id: 1, name: 'Not Acheived' },
  ];
}
