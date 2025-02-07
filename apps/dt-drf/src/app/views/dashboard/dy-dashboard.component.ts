/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';

@Component({
  selector: 'stc-apps-category',
  templateUrl: './dy-dashboard.component.html',
  styleUrls: ['./dy-dashboard.component.scss'],
})
export class DyDashboardComponent implements OnInit {
  tableData!: any;
  columnsSchema: ColumnsSchema[] = [
    {
      key: 'name',
      type: 'text',
      label: 'Category Name',
    },
    {
      key: 'slaDuration',
      type: 'text',
      label: 'SLA',
    },

    {
      key: 'actions',
      type: 'actions',
      actions: ['edit', 'delete'],
      label: '',
    },
  ];

  constructor(public router: Router, public route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('initial');
  }
}
