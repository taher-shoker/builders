import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadarBubble, SharedUiModule } from '@stc-apps/shared-ui';
import { FileModel } from '../../../models/scorecard.model';
import {
  AgileExecutiveSummaryService,
  HeatmapMetadataResponse,
  HeatmapSquadsValuesResponse,
  MaturityIndexResponse,
  MaturityIndexSaveRequest,
  OverallMaturityIndexResponse,
} from '../../../services/agile-executive-summary.service';
import { AuthService } from '../../../services/auth.service';
import { ScorecardService } from '../../../services/scorecard.service';

type Dimension = {
  key: 'strategy' | 'structure' | 'processes' | 'people' | 'technology';
  label: string;
  icon?: string;
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
  scorecardService = inject(ScorecardService);
  authServices = inject(AuthService);

  years = signal<{ displayName: string; value: string }[]>([]);
  quarters = signal<{ displayName: string; value: string }[]>([]);
  selectedYear = signal<string>('2025');
  selectedQuarter = signal<string>('Q4');
  selectedTribe = signal<string>('All');
  selectedHeatmapLOB = signal<string>('All');
  tribeDropdownList = signal<{ displayName: string; value: string }[]>([]);
  currentMode: 'editMode' | 'viewMode' = 'viewMode';
  isAdmin = false;
  visible = false;
  importContext: 'heatmap' | 'heatmapSquads' | null = null;
  editSidebarVisible = false;
  selectedImportFile: FileModel | null = null;

  ngOnInit() {
    this.loadTimePeriodMetadata();
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
    this.authServices.userRoles.subscribe({
      next: (role) => {
        this.isAdmin = role.roles?.some(
          (r) => r.roleName === 'BE_EDITORS' || r.roleName === 'ADMINS'
        );
      },
    });
  }

  overviewScore = signal<number | null>(null);
  targetProgress = signal<number | null>(null);
  progressToTarget = signal<number | null>(null);

  maturityChartData = signal([
    { title: 'Strategy', value1: 8.9, value2: 7.5, color: '#B999D1' },
    { title: 'Structure', value1: 7.1, value2: 6.5, color: '#61CBD6' },
    { title: 'Processes', value1: 7.6, value2: 6.9, color: '#00C48C' },
    { title: 'People', value1: 7.9, value2: 7.2, color: '#4F008C' },
    { title: 'Technology', value1: 8.1, value2: 7.0, color: '#000000' },
  ]);

  labels = ['Strategy', 'Structure', 'Processes', 'People', 'Technology'];

  bubbles: RadarBubble[] = [
    // { axisIndex: 0, value: 0, r: 14 },
    // { axisIndex: 1, value: 0, r: 14 },
    // { axisIndex: 2, value: 0, r: 14 },
    // { axisIndex: 3, value: 0, r: 14 },
    // { axisIndex: 4, value: 0, r: 14 },
  ];

  sectorLabels = ['Strategy', 'Process', 'Technology', 'People', 'Structure'];

  sectorBubbles: RadarBubble[] = [
    // { axisIndex: 0, value: 4, r: 14 },
    // { axisIndex: 1, value: 4, r: 14 },
    // { axisIndex: 2, value: 4, r: 14 },
    // { axisIndex: 3, value: 3.9, r: 14 },
    // { axisIndex: 4, value: 4, r: 14 },
  ];

  lobOptions = signal([
    { key: 'EBU', label: 'EBU' },
    { key: 'CBU', label: 'CBU' },
    { key: 'Jawwy', label: 'Jawwy' },
    { key: 'WBU', label: 'WBU' },
  ]);
  selectedLOB = signal<string>('EBU');
  lobDropdownList = signal<any>([
    // { displayName: 'EBU', value: 'EBU' },
    // { displayName: 'CBU', value: 'CBU' },
    // { displayName: 'Jawwy', value: 'Jawwy' },
    // { displayName: 'WBU', value: 'WBU' },
  ]);

  keyHighlights = signal({
    title: '',
    items: [] as string[],
  });

  dimensions: Dimension[] = [
    { key: 'strategy', label: 'Strategy', icon: 'assets/images/strategy.svg' },
    { key: 'structure', label: 'Structure', icon: 'assets/images/structure.svg' },
    { key: 'processes', label: 'Processes', icon: 'assets/images/process.svg' },
    { key: 'people', label: 'People', icon: 'assets/images/people.svg' },
    { key: 'technology', label: 'Technology', icon: 'assets/images/technology.svg' },
  ];

  squads: Squad[] = [];
  private maturityIndexId: number | null = null;

  onSelectYear(event: any) {
    this.selectedYear.set(String(event));
    this.loadOverallMaturityIndex();
    this.loadAgileMaturityIndex();
    this.resetHeatmapContext();
    this.loadHeatmapMetadata();
  }

  onSelectQuarter(event: any) {
    this.selectedQuarter.set(event as string);
    this.loadOverallMaturityIndex();
    this.loadAgileMaturityIndex();
    this.resetHeatmapContext();
    this.loadHeatmapMetadata();
  }

  onSelectLOB(event: any) {
    this.selectedLOB.set(event as string);
    this.labels = [];
    this.bubbles = [];
    this.bubbles = [];
    this.keyHighlights.set({ title: '', items: [] });
    this.loadAgileMaturityIndex();
  }

  onSelectHeatmapLOB(event: any) {
    this.selectedHeatmapLOB.set(event as string);
    this.selectedTribe.set('All');
    this.loadTribesForSelectedLOB();
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

  private loadTribesForSelectedLOB() {
    const lob = this.selectedHeatmapLOB();
    const year = Number(this.selectedYear());
    const quarter = this.selectedQuarter();
    this.selectedTribe.set('All');
    const obs =
      lob && lob !== 'All'
        ? this.agileService.getHeatmapMetadataByLOB(lob, year, quarter)
        : this.agileService.getHeatmapMetadata(year, quarter);
    obs.subscribe((data: HeatmapMetadataResponse) => {
      const tribes = data.tribes ?? [];
      const tribesList = tribes.map((t) => ({ displayName: t, value: t }));
      tribesList.unshift({ displayName: 'All', value: 'All' });
      this.tribeDropdownList.set(tribesList);
      this.selectedTribe.set('All');
      this.loadHeatmapSquadsValues();
    });
  }

  private resetHeatmapContext() {
    this.lobDropdownList.set([]);
    this.tribeDropdownList.set([]);
    this.selectedHeatmapLOB.set('');
    this.selectedTribe.set('');
    this.squads = [];
  }
  private loadHeatmapMetadata() {
    this.resetHeatmapContext();

    const year = Number(this.selectedYear());
    const quarter = this.selectedQuarter();

    this.agileService
      .getHeatmapMetadata(year, quarter)
      .subscribe((data: HeatmapMetadataResponse) => {
        if (data.lineOfBusinesses && data.lineOfBusinesses.length) {

          const lobList = data.lineOfBusinesses.map((lob) => ({
            displayName: lob,
            value: lob,
          }));
          lobList.unshift({ displayName: 'All', value: 'All' });
          this.lobDropdownList.set(lobList);
          if (!this.selectedHeatmapLOB() && lobList.length > 0) {
            this.selectedHeatmapLOB.set(lobList[0].value);
          }

       if (data.tribes && data.tribes.length) {
          const tribesList = data.tribes.map((tribe) => ({
            displayName: tribe,
            value: tribe,
          }));
          tribesList.unshift({ displayName: 'All', value: 'All' });
          this.tribeDropdownList.set(tribesList);
          if (!this.selectedTribe() && tribesList.length > 0) {
            this.selectedTribe.set(tribesList[0].value);
          }
        }

        }
        this.loadHeatmapSquadsValues();

      });
  }

  private loadTimePeriodMetadata() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentQuarter = `Q${Math.ceil((today.getMonth() + 1) / 3)}`;

    const yearsList: number[] = [];
    for (let y = 2025; y <= currentYear; y++) {
      yearsList.push(y);
    }
    const yearOptions = yearsList.map((y: number) => ({
      displayName: String(y),
      value: String(y),
    }));

    const quarterOptions = ['Q1', 'Q2', 'Q3', 'Q4'].map((q: string) => ({
      displayName: q,
      value: q,
    }));

    this.years.set(yearOptions);
    this.quarters.set(quarterOptions);
    // this.selectedYear.set(String(currentYear));
    // this.selectedQuarter.set(currentQuarter);
    this.loadOverallMaturityIndex();
    this.loadAgileMaturityIndex();
    this.loadHeatmapMetadata();
  }

  private loadOverallMaturityIndex() {
    const year = Number(this.selectedYear());
    const quarter = this.selectedQuarter();

    this.overviewScore.set(null);
    this.targetProgress.set(null);
    this.progressToTarget.set(null);
    this.sectorBubbles = [];

    this.agileService
      .getOverallMaturityIndex(year, quarter)
      .subscribe((data: OverallMaturityIndexResponse) => {
        if (data) {
          this.overviewScore.set(data.overallMaturityScore);
          this.targetProgress.set((data.overallMaturityScore / 4) * 100);
          this.progressToTarget.set(data.progressToTarget);
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
        }
      });
  }

  performanceLabel(): 'Fly' | 'Run' | 'Walk' | 'Crawl' | '' {
    const s = this.overviewScore();
    if (s === null || typeof s !== 'number') return '';
    if (s >= 3.5) return 'Fly';
    if (s >= 2.5) return 'Run';
    if (s >= 1.5) return 'Walk';
    return 'Crawl';
  }

  performanceImage(): string {
    const label = this.performanceLabel();
    const map: Record<string, string> = {
      Fly: 'assets/images/fly.png',
      Run: 'assets/images/run.png',
      Walk: 'assets/images/walk.png',
      Crawl: 'assets/images/crawl.png',
    };
    return map[label] ?? '';
  }

  performanceColor(): string {
    const label = this.performanceLabel();
    const map: Record<string, string> = {
      Fly: 'var(--stc-green-dark-color)',
      Run: 'var(--stc-green-dark-color)',
      Walk: 'var(--stc-green-dark-color)',
      Crawl: 'var(--stc-green-dark-color)',
      // Fly: 'var(--stc-purple-glow-color-dark)',
      // Run: 'var(--stc-green-dark-color)',
      // Walk: '#CC89FF',
      // Crawl: 'var(--stc-green-dark-color)',
    };
    return map[label] ?? 'var(--stc-purple-glow-color-dark)';
  }

  stageImageStyles(): { [key: string]: string } {
    const url = this.performanceImage();
    const color = this.performanceColor();
    const label = this.performanceLabel();
    if (!url) return { display: 'none' };
    const translateY = label === 'Crawl' ? -14 : -20;
    const stcColor= label == "Crawl" ? "#fcd0ff" : label=="Walk" ? "#e2a3ff" :label == "Run" ? "#c27bff" : "#8200db";
    return {
      width: '60px',
      height: '60px',
      backgroundColor: stcColor,
      transform: `translateY(${translateY}px)`,
      filter: [
        `drop-shadow(0 1px 0 #000`,
        `drop-shadow(0 -1px 0 #000`,
        `drop-shadow(1px 0 0 #000`,
        `drop-shadow(-1px 0 0 #000`,
        `drop-shadow(1px 1px 0 #000`,
        `drop-shadow(1px -1px 0 #000`,
        `drop-shadow(-1px 1px 0 #000`,
        `drop-shadow(-1px -1px 0 #000`,
      ].join(' '),
      '-webkit-mask-image': `url(${url})`,
      'mask-image': `url(${url})`,
      '-webkit-mask-repeat': 'no-repeat',
      'mask-repeat': 'no-repeat',
      '-webkit-mask-position': 'center',
      'mask-position': 'center',
      '-webkit-mask-size': 'contain',
      'mask-size': 'contain',
    };
  }

  lobAverage(): number | null {
    const arr = this.bubbles;
    if (!arr || !arr.length) return null;
    const sum = arr.reduce((acc, b) => acc + (typeof b.value === 'number' ? b.value : Number(b.value ?? 0)), 0);
    return sum / arr.length;
  }
  lobPerformanceLabel(): 'Fly' | 'Run' | 'Walk' | 'Crawl' | '' {
    const s = this.lobAverage();
    if (s === null || typeof s !== 'number') return '';
    if (s >= 3.5) return 'Fly';
    if (s >= 2.5) return 'Run';
    if (s >= 1.5) return 'Walk';
    return 'Crawl';
  }
  lobPerformanceColor(): string {
    const label = this.lobPerformanceLabel();
    const map: Record<string, string> = {
      Crawl: '#fcd0ff',
      Walk: '#e2a3ff',
      Run: '#c27bff',
      Fly: '#8200db',
    };
    return map[label] ?? '#8200db';
  }
  lobStageImageStyles(): { [key: string]: string } {
    const label = this.lobPerformanceLabel();
    const urlMap: Record<string, string> = {
      Fly: 'assets/images/fly.png',
      Run: 'assets/images/run.png',
      Walk: 'assets/images/walk.png',
      Crawl: 'assets/images/crawl.png',
    };
    const url = urlMap[label] ?? '';
    const stcColor = this.lobPerformanceColor();
    if (!url) return { display: 'none' };
    const translateY = label === 'Crawl' ? 1 : -6;
    return {
      width: '44px',
      height: '44px',
      backgroundColor: stcColor,
      transform: `translateY(${translateY}px)`,
      filter: [
        `drop-shadow(0 1px 0 ${stcColor})`,
        `drop-shadow(0 -1px 0 ${stcColor})`,
        `drop-shadow(1px 0 0 ${stcColor})`,
        `drop-shadow(-1px 0 0 ${stcColor})`,
        `drop-shadow(1px 1px 0 ${stcColor})`,
        `drop-shadow(1px -1px 0 ${stcColor})`,
        `drop-shadow(-1px 1px 0 ${stcColor})`,
        `drop-shadow(-1px -1px 0 ${stcColor})`,
      ].join(' '),
      '-webkit-mask-image': `url(${url})`,
      'mask-image': `url(${url})`,
      '-webkit-mask-repeat': 'no-repeat',
      'mask-repeat': 'no-repeat',
      '-webkit-mask-position': 'center',
      'mask-position': 'center',
      '-webkit-mask-size': 'contain',
      'mask-size': 'contain',
    };
  }

  private loadAgileMaturityIndex() {
    const year = Number(this.selectedYear());
    const quarter = this.selectedQuarter();
    const lob = this.selectedLOB();

    this.bubbles = [];
    this.keyHighlights.set({
      title: '',
      items: [],
    });
    this.agileService
      .getAgileMaturityIndex(year, quarter, lob)
      .subscribe((data: MaturityIndexResponse) => {
        this.maturityIndexId = data.id ?? null;
        this.labels = [
          'Strategy',
          'Structure',
          'Processes',
          'People',
          'Technology',
        ];
        if (data.id) {
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
        }
      });
  }

  showDialog() {
    this.visible = true;
  }
  showHeatmapImportDialog() {
    this.importContext = 'heatmap';
    this.showDialog();
  }
  showHeatmapSquadsImportDialog() {
    this.importContext = 'heatmapSquads';
    this.showDialog();
  }

  onHide() {
    this.visible = false;
  }
  showSidebar() {
    document.body.classList.add('sidebar-open');
  }
  hideSidebar() {
    document.body.classList.remove('sidebar-open');
  }

  onUploadFileSelected(e: FileModel | null) {
    this.selectedImportFile = e;
  }

  confirmImport() {
    if (!this.selectedImportFile) return;
    const year = Number(this.selectedYear());
    const quarter = this.selectedQuarter();
    const lineOfBusiness = this.selectedHeatmapLOB();
    const tribe = this.selectedTribe();
    const ctx = this.importContext;
    const dashboardName =
      ctx === 'heatmap'
        ? 'executive_summary_performance_heatmap'
        : ctx === 'heatmapSquads'
        ? 'executive_summary_performance_heatmap_squads'
        : 'overall_maturity_index';
    this.agileService
      .importExecutiveSummary(dashboardName, this.selectedImportFile, {
        year,
        quarter
      })
      .subscribe({
        next: () => {
          this.editSidebarVisible = false;
          this.hideSidebar();
          this.selectedImportFile = null;
          this.loadOverallMaturityIndex();
          this.loadAgileMaturityIndex();
          this.loadHeatmapMetadata();
        },
        error: () => {
          this.editSidebarVisible = false;
          this.hideSidebar();
        },
      });
  }

  importData(e: FileModel) {
    if (e) {
      const year = Number(this.selectedYear());
      const quarter = this.selectedQuarter();
      const lineOfBusiness = this.selectedHeatmapLOB();
      const tribe = this.selectedTribe();
      const ctx = this.importContext;
      const dashboardName =
        ctx === 'heatmap'
          ? 'executive_summary_performance_heatmap'
          : ctx === 'heatmapSquads'
          ? 'executive_summary_performance_heatmap_squads'
          : 'overall_maturity_index';
      this.agileService
        .importExecutiveSummary(dashboardName, e, {
          year,
          quarter
        })
        .subscribe({
          next: () => {
            this.visible = false;
            this.loadOverallMaturityIndex();
            this.loadAgileMaturityIndex();
            this.loadHeatmapMetadata();
          },
          error: () => {
            this.visible = false;
          },
        });
    }
  }

  private downloadFile(data: string, filename: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  downloadOverallMaturityIndexTemplate() {
    this.agileService
      .downloadExecutiveSummaryCsv('overall_maturity_index')
      .subscribe({
        next: (response) => {
          this.downloadFile(response, 'overall_maturity_index.csv');
        },
      });
  }
  downloadHeatmapTemplate() {
    this.agileService
      .downloadExecutiveSummaryCsv('executive_summary_performance_heatmap')
      .subscribe({
        next: (response) => {
          this.downloadFile(
            response,
            'executive_summary_performance_heatmap.csv'
          );
        },
      });
  }
  downloadHeatmapSquadsTemplate() {
    this.agileService
      .downloadExecutiveSummaryCsv(
        'executive_summary_performance_heatmap_squads'
      )
      .subscribe({
        next: (response) => {
          this.downloadFile(
            response,
            'executive_summary_performance_heatmap_squads.csv'
          );
        },
      });
  }

  editMaturitySidebarVisible = false;
  maturityEditValues: {
    strategy: number | null;
    structure: number | null;
    processes: number | null;
    people: number | null;
    technology: number | null;
  } = {
    strategy: null,
    structure: null,
    processes: null,
    people: null,
    technology: null,
  };

  showEditMaturityIndex() {
    const current = this.bubbles;
    this.maturityEditValues = {
      strategy: current[0]?.value ?? null,
      structure: current[1]?.value ?? null,
      processes: current[2]?.value ?? null,
      people: current[3]?.value ?? null,
      technology: current[4]?.value ?? null,
    };
    this.editMaturitySidebarVisible = true;
    this.showSidebar();
  }

  onSaveMaturityEdit(payload: {
    values: {
      strategy: number;
      structure: number;
      processes: number;
      people: number;
      technology: number;
    };
    keyHighlightsTitle: string;
    keyHighlightsContentHtml: string;
  }) {
    const body: MaturityIndexSaveRequest = {
      lob: this.selectedLOB(),
      year: Number(this.selectedYear()),
      quarter: this.selectedQuarter(),
      strategy: payload.values.strategy,
      structure: payload.values.structure,
      people: payload.values.people,
      technology: payload.values.technology,
      processes: payload.values.processes,
      titleKeyHighlights: payload.keyHighlightsTitle || '',
      keyHighlights: payload.keyHighlightsContentHtml || '',
    };
    if (this.maturityIndexId !== null) {
      body.id = this.maturityIndexId;
    }
    this.agileService.saveMaturityIndex(body).subscribe({
      next: () => {
        this.loadAgileMaturityIndex();
        this.editMaturitySidebarVisible = false;
        this.hideSidebar();
      },
      error: () => {
        this.editMaturitySidebarVisible = false;
        this.hideSidebar();
      },
    });
  }

  onCancelMaturityEdit() {
    this.editMaturitySidebarVisible = false;
    this.hideSidebar();
  }
}
