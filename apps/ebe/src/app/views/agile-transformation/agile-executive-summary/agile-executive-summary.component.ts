import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { SharedUiModule } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-agile-executive-summary',
  standalone: true,
  imports: [CommonModule, SharedUiModule],
  templateUrl: './agile-executive-summary.component.html',
  styleUrls: ['./agile-executive-summary.component.scss'],
})
export class AgileExecutiveSummaryComponent {
  years = signal([
    { displayName: '2024', value: 2024 },
    { displayName: '2025', value: 2025 },
  ]);
  quarters = signal([
    { displayName: 'Q1', value: 'Q1' },
    { displayName: 'Q2', value: 'Q2' },
    { displayName: 'Q3', value: 'Q3' },
    { displayName: 'Q4', value: 'Q4' },
  ]);
  selectedYear = signal<number>(2025);
  selectedQuarter = signal<string>('Q1');

  overviewScore = signal<number>(8.9);
  targetProgress = signal<number>(70);

  maturityChartData = signal([
    { title: 'Strategy', value1: 8.9, value2: 7.5, color: '#B999D1' },
    { title: 'Structure', value1: 7.1, value2: 6.5, color: '#61CBD6' },
    { title: 'Processes', value1: 7.6, value2: 6.9, color: '#00C48C' },
    { title: 'People', value1: 7.9, value2: 7.2, color: '#4F008C' },
    { title: 'Technology', value1: 8.1, value2: 7.0, color: '#000000' },
  ]);

  heatmapColumns = signal([
    'Squad 1',
    'Squad 2',
    'Squad 3',
    'Squad 4',
    'Squad 5',
    'Tribe Total',
  ]);
  heatmapRows = signal([
    {
      label: 'Strategy',
      values: [3.0, 3.0, 3.0, 3.0, 3.0, 2.86],
    },
    {
      label: 'Structure',
      values: [2.32, 2.32, 3.0, 2.32, 2.32, 2.59],
    },
    {
      label: 'Processes',
      values: [2.32, 3.0, 3.0, 3.0, 3.0, 3.0],
    },
    {
      label: 'People',
      values: [3.0, 3.0, 3.0, 3.0, 3.0, 2.59],
    },
    {
      label: 'Technology',
      values: [3.0, 3.0, 3.0, 3.0, 3.0, 2.78],
    },
  ]);

  performanceScale = signal([
    { caption: 'Fly', range: '3 - 4.0' },
    { caption: 'Run', range: '2.75 - 3.49' },
    { caption: 'Walk', range: '1.5 - 2.49' },
    { caption: 'Crawl', range: '0 - 1.49' },
  ]);

  lobOptions = signal([
    { key: 'EBU', label: 'EBU' },
    { key: 'CBU', label: 'CBU' },
    { key: 'Jawwy', label: 'Jawwy' },
    { key: 'WBU', label: 'WBU' },
  ]);
  selectedLOB = signal<string>('EBU');
  lobDropdownList = signal([
    { displayName: 'EBU', value: 'EBU' },
    { displayName: 'CBU', value: 'CBU' },
    { displayName: 'Jawwy', value: 'Jawwy' },
    { displayName: 'WBU', value: 'WBU' },
  ]);

  keyHighlights = signal([
    'Postpaid O2C - Release 1 for New Connection',
    'TAMWOOl Digital pilot closure & final business acceptance for release “New Connection of Postpaid”',
    'New UI/UX in TAMWOOl digital enhances the agent experience by offering faster, smoother, and more user-friendly interactions for postpaid',
    'The production deployment of the Postpaid New Connection covering O2C Journey requirements including retrofit CRs',
    'The Postpaid New Connection is available for both new and existing customers, and applies to Voice and Data for both Physical Sims and eSIMs',
  ]);

  getTotalAverageForColumn(index: number): number {
    const rows = this.heatmapRows();
    if (!rows || rows.length === 0) return 0;
    const sum = rows.reduce((acc, r) => acc + (r.values[index] ?? 0), 0);
    return sum / rows.length;
  }

  onSelectYear(event: any) {
    this.selectedYear.set(event as number);
  }
  onSelectQuarter(event: any) {
    this.selectedQuarter.set(event as string);
  }
  onSelectLOB(event: any) {
    this.selectedLOB.set(event as string);
  }
}
