import { Component, OnInit, computed, signal, effect } from '@angular/core';
import { KpiService, UnitsGroupedCategory, TeamSummary, UnitProgress, KpiListResponse, KpiListItem } from './kpi.service';
import { KPI } from './models/kpi.model';
import { PermissionService } from '../../services/permission.service';
import { ToastrService } from 'ngx-toastr';

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

  // Permission role to control actions in the KPI list section
  permissionRole: 'viewer' | 'editor' = 'viewer';

  // Unit progress state
  unitProgress = signal<UnitProgress | null>(null);
  currentTeamId = signal<number | null>(null);

  // KPI List state (parent-driven pagination)
  kpis = signal<KPI[]>([]);
  private page = signal<number>(0);
  private readonly size = 500;
  private last = signal<boolean>(false);
  loadingKpis = signal<boolean>(false);
  private selectedDimensions = signal<string[]>([]);

  // Year filter state (UI only for now)
  yearsOptions: { id: string; name: string }[] = [];
  selectedYear = signal<string>('');

  // Global loading indicator and year-change cycle tracking
  private pendingRequests = signal<number>(0);
  globalLoading = computed(() => this.pendingRequests() > 0 || this.loadingKpis());
  private yearChangeInProgress = signal<boolean>(false);

  constructor(
    private kpiService: KpiService,
    private permissionService: PermissionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Determine permission role based on user groups
    const isEditor = this.permissionService.checkIsAdmin() || this.permissionService.checkIsGovernance();
    this.permissionRole = isEditor ? 'editor' : 'viewer';

    // Initialize year options from 2025 to current year
    this.populateYearsOptions();

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
        // initial KPI page
        this.fetchKpiPage(true);
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

  private populateYearsOptions(): void {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    const years: { id: string; name: string }[] = [];
    for (let y = startYear; y <= currentYear; y++) {
      const ys = String(y);
      years.push({ id: ys, name: ys });
    }
    this.yearsOptions = years;
    this.selectedYear.set(String(currentYear));
  }

  onTabChanged(tabName: string): void {
    this.currentTab.set(tabName);

    // Update teams for the selected category from cached data
    const teams = this.unitsGrouped.find((u) => u.category === tabName)?.teams || [];
    this.setTeamTabs(teams);
    // Refetch KPI list for the new unit context
    this.fetchKpiPage(true);
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
    this.kpiService.setCurrentUnitId(id);
    console.log('[KPI] setTeamTabs:', { teams, teamTabs: this.teamTabs, teamIdByName: Object.fromEntries(this.teamIdByName), firstTeamKey, id });
  }

  onTeamChanged(teamKey: string): void {
    this.currentTeam.set(teamKey);
    const id = this.teamIdByName.get(teamKey) ?? null;
    this.currentTeamId.set(id);
    this.kpiService.setCurrentUnitId(id);
    console.log('[KPI] onTeamChanged:', { teamKey, id });
    this.fetchUnitProgress();
    // Reset KPIs when team changes
    this.fetchKpiPage(true);
  }

  private fetchUnitProgress(): void {
    const id = this.currentTeamId();
    if (id == null) {
      this.unitProgress.set(null);
      console.warn('[KPI] fetchUnitProgress: no currentTeamId, skipping');
      return;
    }
    const year = Number(this.selectedYear());
    console.log('[KPI] fetchUnitProgress: requesting', { unitId: id, year });
    // Track global loading
    this.pendingRequests.set(this.pendingRequests() + 1);
    this.kpiService.getUnitProgress(id, Number.isFinite(year) ? year : undefined).subscribe({
      next: (data) => {
        console.log('[KPI] fetchUnitProgress: response', data);
        this.unitProgress.set(data);
      },
      error: (err) => {
        console.error('[KPI] fetchUnitProgress: error', err);
        this.unitProgress.set(null);
        this.pendingRequests.set(Math.max(this.pendingRequests() - 1, 0));
      },
      complete: () => {
        this.pendingRequests.set(Math.max(this.pendingRequests() - 1, 0));
      },
    });
  }

  // --- KPI List fetching with pagination ---
  private mapKpiItem(item: KpiListItem): KPI {
    return {
      id: String(item.id),
      name: item.name,
      description: item.dimension,
    };
  }

  fetchKpiPage(reset = false): void {
    if (reset) {
      this.kpis.set([]);
      this.page.set(0);
      this.last.set(false);
    }
    if (this.last()) return;
    this.loadingKpis.set(true);
    // Track global loading
    this.pendingRequests.set(this.pendingRequests() + 1);
    const page = this.page();
    const unitId = this.currentTeamId();
    const dims = this.selectedDimensions();
    const dimensionParam = dims.length === 1 ? dims[0] : undefined;
    if (unitId == null) {
      console.warn('[KPI] fetchKpiPage: no unitId, skipping');
      this.loadingKpis.set(false);
      this.pendingRequests.set(Math.max(this.pendingRequests() - 1, 0));
      return;
    }
    const year = Number(this.selectedYear());
    this.kpiService.getKpis(page, this.size, unitId, dimensionParam, Number.isFinite(year) ? year : undefined).subscribe({
      next: (res: KpiListResponse) => {
        const mapped = (res.content || []).map((i) => this.mapKpiItem(i));
        this.kpis.set([...(this.kpis() || []), ...mapped]);
        this.last.set(!!res.last);
        this.page.set(page + 1);
        this.loadingKpis.set(false);
        console.log('[KPI] fetchKpiPage:', { page, size: this.size, unitId, dimension: dimensionParam, received: mapped.length, last: res.last });
      },
      error: (err) => {
        console.error('[KPI] fetchKpiPage error:', err);
        this.loadingKpis.set(false);
        this.pendingRequests.set(Math.max(this.pendingRequests() - 1, 0));
      },
      complete: () => {
        this.pendingRequests.set(Math.max(this.pendingRequests() - 1, 0));
      },
    });
  }

  onLoadMoreRequested(): void {
    if (!this.loadingKpis() && !this.last()) {
      this.fetchKpiPage();
    }
  }

  // Year change handler (hook for future data filtering if needed)
  onYearChanged(yearName: string): void {
    this.selectedYear.set(yearName);
    // Start year-change cycle: show info toast and enable global loader
    this.yearChangeInProgress.set(true);
    this.toastr.info(`Reloading dashboard data for ${yearName}...`, 'Updating');
    // Refresh data across the dashboard when year changes
    this.fetchUnitProgress();
    this.fetchKpiPage(true);
  }

  // Handle dimension filter changes from search (via section)
  onDimensionFilterChanged(dimensions: string[]): void {
    this.selectedDimensions.set(dimensions || []);
    this.fetchKpiPage(true);
  }

  // Refresh on demand (e.g., after creating a KPI)
  onRefreshRequested(): void {
    this.fetchKpiPage(true);
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

  // Toast success when a year-change cycle finishes
  yearChangeToastEffect = effect(() => {
    const pending = this.pendingRequests();
    const kpisLoading = this.loadingKpis();
    const inCycle = this.yearChangeInProgress();
    if (inCycle && pending === 0 && !kpisLoading) {
      const yearName = this.selectedYear();
      this.toastr.success(`Dashboard updated for ${yearName}`, 'Done');
      this.yearChangeInProgress.set(false);
    }
  });
}
