import { Component, OnInit, signal } from '@angular/core';
import { KpiService, UnitsGroupedCategory, TeamSummary } from './kpi.service';

@Component({
  selector: 'stc-apps-kpi-dashboard',
  templateUrl: './kpi-dashboard.component.html',
  styleUrls: ['./kpi-dashboard.component.scss'],
})
export class KpiDashboardComponent implements OnInit {
  currentTab = signal<string>('');
  customTabs: { label: string; key: string }[] = [];
  private unitsGrouped: UnitsGroupedCategory[] = [];

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
  }

  // --- Teams Tabs state ---
  currentTeam = signal<string>('');
  teamTabs: { label: string; key: string }[] = [];

  private setTeamTabs(teams: TeamSummary[]) {
    this.teamTabs = (teams || []).map((t) => ({ label: t.name, key: t.name }));
    const firstTeamKey = this.teamTabs[0]?.key ?? '';
    this.currentTeam.set(firstTeamKey);
  }

  onTeamChanged(teamKey: string): void {
    this.currentTeam.set(teamKey);
    // TODO: trigger data load for selected team/category when backend endpoints are available
  }
}
