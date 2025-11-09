import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KPI } from '../../models/kpi.model';
import { KpiService, KpiActivityLogEntry } from '../../kpi.service';

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
  activityLogs: {
    title: string;
    date: Date;
    returned: boolean;
    author: string;
    value?: number;
    descriptionHtml?: string;
    icon?: string;
    iconColor?: 'primary' | 'accent' | 'warn';
    attachments?: { id?: number; label: string; url?: string }[];
  }[] = [];
  kpiActivityLogs?: KpiActivityLogEntry[];

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
        this.kpiActivityLogs = res;
        this.activityLogs = (res || []).map((entry) => {
          const dateObj = new Date(entry.createdAt);
          const date = isNaN(dateObj.getTime()) ? new Date() : dateObj;
          const valueMatch = entry.details ? entry.details.match(/Actual\s+Progress:\s*([\d.]+)/i) : null;
          const value = valueMatch ? Number(valueMatch[1]) : undefined;
          const t = (entry.title || '').toLowerCase();
          let icon = 'check_circle';
          let iconColor: 'primary' | 'accent' | 'warn' = 'primary';
          if (t.includes('progress')) {
            icon = 'trending_up';
            iconColor = 'accent';
          } else if (t.includes('added')) {
            icon = 'add_circle';
            iconColor = 'primary';
          } else if (t.includes('updated')) {
            icon = 'edit';
            iconColor = 'primary';
          }
          const attachments = Array.isArray(entry.attachments)
            ? entry.attachments.map((a) => {
                const id = typeof a.id === 'number' ? a.id : Number(a.id);
                const hasId = Number.isFinite(id);
                const urlFromId = hasId ? this.kpiService.getAttachmentDownloadUrl(id) : undefined;
                const fallbackUrl =
                  typeof a.url === 'string' && (a.url.startsWith('http') || a.url.startsWith('/'))
                    ? a.url
                    : undefined;
                return {
                  id: hasId ? id : undefined,
                  label: a.label || a.fileName || (hasId ? `Attachment #${id}` : 'Attachment'),
                  url: urlFromId || fallbackUrl,
                };
              })
            : [];
          return {
            title: entry.title || 'Activity',
            date,
            returned: false,
            author: entry.username || 'system',
            value,
            descriptionHtml: entry.details || '',
            icon,
            iconColor,
            attachments,
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

  onDownloadAttachment(att: { id?: number; label: string; url?: string }): void {
    if (!att) return;
    const id = att.id;
    const name = (att.label || 'attachment').toString();
    if (typeof id === 'number' && Number.isFinite(id)) {
      this.kpiService.downloadAttachment(id).subscribe({
        next: (blob) => {
          try {
            saveAs(blob, name);
          } catch (e) {
            // Fallback: open in new tab if saveAs fails
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => URL.revokeObjectURL(url), 10_000);
          }
        },
        error: (err) => {
          console.error('Attachment download failed', id, err);
          // Fallback to direct URL if available
          if (att.url) {
            window.open(att.url, '_blank');
          }
        },
      });
    } else if (att.url) {
      window.open(att.url, '_blank');
    }
  }
}
