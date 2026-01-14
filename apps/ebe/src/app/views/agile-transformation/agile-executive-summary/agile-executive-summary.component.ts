import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadarBubble, SharedUiModule } from '@stc-apps/shared-ui';
import {
  AgileExecutiveSummaryService,
  HeatmapMetadataResponse,
  HeatmapSquadsValuesResponse,
  MaturityIndexResponse,
  OverallMaturityIndexResponse,
  TimePeriodMetadata,
} from '../../../services/agile-executive-summary.service';

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
  agileService = inject(AgileExecutiveSummaryService);

  years = signal<{ displayName: string; value: string }[]>([]);
  quarters = signal<{ displayName: string; value: string }[]>([]);
  selectedYear = signal<string>('');
  selectedQuarter = signal<string>('Q1');
  selectedTribe = signal<string>('all');
  selectedHeatmapLOB = signal<string>('');
  tribeDropdownList = signal<{ displayName: string; value: string }[]>([]);

  ngOnInit() {
    this.loadTimePeriodMetadata();
  }

  overviewScore = signal<number | null>(2.8);
  targetProgress = signal<number | null>(70);

  maturityChartData = signal([
    { title: 'Strategy', value1: 8.9, value2: 7.5, color: '#B999D1' },
    { title: 'Structure', value1: 7.1, value2: 6.5, color: '#61CBD6' },
    { title: 'Processes', value1: 7.6, value2: 6.9, color: '#00C48C' },
    { title: 'People', value1: 7.9, value2: 7.2, color: '#4F008C' },
    { title: 'Technology', value1: 8.1, value2: 7.0, color: '#000000' },
  ]);

  labels = ['Strategy', 'Structure', 'Processes', 'People', 'Technology'];

  bubbles: RadarBubble[] = [
    { axisIndex: 0, value: 0, r: 14 },
    { axisIndex: 1, value: 0, r: 14 },
    { axisIndex: 2, value: 0, r: 14 },
    { axisIndex: 3, value: 0, r: 14 },
    { axisIndex: 4, value: 0, r: 14 },
  ];

  sectorLabels = ['Strategy', 'Process', 'Technology', 'People', 'Structure'];

  sectorBubbles: RadarBubble[] = [
    { axisIndex: 0, value: 4, r: 14 },
    { axisIndex: 1, value: 4, r: 14 },
    { axisIndex: 2, value: 4, r: 14 },
    { axisIndex: 3, value: 3.9, r: 14 },
    { axisIndex: 4, value: 4, r: 14 },
  ];

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
    title: '',
    items: [] as string[],
  });

  dimensions: Dimension[] = [
    { key: 'strategy', label: 'Strategy' },
    { key: 'structure', label: 'Structure' },
    { key: 'processes', label: 'Processes' },
    { key: 'people', label: 'People' },
    { key: 'technology', label: 'Technology' },
  ];

  squads: Squad[] = [];

  onSelectYear(event: any) {
    this.selectedYear.set(String(event));
    this.loadOverallMaturityIndex();
    this.loadMaturityIndex();
    this.loadHeatmapSquadsValues();
  }

  onSelectQuarter(event: any) {
    this.selectedQuarter.set(event as string);
    this.loadOverallMaturityIndex();
    this.loadMaturityIndex();
    this.loadHeatmapSquadsValues();
  }

  onSelectLOB(event: any) {
    this.selectedLOB.set(event as string);
    this.labels = [];
    this.bubbles = [];
    this.sectorBubbles = [];
    this.keyHighlights.set({ title: '', items: [] });
    this.loadMaturityIndex();
  }

  onSelectHeatmapLOB(event: any) {
    this.selectedHeatmapLOB.set(event as string);
    this.loadHeatmapSquadsValues();
  }

  onSelectTribe(event: any) {
    this.selectedTribe.set(event as string);
    this.loadHeatmapSquadsValues();
  }

  private loadHeatmapSquadsValues() {
    const year = Number(this.selectedYear());
    const quarter = this.selectedQuarter();
    const lineOfBusiness = this.selectedHeatmapLOB();
    const tribe = this.selectedTribe();

    if (!lineOfBusiness || !tribe) {
      return;
    }

    this.squads = [];

    this.agileService
      .getHeatmapSquadsValues(year, quarter, lineOfBusiness, tribe)
      .subscribe((data: HeatmapSquadsValuesResponse) => {
        this.squads =
          data.squadValues?.map((s) => ({
            id: String(s.id),
            name: s.squadName,
            scores: {
              strategy: s.strategy,
              structure: s.structure,
              processes: s.processes,
              people: s.people,
              technology: s.technology,
            },
          })) ?? [];
      });
  }

  private loadHeatmapMetadata() {
    this.agileService
      .getHeatmapMetadata()
      .subscribe((data: HeatmapMetadataResponse) => {
        if (data.lineOfBusinesses && data.lineOfBusinesses.length) {
          const lobList = data.lineOfBusinesses.map((lob) => ({
            displayName: lob,
            value: lob,
          }));
          this.lobDropdownList.set(lobList);
          if (!this.selectedHeatmapLOB() && lobList.length > 0) {
            this.selectedHeatmapLOB.set(lobList[0].value);
          }
        }

        const tribesList = [
          ...(data.tribes ?? []).map((tribe) => ({
            displayName: tribe,
            value: tribe,
          })),
        ];
        this.tribeDropdownList.set(tribesList);
        if (tribesList.length > 0) {
          this.selectedTribe.set(tribesList[0].value);
        }
        this.loadHeatmapSquadsValues();
      });
  }

  private loadTimePeriodMetadata() {
    this.agileService
      .getTimePeriodMetadata()
      .subscribe((data: TimePeriodMetadata) => {
        const numericYears =
          data.years
            ?.map((y: number) => Number(y))
            .filter((y: number) => !Number.isNaN(y)) ?? [];

        const yearOptions = numericYears.map((y: number) => ({
          displayName: String(y),
          value: String(y),
        }));

        const quarterOptions =
          data.quarters?.map((q: string) => ({
            displayName: q,
            value: q,
          })) ?? [];

        this.years.set(yearOptions);
        this.quarters.set(quarterOptions);

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentQuarter = `Q${Math.ceil((today.getMonth() + 1) / 3)}`;

        const lastYearNumber =
          numericYears && numericYears.length
            ? Math.max(...numericYears)
            : undefined;

        const lastYearString =
          lastYearNumber !== undefined
            ? String(lastYearNumber)
            : yearOptions[yearOptions.length - 1]?.value;
        const lastQuarter = quarterOptions[quarterOptions.length - 1]?.value;

        const defaultYear = lastYearString ?? yearOptions[0]?.value;

        let defaultQuarter = lastQuarter;
        if (Number(defaultYear) === currentYear) {
          defaultQuarter =
            quarterOptions.find(
              (q: { value: string }) => q.value === currentQuarter
            )?.value ?? lastQuarter;
        }

        if (defaultYear !== undefined) {
          this.selectedYear.set(defaultYear);
        }
        if (defaultQuarter) {
          this.selectedQuarter.set(defaultQuarter);
        }
        this.loadOverallMaturityIndex();
        this.loadMaturityIndex();
        this.loadHeatmapMetadata();
      });
  }

  private loadOverallMaturityIndex() {
    const year = Number(this.selectedYear());
    const quarter = this.selectedQuarter();

    this.sectorBubbles = [];

    this.agileService
      .getOverallMaturityIndex(year, quarter)
      .subscribe((data: OverallMaturityIndexResponse) => {
        this.overviewScore.set(data.overallMaturityScore);
        this.targetProgress.set(data.progressToTarget * 100);
        this.sectorLabels = [
          'Strategy',
          'Process',
          'Technology',
          'People',
          'Structure',
        ];
        this.sectorBubbles = [
          { axisIndex: 0, value: data.strategyScore, r: 14 },
          { axisIndex: 1, value: data.processScore, r: 14 },
          { axisIndex: 2, value: data.technologyScore, r: 14 },
          { axisIndex: 3, value: data.peopleScore, r: 14 },
          { axisIndex: 4, value: data.structureScore, r: 14 },
        ];
      });
  }

  private loadMaturityIndex() {
    const year = Number(this.selectedYear());
    const quarter = this.selectedQuarter();
    const lob = this.selectedLOB();

    this.bubbles = [];

    this.agileService
      .getMaturityIndex(year, quarter, lob)
      .subscribe((data: MaturityIndexResponse) => {
        this.labels = [
          'Strategy',
          'Structure',
          'Processes',
          'People',
          'Technology',
        ];
        this.bubbles = [
          { axisIndex: 0, value: data.strategy, r: 14 },
          { axisIndex: 1, value: data.structure, r: 14 },
          { axisIndex: 2, value: data.processes, r: 14 },
          { axisIndex: 3, value: data.people, r: 14 },
          { axisIndex: 4, value: data.technology, r: 14 },
        ];

        this.keyHighlights.set({
          title: data.titleKeyHighlights ?? 'Key Highlights',
          items: data.keyHighlights ? [data.keyHighlights] : [],
        });
      });
  }
}
