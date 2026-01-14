import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadarBubble, SharedUiModule } from '@stc-apps/shared-ui';

type Dimension = {
  key: 'strategy' | 'structure' | 'processes' | 'people' | 'technology';
  label: string;
};

type Squad = {
  id: string;
  name: string;
  scores: {
    strategy: number;
    structure: number;
    processes: number;
    people: number;
    technology: number;
  };
};

@Component({
  selector: 'stc-apps-agile-executive-summary',
  standalone: true,
  imports: [CommonModule, SharedUiModule, FormsModule],
  templateUrl: './agile-executive-summary.component.html',
  styleUrls: ['./agile-executive-summary.component.scss'],
})
export class AgileExecutiveSummaryComponent implements OnInit {
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
  selectedTribe = signal<string>('all');

  ngOnInit() {
    const today = new Date();
    const currentYear = today.getFullYear();

    // Add current year if not present
    const currentYears = this.years();
    if (!currentYears.find(y => y.value === currentYear)) {
      this.years.update(y => [...y, { displayName: String(currentYear), value: currentYear }]);
    }

    // Set current year
    this.selectedYear.set(currentYear);

    // Calculate and set current quarter
    const month = today.getMonth() + 1;
    const quarter = Math.ceil(month / 3);
    this.selectedQuarter.set(`Q${quarter}`);
  }

  overviewScore = signal<number>(2.8);
  targetProgress = signal<number>(70);

  maturityChartData = signal([
    { title: 'Strategy', value1: 8.9, value2: 7.5, color: '#B999D1' },
    { title: 'Structure', value1: 7.1, value2: 6.5, color: '#61CBD6' },
    { title: 'Processes', value1: 7.6, value2: 6.9, color: '#00C48C' },
    { title: 'People', value1: 7.9, value2: 7.2, color: '#4F008C' },
    { title: 'Technology', value1: 8.1, value2: 7.0, color: '#000000' },
  ]);

  labels = ['Strategy', 'Process', 'Technology', 'People', 'Structure'];

  bubbles: RadarBubble[] = [
    { axisIndex: 0, value: 1.5, r: 14 },
    { axisIndex: 1, value: 2, r: 14 },
    { axisIndex: 2, value: 3, r: 14 },
    { axisIndex: 3, value: 0.75, r: 14 },
    { axisIndex: 4, value: 2.5, r: 14 },
  ];


  // heatmapColumns = signal([
  //   'Squad 1',
  //   'Squad 2',
  //   'Squad 3',
  //   'Squad 4',
  //   'Squad 5',
  //   'Squad 6',
  //   'Squad 7',
  //   'Squad 8',
  //   'Squad 9',
  //   'Squad 10',
  //   'Squad 11',
  //   'Tribe Total',
  // ]);
  // heatmapRows = signal([
  //   {
  //     label: 'Strategy',
  //     values: [3.0, 3.0, 3.0, 3.0,3.0, 3.0, 3.0, 3.0,3.0, 3.0, 3.0, 2.86],
  //   },
  //   {
  //     label: 'Structure',
  //     values: [2.32, 2.32, 3.0, 2.32, 2.32, 2.32, 3.0, 2.32,3.0, 3.0, 3.0, 2.59],
  //   },
  //   {
  //     label: 'Processes',
  //     values: [2.32, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0,3.0, 3.0, 3.0, 2.59],
  //   },
  //   {
  //     label: 'People',
  //     values: [3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0,3.0, 3.0, 3.0, 2.59],
  //   },
  //   {
  //     label: 'Technology',
  //     values: [3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0,3.0, 3.0, 3.0, 2.78],
  //   },
  // ]);

  // performanceScale = signal([
  //   { caption: 'Fly', range: '3 - 4.0' },
  //   { caption: 'Run', range: '2.75 - 3.49' },
  //   { caption: 'Walk', range: '1.5 - 2.49' },
  //   { caption: 'Crawl', range: '0 - 1.49' },
  // ]);

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

  keyHighlights = signal({
    title: 'Postpaid O2C - Release 1 for New Connection',
    items: [
      'TAWASOL Digital pilot closure & final business acceptance for release “New Connection of Postpaid”',
      'New UI/UX in TAMWOOl digital enhances the agent experience by offering faster, smoother, and more user-friendly interactions for postpaid',
      'The production deployment of the Postpaid New Connection covering O2C Journey requirements including retrofit CRs',
      'The Postpaid New Connection is available for both new and existing customers, and applies to Voice and Data for both Physical Sims and eSIMs',
    ],
  });

   dimensions: Dimension[] = [
    { key: 'strategy', label: 'Strategy' },
    { key: 'structure', label: 'Structure' },
    { key: 'processes', label: 'Processes' },
    { key: 'people', label: 'People' },
    { key: 'technology', label: 'Technology' },
  ];

  squads: Squad[] = Array.from({ length: 15 }).map((_, i) => ({
    id: String(i + 1),
    name: `Squad ${i + 1}`,
    scores: {
      strategy: i % 2 ? 3.0 : 1.32,
      structure: i % 3 ? 3.0 : 2.32,
      processes: i % 4 ? 3.0 : 3.32,
      people: i % 2 ? 2.32 : 3.77,
      technology: i % 5 ? 3.0 : 2.32,
    },
  }));

  // getTotalAverageForColumn(index: number): number {
  //   const rows = this.heatmapRows();
  //   if (!rows || rows.length === 0) return 0;
  //   const sum = rows.reduce((acc, r) => acc + (r.values[index] ?? 0), 0);
  //   return sum / rows.length;
  // }

  onSelectYear(event: any) {
    this.selectedYear.set(event as number);
  }
  onSelectQuarter(event: any) {
    this.selectedQuarter.set(event as string);
  }
  onSelectLOB(event: any) {
    this.selectedLOB.set(event as string);
  }
  onSelectTribe(event: any) {
    this.selectedTribe.set(event as string);
  }
}
