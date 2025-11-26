/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Component,
  OnInit,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressInfo } from 'libs/shared-ui/src/lib/progress-bar/progress-bar.component';
import { DTStream, ReportData } from '../../services/models/milestones.models';
import { MilestonesService } from '../milestones-setting/milestones.service';

@Component({
  selector: 'stc-apps-vp-report',
  templateUrl: './vp-report.component.html',
  styleUrls: ['./vp-report.component.scss'],
})
export class VpReportComponent implements OnInit {
  allTeams: any[] = [];
  yearsArr: any = [];

  filterSelect!: FormGroup;

  dtStreams: WritableSignal<DTStream[]> = signal([]);
  streamsYear: WritableSignal<number> = signal(0);
  milestoneProgress: WritableSignal<number | null> = signal(null);

  selectedYear: WritableSignal<number> = signal(0);
  selectedTeam: WritableSignal<string> = signal('');

  reportData: WritableSignal<ReportData | undefined> = signal(undefined);
  digitalTransformation: WritableSignal<boolean> = signal(true);

  // Summary cards: unit progress API integration
  summaryCardsLoading: WritableSignal<boolean> = signal(false);
  unitProgress: WritableSignal<{
    unitBaseline: number;
    unitTarget: number;
    diActualProgress: number;
    averageUnitsProgress: number;
  } | null> = signal(null);

  vpPendingItems: any[] = [];
  pendingPanelOpen: boolean = true;

  progressBarData = computed(() => {
    const reportData = this.reportData();

    let data: ProgressInfo;
    if (reportData) {
      data = {
        prefixText: 'Baseline',
        prefixValue: this.reportData()!.baseline,
        suffixText: 'EOY Target',
        suffixValue: this.reportData()!.targetEoy,
        progressValue: this.reportData()!.actual,
        indexes: [
          {
            caption: 'Actual',
            value: this.reportData()!.actual,
            position: 'up',
          },
          {
            caption: `${this.getCurrentQuarter()} Target`,
            value: this.reportData()!.target,
            position: 'down',
          },
        ],
        barColor:
          this.reportData()!.actual < this.reportData()!.target
            ? '#c82a27'
            : '#00c48c',
        bgBarColor:
          this.reportData()!.actual < this.reportData()!.target
            ? '#c82a271a'
            : '#00c48c1a',
      };
    } else {
      data = {
        prefixText: 'Baseline',
        prefixValue: 0,
        suffixText: 'EOY Target',
        suffixValue: 0,
        progressValue: 0,
        indexes: [
          { caption: 'Actual', value: 0, position: 'up' },
          { caption: 'Target', value: 0, position: 'down' },
        ],
      };
    }
    return data;
  });

  constructor(
    public milestonesService: MilestonesService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.milestonesService.checkIsBusinessSpoc();
    this.yearsArrPopulator();
    this.filterSelect = new FormGroup({
      dateType: new FormControl(''),
    });
    this.setDateInitiallyToCurrentYear();
    this.getAllTeams();
    this.showDigitalTransformation();
  }

  showDigitalTransformation() {
    this.digitalTransformation.set(true);
  }
  showClarityStrateic() {
    this.digitalTransformation.set(false);
  }
  private watchRoute() {
    this.route.queryParams.subscribe((params) => {
      const yearParam = Number(params['year']);
      if (Number.isFinite(yearParam) && yearParam > 0) {
        this.selectedYear.set(yearParam);
        this.filterSelect.get('dateType')?.setValue(yearParam, { emitEvent: false });
      }
      this.selectedTeam.set(params['team']);

      const currentYear = new Date().getFullYear();

      if (!params['year']) {
        this.selectedYear.set(currentYear);
        this.updateRoute(this.allTeams[0]?.name, currentYear);
        this.filterSelect.get('dateType')?.setValue(currentYear, { emitEvent: false });
      }

      if (!params['team']) {
        this.selectedTeam.set(this.allTeams[0]?.name);
        this.updateRoute(this.allTeams[0]?.name, currentYear);
      }

      this.getDTStreams();
      this.fetchUnitProgress();
    });
  }

  private setDateInitiallyToCurrentYear() {
    const currentYear = new Date().getFullYear();
    this.filterSelect.get('dateType')?.setValue(currentYear);
    this.selectedYear.set(currentYear);
  }

  private getAllTeams() {
    this.milestonesService.setUserTeams().subscribe((res) => {
      this.allTeams = res;
      this.watchRoute();
    });
  }

