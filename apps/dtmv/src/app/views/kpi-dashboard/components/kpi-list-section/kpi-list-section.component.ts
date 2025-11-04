import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { KPI } from '../../models/kpi.model';
import { KpiDialogService } from '../../services/kpi-dialog.service';
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
  kpiService = inject(KpiDialogService);
  searchTerm = signal<string>('');

  // Inputs from parent (Dashboard)
  @Input() kpis: KPI[] = [];
  @Input() loading = false;

  // Output to parent to request loading next page
  @Output() loadMoreRequested = new EventEmitter<void>();
  // Forward dimensions change from search to parent
  @Output() dimensionFilterChanged = new EventEmitter<string[]>();

  onKpiSelected(kpi: KPI): void {
    this.selectedKpi.set(kpi);
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
}
