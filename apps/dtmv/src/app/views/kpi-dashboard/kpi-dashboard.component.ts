import { Component, signal } from '@angular/core';

@Component({
  selector: 'stc-apps-kpi-dashboard',
  templateUrl: './kpi-dashboard.component.html',
  styleUrls: ['./kpi-dashboard.component.scss'],
})
export class KpiDashboardComponent {
  currentTab = signal<string>('Clusters');

  customTabs = [
    { label: 'Clusters', key: 'Clusters' },
    { label: 'FUs', key: 'FUs' },
    { label: 'T&O', key: 'T&O' },
  ];

  onTabChanged(tabName: string): void {
    console.log('Active tab:', tabName);
    this.currentTab.set(tabName);
  }
}
