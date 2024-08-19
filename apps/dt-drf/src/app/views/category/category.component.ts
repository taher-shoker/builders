/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { CategoryDialogComponent } from './categoryDialog/categoryDialog.component';
import { MessageDialogComponent } from 'libs/shared-ui/src/lib/message-dialog/message-dialog.component';
import { Category, ReportsService } from '../dy-reports/dy-reports.service';

@Component({
  selector: 'stc-apps-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
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

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private matDialog: MatDialog,
    private reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.reportsService.getCategories().subscribe((res) => {
      res.sort(function (a, b) {
        return b.id - a.id;
      });
      this.tableData = res;
    });
  }

  tableAction(event: { value: string; dataRow: any }) {
    if (event.value === 'edit') {
      this.editCategory(event.dataRow);
    } else {
      // Do Delete
      this.deleteCategory(event.dataRow);
    }
  }

  editCategory(category: Category) {
    const dialogRef = this.matDialog.open(CategoryDialogComponent, {
      width: '800px',
      data: { state: 'edit', category },
    });

    dialogRef.afterClosed().subscribe((res: Category) => {
      if (!res) {
        return;
      }

      const editObj: Category = {
        name: res.name,
        id: category.id,
        isDeletable: category.isDeletable,
        slaDuration: res.slaDuration,
      };
      this.reportsService.editCategory(editObj).subscribe({
        next: () => {
          this.getCategories();
        },
        error: (err) => {
          console.log('Err trying to edit the category:', err);
        },
      });
    });
  }

  deleteCategory(category: Category) {
    const dialogRef = this.matDialog.open(MessageDialogComponent, {
      width: '800px',
      data: { msg: `Are you sure to delete "${category.name}" category ?` },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this.reportsService.deleteCategory(category.id).subscribe({
        next: () => {
          this.getCategories();
        },
        error: (err) => {
          console.log('Err trying to delete the category:', err);
        },
      });
    });
  }

  addNewCategory() {
    const dialogRef = this.matDialog.open(CategoryDialogComponent, {
      width: '800px',
      data: { state: 'add' },
    });

    dialogRef.afterClosed().subscribe((res: Category) => {
      if (!res) {
        return;
      }

      this.reportsService.postCategory(res).subscribe((postRes) => {
        console.log('Got', postRes);
        this.getCategories();
      });
    });
  }
}
