/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { CategoryDialogComponent } from './categoryDialog/categoryDialog.component';
import { MessageDialogComponent } from 'libs/shared-ui/src/lib/message-dialog/message-dialog.component';

@Component({
  selector: 'stc-apps-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  tableData!: any;
  columnsSchema: ColumnsSchema[] = [
    {
      key: 'categoryName',
      type: 'text',
      label: 'Category Name',
    },
    {
      key: 'sla',
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

  categoriesTotalCount: number = 90;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.tableData = [
      { categoryName: 'First category', sla: 8 },
      { categoryName: 'Sec category', sla: 2 },
      { categoryName: 'Thr category', sla: 4 },
    ];
  }

  tableAction(event: { value: string; dataRow: any }) {
    console.log("EL EV", event)
    if (event.value === 'edit') {
      this.editCategory(event.dataRow);
    } else {
      // Do Delete
      this.deleteCategory(event.dataRow.categoryName)
    }
  }

  editCategory(category: any) {
    const dialogRef = this.matDialog.open(CategoryDialogComponent, {
      width: '800px',
      data: { state: 'edit', category },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
    });
  }

  deleteCategory(name: string){
    const dialogRef = this.matDialog.open(MessageDialogComponent, {
      width: '800px',
      data: {msg: `Are you sure to delete "${name}" category ?`}
    })

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
    });
  }

  addNewCategory() {
    const dialogRef = this.matDialog.open(CategoryDialogComponent, {
      width: '800px',
      data: { state: 'add' },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
    });
  }
}
