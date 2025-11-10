import { Component, inject, signal, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { KPI } from '../../models/kpi.model';
import { KpiDialogService } from '../../services/kpi-dialog.service';
import { KpiService, KpiAttributes, KpiValueRecord } from '../../kpi.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ConfirmationModalComponent } from 'libs/shared-ui/src/lib/confirmation-modal/confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'stc-apps-kpi-list-section',
  templateUrl: './kpi-list-section.component.html',
  styleUrls: ['./kpi-list-section.component.scss'],
  providers: [KpiDialogService],
})
export class KpiListSectionComponent {
  selectedKpi = signal<KPI | null>(null);
  // Client-side dimensions filter state
  selectedDimensions = signal<string[]>([]);
  dialogService = inject(KpiDialogService);
  dialog = inject(MatDialog);
  kpiService = inject(KpiService);
  toastr = inject(ToastrService);
  searchTerm = signal<string>('');
  attributes = signal([] as { label: string; value: string | number; icon: string }[]);
  attributesLoading = signal<boolean>(false);
  chartGrouping = signal<'monthly' | 'quarterly'>('monthly');
  chartData = signal<any[]>([]);
  chartLoading = signal<boolean>(false);

  private clearSelectionState(): void {
    this.selectedKpi.set(null);
    this.attributes.set([]);
    this.chartData.set([]);
    this.attributesLoading.set(false);
    this.chartLoading.set(false);
  }

  // Inputs from parent (Dashboard)
  @Input() kpis: KPI[] = [];
  @Input() loading = false;
  @Input() permissionRole: 'viewer' | 'editor' = 'viewer';
  @Input() unitId: number | null = null;
  // Parent-provided guard to prevent redundant load-more requests
  @Input() canLoadMore = true;

  // Output to parent to request loading next page
  @Output() loadMoreRequested = new EventEmitter<void>();
  // Forward dimensions change from search to parent
  @Output() dimensionFilterChanged = new EventEmitter<string[]>();
  // Request parent to refresh KPI list (reset and refetch)
  @Output() refreshRequested = new EventEmitter<void>();
  @Output() exportRequested = new EventEmitter<void>();

