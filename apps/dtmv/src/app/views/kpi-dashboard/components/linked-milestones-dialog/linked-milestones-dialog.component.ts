import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { KpiMilestone, KpiService, LinkKpiMilestonesPayload } from '../../kpi.service';
import { KPI } from '../../models/kpi.model';

export type MilestoneRow = KpiMilestone & { selected: boolean };

@Component({
  selector: 'stc-apps-linked-milestones-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    SharedUiModule,
  ],
  templateUrl: './linked-milestones-dialog.component.html',
  styleUrls: ['./linked-milestones-dialog.component.scss'],
})
export class LinkedMilestonesDialogComponent {
  dialogRef = inject(MatDialogRef<LinkedMilestonesDialogComponent>);
  data = inject<{ kpi: KPI; year?: number; canEdit?: boolean }>(MAT_DIALOG_DATA);
  kpiService = inject(KpiService);

  searchControl = new FormControl('');
  searchTerm = signal<string>('');
  submitting = signal<boolean>(false);
  loading = signal<boolean>(false);
  canEdit = Boolean(this.data?.canEdit);

  milestones = signal<MilestoneRow[]>([]);
  selectedIds = computed(() =>
    this.milestones()
      .filter((m) => m.selected)
      .map((m) => m.id)
  );
  visibleMilestones = computed(() =>
    this.canEdit ? this.milestones() : this.milestones().filter((m) => m.selected)
  );

  filteredMilestones = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.visibleMilestones().filter((m) =>
      !term ||
      [m.milestoneName, m.status, m.validationStatus]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  });

  constructor() {
    this.searchControl.valueChanges.subscribe((value) => {
      this.searchTerm.set((value ?? '').toString().trim());
    });
    this.loadMilestones();
  }

  loadMilestones(): void {
    const idRaw = this.data?.kpi?.id;
    const idNum = typeof idRaw === 'number' ? idRaw : Number(idRaw ?? '');
    if (!Number.isFinite(idNum)) {
      this.milestones.set([]);
      this.loading.set(false);
      return;
    }
    const yearValue = typeof this.data?.year === 'number' ? this.data.year : undefined;
    this.loading.set(true);
    this.kpiService.getKpiMilestones(idNum, yearValue).subscribe({
      next: (items) => {
        const rows = (items || []).map((m) => ({
          ...m,
          selected: m.kpiId != null,
        }));
        this.milestones.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.milestones.set([]);
        this.loading.set(false);
      },
    });
  }

  onToggle(id: number, checked: boolean): void {
    if (!this.canEdit) {
      return;
    }
    this.milestones.update((items) =>
      items.map((item) => (item.id === id ? { ...item, selected: checked } : item))
    );
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (!this.canEdit) {
      return;
    }
    const selected = this.selectedIds();
    if (selected.length === 0 || this.submitting()) {
      return;
    }
    const idRaw = this.data?.kpi?.id;
    const idNum = typeof idRaw === 'number' ? idRaw : Number(idRaw ?? '');
    if (!Number.isFinite(idNum)) {
      return;
    }
    const yearValue = typeof this.data?.year === 'number' ? this.data.year : undefined;
    const payload: LinkKpiMilestonesPayload = { milestoneIds: selected };
    this.submitting.set(true);
    this.kpiService.linkKpiMilestones(idNum, payload, yearValue).subscribe({
      next: () => {
        this.submitting.set(false);
        this.dialogRef.close(selected);
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }
}
