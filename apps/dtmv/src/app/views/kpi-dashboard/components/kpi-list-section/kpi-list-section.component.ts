import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { KPI } from '../../models/kpi.model';
import { KpiDialogService } from '../../services/kpi-dialog.service';
import { KpiService, KpiAttributes, KpiValueRecord } from '../../kpi.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageDialogComponent } from 'libs/shared-ui/src/lib/message-dialog/message-dialog.component';

@Component({
  selector: 'stc-apps-kpi-list-section',
  templateUrl: './kpi-list-section.component.html',
  styleUrls: ['./kpi-list-section.component.scss'],
  providers: [KpiDialogService],
})
export class KpiListSectionComponent {
  selectedKpi = signal<KPI | null>(null);
  dialogService = inject(KpiDialogService);
  dialog = inject(MatDialog);
  kpiService = inject(KpiService);
  searchTerm = signal<string>('');
  attributes = signal([] as { label: string; value: string | number; icon: string }[]);
  attributesLoading = signal<boolean>(false);
  chartGrouping = signal<'monthly' | 'quarterly'>('monthly');
  chartData = signal<any[]>([]);
  chartLoading = signal<boolean>(false);

  // Inputs from parent (Dashboard)
  @Input() kpis: KPI[] = [];
  @Input() loading = false;
  @Input() permissionRole: 'viewer' | 'editor' = 'viewer';

  // Output to parent to request loading next page
  @Output() loadMoreRequested = new EventEmitter<void>();
  // Forward dimensions change from search to parent
  @Output() dimensionFilterChanged = new EventEmitter<string[]>();

  onKpiSelected(kpi: KPI): void {
    this.selectedKpi.set(kpi);
    // Convert KPI id (string | undefined) to a number for API
    const idStr = kpi.id;
    const idNum = typeof idStr === 'string' ? Number(idStr) : NaN;
    if (Number.isFinite(idNum)) {
      this.attributesLoading.set(true);
      // Optionally clear current attributes while loading
      this.attributes.set([]);
      this.fetchAttributesForKpi(idNum);
      // Fetch chart values with current grouping
      this.fetchKpiValues(idNum, this.chartGrouping());
    } else {
      console.warn('Invalid KPI id; cannot load attributes.', idStr);
      this.attributes.set([]);
      this.attributesLoading.set(false);
      this.chartData.set([]);
    }
  }

  onAddNewKpi(): void {
    this.dialogService.openKpiFormDialog().subscribe();
  }

  onEditKpi(kpi: KPI): void {
    this.dialogService.openKpiFormDialog(kpi).subscribe();
  }

  onDeleteKpi(kpi: KPI): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '500px',
      data: {
        title: 'Delete KPI',
        icon: 'warning',
        msg: `Are you sure you want to delete the KPI "${kpi.name}"?`,
      },
      disableClose: true,
      panelClass: 'delete-kpi-dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(filter((confirmed) => confirmed))
      .subscribe();
  }

  onActivityLog(kpi: KPI): void {
    this.dialogService.openActivityLogDialog(kpi).subscribe();
  }

  onUpdateKpiValue(kpi: KPI): void {
    this.dialogService.openUpdateValueDialog(kpi).subscribe();
  }

  onReachEnd(): void {
    this.loadMoreRequested.emit();
  }

  onDimensionsFilterChanged(dimensions: string[]): void {
    this.dimensionFilterChanged.emit(dimensions);
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term || '');
  }

  private fetchAttributesForKpi(kpiId: number): void {
    this.kpiService.getKpiAttributes(kpiId).subscribe({
      next: (resp: KpiAttributes) => {
        const items = [
          {
            label: 'Current Value',
            value: resp.currentValue,
            icon: 'assets/images/kpi-dashboard/chart-bar.svg',
          },
          {
            label: 'Weight',
            value: `${Math.round((resp.weight || 0) * 100)}%`,
            icon: 'assets/images/kpi-dashboard/weight.svg',
          },
          {
            label: 'Baseline',
            value: resp.baseline,
            icon: 'assets/images/kpi-dashboard/chart-bar.svg',
          },
          {
            label: 'Target',
            value: resp.target,
            icon: 'assets/images/kpi-dashboard/target.svg',
          },
          {
            label: 'Ambition',
            value: resp.ambition,
            icon: 'assets/images/kpi-dashboard/ambition.svg',
          },
        ];
        this.attributes.set(items);
        this.attributesLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load KPI attributes', err);
        this.attributes.set([]);
        this.attributesLoading.set(false);
      },
    });
  }

  private fetchKpiValues(kpiId: number, grouping: 'monthly' | 'quarterly'): void {
    this.chartLoading.set(true);
    this.kpiService.getKpiValues(kpiId, grouping).subscribe({
      next: (resp: KpiValueRecord[]) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const items = resp.map((r) => {
          const x = grouping === 'quarterly'
            ? r.quarter
            : (typeof r.month === 'number' && r.month >= 1 && r.month <= 12)
              ? monthNames[r.month - 1]
              : (() => {
                  const d = new Date(r.progressDate);
                  return isNaN(d.getTime()) ? (r.quarter || r.progressDate) : d.toLocaleString('en', { month: 'short' });
                })();
          // Align with shared line chart expectations (value1 + indicatorName1)
          return {
            x,
            value1: r.value ?? 0,
            indicatorName1: '',
          };
        });
        console.log('[KPIS for chart]',items)
        console.log('[KPI Section] fetchKpiValues', {
          grouping,
          rawLength: resp?.length ?? 0,
          rawSample: resp?.[0],
          mappedLength: items.length,
          mappedSample: items[0],
        });
        this.chartData.set(items);
        this.chartLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load KPI values', err);
        this.chartData.set([]);
        this.chartLoading.set(false);
      },
    });
  }

  onChartGroupingChange(grouping: 'monthly' | 'quarterly'): void {
    this.chartGrouping.set(grouping);
    const kpi = this.selectedKpi();
    const idStr = kpi?.id;
    const idNum = typeof idStr === 'string' ? Number(idStr) : (typeof idStr === 'number' ? idStr : NaN);
    if (Number.isFinite(idNum)) {
      this.fetchKpiValues(idNum, grouping);
    }
  }
}
