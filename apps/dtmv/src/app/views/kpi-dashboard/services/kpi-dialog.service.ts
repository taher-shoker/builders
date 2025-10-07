import { Injectable } from '@angular/core';
import { DialogConfig, DialogResult, KPI } from '../models/kpi.model';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { KpiFormDialogComponent } from '../components/kpi-form-dialog/kpi-form-dialog.component';
import { UpdateValueDialogComponent } from '../components/update-value-dialog/update-value-dialog.component';
import { ActivityLogComponent } from '../components/activity-log/activity-log.component';

@Injectable({
  providedIn: 'root',
})
export class KpiDialogService {
  private defaultConfig: DialogConfig = {
    width: '600px',
    disableClose: true,
  };
  constructor(private dialog: MatDialog) {}

  // Open Add KPI Dialog
  openKpiFormDialog(kpi?: KPI): Observable<DialogResult<KPI>> {
    return this.dialog
      .open(KpiFormDialogComponent, {
        ...this.defaultConfig,
        width: '700px',
        data: { kpi, mode: kpi ? 'edit' : 'add' },
      })
      .afterClosed();
  }

  openUpdateValueDialog(
    kpi: KPI
  ): Observable<DialogResult<{ newValue: number; notes: string }>> {
    return this.dialog
      .open(UpdateValueDialogComponent, {
        ...this.defaultConfig,
        width: '900px',
        data: { kpi },
      })
      .afterClosed();
  }

  openActivityLogDialog(kpi: KPI): Observable<void> {
    return this.dialog
      .open(ActivityLogComponent, {
        width: '500px',
        height: '100vh',
        position: {
          top: '0',
          right: '0',
        },
        hasBackdrop: true,
        disableClose: false,
        data: { kpi, viewOnly: true },
        panelClass: 'right-side-panel-dialog',
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
      })
      .afterClosed();
  }
}