  /**
   * Returns true if there are any KPIs in the current list.
   * Used by the template to conditionally render the search/filter component.
   */
  hasKpis(): boolean {
    const list = this.kpis || [];
    return Array.isArray(list) && list.length > 0;
  }

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
    this.dialogService.openKpiFormDialog(undefined, this.unitId).subscribe((result) => {
      if (result && result.success) {
        // Ask parent to refresh KPI list
        this.refreshRequested.emit();
        this.toastr.success('KPI added successfully');
      }
    });
  }

  onExportKPIs(): void {
    if (this.unitId) {
      this.exportRequested.emit();
    } else {
      this.toastr.warning('No unit selected to export KPIs');
    }
  }

  onEditKpi(kpi: KPI): void {
    this.dialogService.openKpiFormDialog(kpi, this.unitId).subscribe((result) => {
      if (result && result.success) {
        this.toastr.success('KPI updated successfully');
        const idRaw = kpi.id ?? this.selectedKpi()?.id;
        const idNum = typeof idRaw === 'string' ? Number(idRaw) : (typeof idRaw === 'number' ? idRaw : NaN);
        if (!Number.isFinite(idNum)) {
          console.warn('Invalid KPI id; cannot refresh after edit.', idRaw);
          this.toastr.warning('Updated, but failed to reload details');
          return;
        }

        // Refresh selected KPI basic info, attributes, and values
        this.attributesLoading.set(true);
        this.attributes.set([]);

        this.kpiService.getKpiById(idNum).subscribe({
          next: (details) => {
            const updated: KPI = {
              id: String(details.id),
              name: details.name,
              description: details.dimension,
            };
            // Update the selected card info
            this.selectedKpi.set(updated);
            // Also update the item in the rendered list so the card reflects latest name/dimension
            const currentList = this.kpis || [];
            const targetId = String(details.id);
            this.kpis = currentList.map((it) =>
              String(it.id) === targetId
                ? { ...it, name: details.name, description: details.dimension }
                : it
            );
            this.fetchAttributesForKpi(idNum);
            this.fetchKpiValues(idNum, this.chartGrouping());
          },
          error: (err: HttpErrorResponse) => {
            console.error('Failed to load KPI details after edit', err);
            // Fallback: at least refresh attributes and values using existing selection
            this.fetchAttributesForKpi(idNum);
            this.fetchKpiValues(idNum, this.chartGrouping());
            this.toastr.warning('Updated, but failed to reload details');
          },
        });
      }
    });
  }

  onDeleteKpi(kpi: KPI): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '520px',
      data: {
        title: 'Delete the KPI',
        message: `Are you sure that you want to proceed deleting the KPI "<strong>${kpi.name}</strong>"?`,
        approveLabel: 'Yes, Delete',
        cancelLabel: 'Cancel',
      },
      disableClose: true,
      panelClass: 'delete-kpi-dialog',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      const idStr = kpi.id;
      const idNum = typeof idStr === 'string' ? Number(idStr) : idStr as number | undefined;
      if (idNum == null || !Number.isFinite(Number(idNum))) {
        console.warn('Invalid KPI id; cannot delete.', idStr);
        return;
      }
      this.kpiService.deleteKpi(Number(idNum)).subscribe({
        next: () => {
          // Clear selection and ask parent to refresh the list
          this.selectedKpi.set(null);
          this.refreshRequested.emit();
          this.toastr.success('KPI deleted successfully');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to delete KPI', err);
          this.toastr.error('Failed to delete KPI');
        },
      });
    });
  }

  onActivityLog(kpi: KPI): void {
    this.dialogService.openActivityLogDialog(kpi).subscribe();
  }

  onUpdateKpiValue(kpi: KPI): void {
    this.dialogService.openUpdateValueDialog(kpi).subscribe((result) => {
      // After successful update, simulate re-selecting the KPI to refresh
      if (result && result.success) {
        this.onKpiSelected(kpi);
        this.toastr.success('KPI actual value updated successfully');
      }
    });
  }

  onReachEnd(): void {
    if (!this.canLoadMore) {
      return;
    }
    this.loadMoreRequested.emit();
  }

  onDimensionsFilterChanged(dimensions: string[]): void {
    // Client-side filtering: keep selection locally and do not trigger server fetch
    this.selectedDimensions.set(dimensions || []);
    // If no dimensions are selected, clear current selection and related state
    if (!dimensions || dimensions.length === 0) {
      this.clearSelectionState();
      return;
    }
    // If the current selection is excluded by the new dimensions filter, clear selection
    const selected = this.selectedKpi();
    const selectedDim = (selected?.description || '').trim();
    const include = (dimensions || []).map((d) => String(d).trim());
    if (selected && selectedDim && !include.includes(selectedDim)) {
      this.clearSelectionState();
    }
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term || '');

    // Apply combined filtering (dimensions + search) to determine visibility
    const all = this.kpis || [];
    const t = (term || '').trim().toLowerCase();
    const dims = (this.selectedDimensions() || []).map((d) => String(d).trim());
    const byDims = !dims || dims.length === 0
      ? []
      : all.filter((k) => dims.includes(String(k.description || '').trim()));
    const filtered = !t
      ? byDims
      : byDims.filter((k) => (
          (k.name || '').toLowerCase().includes(t) ||
          (k.description || '').toLowerCase().includes(t)
        ));

    if (filtered.length === 0) {
      this.clearSelectionState();
      return;
    }

    // If selected KPI is no longer visible after search, clear selection
    const selected = this.selectedKpi();
    if (selected && !filtered.some((k) => String(k.id) === String(selected.id))) {
      this.clearSelectionState();
    }
  }

  // Clear selection when incoming KPI list becomes empty or no longer contains the selected item
  ngOnChanges(changes: SimpleChanges): void {
    if ('kpis' in changes) {
      const currentList: KPI[] = this.kpis || [];
      const selected = this.selectedKpi();

      // If list is empty, clear selection and related state
      if (!currentList || currentList.length === 0) {
        this.selectedKpi.set(null);
        this.attributes.set([]);
        this.chartData.set([]);
        this.attributesLoading.set(false);
        this.chartLoading.set(false);
        return;
      }

      // If currently selected KPI is not in the new list, clear selection
      if (selected && !currentList.some((k) => String(k.id) === String(selected.id))) {
        this.selectedKpi.set(null);
        this.attributes.set([]);
        this.chartData.set([]);
        this.attributesLoading.set(false);
        this.chartLoading.set(false);
      }
    }
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
        this.toastr.error('Failed to load KPI attributes');
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
        // console.log('[KPIS for chart]',items)
        // console.log('[KPI Section] fetchKpiValues', {
        //   grouping,
        //   rawLength: resp?.length ?? 0,
        //   rawSample: resp?.[0],
        //   mappedLength: items.length,
        //   mappedSample: items[0],
        // });
        this.chartData.set(items);
        this.chartLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load KPI values', err);
        this.chartData.set([]);
        this.chartLoading.set(false);
        this.toastr.error('Failed to load KPI values');
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