  private getDTStreams() {
    this.milestonesService
      .getDTStreams(this.selectedTeam(), this.selectedYear())
      .subscribe((res) => {
        this.dtStreams.set(res.streams);
        this.streamsYear.set(res.year);
        this.milestoneProgress.set(res.workStreamScore);
        this.reportData.set(res.reportData);
      });
  }

  private fetchUnitProgress() {
    // Guard against unset team/year
    if (!this.selectedTeam() || !this.selectedYear()) {
      return;
    }

    this.summaryCardsLoading.set(true);

    this.milestonesService
      .getUnitProgress(this.selectedTeam(), this.selectedYear())
      .subscribe({
        next: (res) => {
          this.unitProgress.set(res);
          this.summaryCardsLoading.set(false);
        },
        error: () => {
          // Keep UI stable on error; clear loading and retain last known values
          this.summaryCardsLoading.set(false);
        },
      });
  }

  protected selectTeam(value: string) {
    if (this.selectedTeam() !== value) {
      this.selectedTeam.set(value);
      this.updateRoute(value, this.selectedYear());
    }
  }

  private updateRoute(team: string, year: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { team, year },
      queryParamsHandling: 'merge', // Merge with existing query parameters,
      replaceUrl: true,
    });
  }

  protected handleSelectChange(value: string) {
    this.selectedYear.set(Number(value));
    this.updateRoute(this.selectedTeam(), Number(value));
  }

  protected togglePendingPanel() {
    this.pendingPanelOpen = !this.pendingPanelOpen;
  }

  private yearsArrPopulator() {
    const currentYear = new Date().getFullYear();
    for (
      let i = 2024;
      this.yearsArr[this.yearsArr.length - 1]?.name !== currentYear; // Check if the latest element's value equals the current year's value
      i++
    ) {
      this.yearsArr.push({ name: i, id: i });
    }
  }

  protected goEditPage() {
    this.router.navigate(['vp-report/edit'], {
      queryParams: { year: this.selectedYear(), team: this.selectedTeam() },
    });
  }

  getCurrentQuarter(): string {
    const today = new Date();
    const month = today.getMonth();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter}`;
  }

  // Computed progress info for summary cards based on unitProgress API
  summaryCardsProgressData = computed(() => {
    const up = this.unitProgress();
    const toPercent = (n: number | null | undefined) => Math.round((n ?? 0) * 100);

    if (up) {
      const actualPct = toPercent(up.diActualProgress);
      const targetPct = toPercent(up.unitTarget);
      const baselinePct = toPercent(up.unitBaseline);

      return {
        prefixText: 'Baseline',
        prefixValue: baselinePct,
        suffixText: '', //'EOY Target',
        suffixValue: '', //targetPct,
        progressValue: actualPct,
        indexes: [
          { caption: 'Actual', value: actualPct, position: 'up' },
          {
            caption: `${this.getCurrentQuarter()} Target`,
            value: targetPct,
            position: 'down',
          },
        ],
        barColor: actualPct < targetPct ? '#c82a27' : '#00c48c',
        bgBarColor: actualPct < targetPct ? '#c82a271a' : '#00c48c1a',
      } as ProgressInfo;
    }

    return {
      prefixText: 'Baseline',
      prefixValue: 0,
      suffixText: 'EOY Target',
      suffixValue: 0,
      progressValue: 0,
      indexes: [
        { caption: 'Actual', value: 0, position: 'up' },
        {
          caption: `${this.getCurrentQuarter()} Target`,
          value: 0,
          position: 'down',
        },
      ],
      barColor: '#00c48c',
      bgBarColor: '#00c48c1a',
    } as ProgressInfo;
  });

  baselinePercent = computed(() => {
    const up = this.unitProgress();
    return up ? Math.round((up.unitBaseline || 0) * 100) : 0; // Math.round(up.unitBaseline * 10000) / 100 : 0;
  });

  stcDiScoreValue = computed(() => {
    const up = this.unitProgress();
    return up ? Math.round((up.averageUnitsProgress || 0) * 100) : 0; //Math.round(up.averageUnitsProgress * 10000) / 100 : 0;
  });

  unitDiScoreValue = computed(() => {
    const up = this.unitProgress();
    return up ? Math.round((up.diActualProgress || 0) * 100) : 0;//Math.round(up.diActualProgress * 10000) / 100 : 0;
  });
}
