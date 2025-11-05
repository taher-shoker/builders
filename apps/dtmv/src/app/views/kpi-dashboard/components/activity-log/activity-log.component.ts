import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KPI } from '../../models/kpi.model';
import { KpiService, KpiLog } from '../../kpi.service';

@Component({
  selector: 'stc-apps-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
animations: [
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateX(100%)'
      })),
      state('*', style({
        transform: 'translateX(0)'
      })),
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class ActivityLogComponent implements OnInit {
  activityLogs: { title: string; date: Date; returned: boolean; author: string; value?: number }[] = [];
  kpiLog?: KpiLog;

  constructor(
    public dialogRef: MatDialogRef<ActivityLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { kpi: KPI; viewOnly?: boolean },
    private kpiService: KpiService
  ) {}

  ngOnInit(): void {
    const rawId = this.data?.kpi?.id;
    const kpiId = typeof rawId === 'number' ? rawId : Number(rawId);
    if (!Number.isFinite(kpiId)) {
      this.activityLogs = [];
      return;
    }
    console.log('[ActivityLog] Fetching KPI log for id', kpiId);
    this.kpiService.getKpiLog(kpiId).subscribe({
      next: (res) => {
        this.kpiLog = res;
        this.activityLogs = (res.kpiProgresses || []).map((p) => {
          // Prefer createDate if present; fallback to progressDate
          const dateStr = p.createDate || p.progressDate;
          const dateObj = new Date(dateStr);
          const date = isNaN(dateObj.getTime()) ? new Date() : dateObj;
          return {
            title: 'Progress updated',
            date,
            returned: false,
            author: p.createdBy || 'system',
            value: p.value
          };
        });
      },
      error: () => {
        this.activityLogs = [];
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close({
      success: false,
      action: 'cancel',
    });
  }
}
