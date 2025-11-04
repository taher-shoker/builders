import { Component, OnInit, computed, signal, effect } from '@angular/core';
import { KpiService, UnitsGroupedCategory, TeamSummary, UnitProgress } from './kpi.service';

@Component({
  selector: 'stc-apps-kpi-dashboard',
  templateUrl: './kpi-dashboard.component.html',
  styleUrls: ['./kpi-dashboard.component.scss'],
})
export class KpiDashboardComponent implements OnInit {
  currentTab = signal<string>('');
  customTabs: { label: string; key: string }[] = [];
  private unitsGrouped: UnitsGroupedCategory[] = [];
  private teamIdByName: Map<string, number> = new Map<string, number>();

  // Unit progress state
  unitProgress = signal<UnitProgress | null>(null);
  currentTeamId = signal<number | null>(null);

  constructor(private kpiService: KpiService) {}

  ngOnInit(): void {
    this.kpiService.getUnitsGrouped().subscribe({
      next: (data: UnitsGroupedCategory[]) => {
        // Map categories to tabs; preserve order from API
        this.customTabs = (data || []).map((c: UnitsGroupedCategory) => ({
          label: c.category,
          key: c.category,
        }));

        // cache categories
        const units = data || [];
        this.unitsGrouped = units;

        // Set default tab to the first category if available
        const first = this.customTabs[0]?.key ?? '';
        this.currentTab.set(first);

        // Initialize team tabs from the first category
        const firstCategoryTeams = units.find((u) => u.category === first)?.teams || [];
        this.setTeamTabs(firstCategoryTeams);
        // initial fetch for first team
        this.fetchUnitProgress();
      },
      error: () => {
        // Fallback to known defaults in case of API error
        this.customTabs = [
          { label: 'Clusters', key: 'Clusters' },
          { label: 'FUs', key: 'FUs' },
          { label: 'T&O', key: 'T&O' },
        ];
        this.currentTab.set(this.customTabs[0].key);

        // Provide default team tabs until API works
        this.setTeamTabs([
          { id: 1, name: 'B2B' },
          { id: 2, name: 'B2C' },
          { id: 3, name: 'NM' },
          { id: 4, name: 'WBU' },
        ]);
      },
    });
  }

  onTabChanged(tabName: string): void {
    this.currentTab.set(tabName);

    // Update teams for the selected category from cached data
    const teams = this.unitsGrouped.find((u) => u.category === tabName)?.teams || [];
    this.setTeamTabs(teams);
    this.fetchUnitProgress();
  }

  // --- Teams Tabs state ---
  currentTeam = signal<string>('');
  teamTabs: { label: string; key: string }[] = [];

  private setTeamTabs(teams: TeamSummary[]) {
    this.teamTabs = (teams || []).map((t) => ({ label: t.name, key: t.name }));
    // build name->id map
    this.teamIdByName = new Map((teams || []).map((t) => [t.name, t.id]));
    const firstTeamKey = this.teamTabs[0]?.key ?? '';
    this.currentTeam.set(firstTeamKey);
    const id = this.teamIdByName.get(firstTeamKey) ?? null;
    this.currentTeamId.set(id);
    console.log('[KPI] setTeamTabs:', { teams, teamTabs: this.teamTabs, teamIdByName: Object.fromEntries(this.teamIdByName), firstTeamKey, id });
  }

  onTeamChanged(teamKey: string): void {
    this.currentTeam.set(teamKey);
    const id = this.teamIdByName.get(teamKey) ?? null;
    this.currentTeamId.set(id);
    console.log('[KPI] onTeamChanged:', { teamKey, id });
    this.fetchUnitProgress();
  }

  private fetchUnitProgress(): void {
    const id = this.currentTeamId();
    if (id == null) {
      this.unitProgress.set(null);
      console.warn('[KPI] fetchUnitProgress: no currentTeamId, skipping');
      return;
    }
    console.log('[KPI] fetchUnitProgress: requesting', { unitId: id });
    this.kpiService.getUnitProgress(id).subscribe({
      next: (data) => {
        console.log('[KPI] fetchUnitProgress: response', data);
        this.unitProgress.set(data);
      },
      error: (err) => {
        console.error('[KPI] fetchUnitProgress: error', err);
        this.unitProgress.set(null);
      },
    });
  }

  // Percent conversions for template (0..100)
  progressPct = computed(() => {
    const p = this.unitProgress();
    return p ? Math.round((p.diActualProgress || 0) * 100) : 0;
  });
  baselinePct = computed(() => {
    const p = this.unitProgress();
    return p ? Math.round((p.unitBaseline || 0) * 100) : 0;
  });
  targetPct = computed(() => {
    const p = this.unitProgress();
    return p ? Math.round((p.unitTarget || 0) * 100) : 0;
  });

  // Color selection based on progress vs baseline/target
  statusColor = computed(() => {
    const p = this.unitProgress();
    if (!p) return '#00C389'; // default to On Track green
    const progress = p.diActualProgress ?? 0;
    const baseline = p.unitBaseline ?? 0;
    const target = p.unitTarget ?? 0;

    // Business rule (adjust if needed):
    // - progress < baseline => Delayed (red)
    // - progress >= target => On Track (green)
    // - otherwise => At Risk (amber)
    if (progress < baseline) return '#EF4444';
    if (progress >= target) return '#00C389';
    return '#F4C430';
  });

  // Log any changes in unitProgress and the derived percentages
  progressLogEffect = effect(() => {
    const p = this.unitProgress();
    console.log('[KPI] unitProgress updated:', p);
    console.log('[KPI] computed percents:', {
      progressPct: this.progressPct(),
      baselinePct: this.baselinePct(),
      targetPct: this.targetPct(),
    });
  });
}
