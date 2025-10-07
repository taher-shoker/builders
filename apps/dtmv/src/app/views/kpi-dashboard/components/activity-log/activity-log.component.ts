import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
export class ActivityLogComponent {
  activityLogs = [
    {
      title: 'KPI added',
      date: new Date(),
      returned: false,
      author: 'john.doe@stc.net',
    },
    {
      title: 'KPI updated',
      date: new Date(Date.now() - 86400000),
      returned: false,
      author: 'admin@stc.net',
    },
    {
      title: 'System check KPI status',
      date: new Date(Date.now() - 172800000),
      returned: true,
      author: 'jane.smith@stc.net',
    },
    {
      title: 'KPI status is delayed',
      date: new Date(Date.now() - 259200000),
      returned: false,
      author: 'john.doe@stc.net',
    },
    {
      title: 'Justification returned from DT approval',
      date: new Date(Date.now() - 345600000),
      returned: false,
      author: 'alex.ray@stc.net',
    },
    {
      title: 'new Justification submit',
      date: new Date(Date.now() - 345600000),
      returned: false,
      author: 'alex.ray@stc.net',
    },
    {
      title: 'Justification approved from DT approval',
      date: new Date(Date.now() - 345600000),
      returned: false,
      author: 'alex.ray@stc.net',
    },
    {
      title: 'Dt-director approve the milestone',
      date: new Date(Date.now() - 345600000),
      returned: false,
      author: 'Ahmed12@stc.net',
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<ActivityLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActivityLogComponent
  ) {}

  onCancel(): void {
    this.dialogRef.close({
      success: false,
      action: 'cancel',
    });
  }
}
