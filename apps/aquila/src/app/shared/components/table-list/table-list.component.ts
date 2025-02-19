import {
  Component,
  computed,
  EventEmitter,
  input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'stc-apps-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss'],
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, TooltipModule],
})
export class TableListComponent implements OnInit, OnDestroy {
  dataSource = input<any[]>([]);
  columnSchema = input<ColumnsSchema[]>([]);
  noDataMessage = input<string>('');
  tableActions = input<
    { action: string; title: string; icon?: string; tooltip?: string }[]
  >([]);
  actionsDisabled = input<boolean>(false);
  enablePagination = input<boolean>(true);
  totalCount = input<number>(0);
  @Output() actionClick = new EventEmitter<{
    actionType: string;
    rowData: any;
  }>();
  @Output() pageChange = new EventEmitter<{ page: number; pageSize: number }>();

  displayedColumns = computed(() => {
    const columns = this.columnSchema();
    if (this.tableActions().length > 0) {
      columns.push({ key: 'actions', type: 'text', label: 'Actions' });
    }
    return columns;
  });

  currentPage = 0;
  rowsPerPage = 10;
  totalRecords = computed(() =>
    this.enablePagination() ? this.dataSource().length : this.totalCount()
  );
  first = computed(() => this.currentPage * this.rowsPerPage);

  ngOnInit(): void {
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) this.currentPage = parseInt(savedPage, 10);
  }

  ngOnDestroy(): void {
    localStorage.removeItem('currentPage');
    localStorage.removeItem('rowsPerPage');
  }

  onActionClick(actionType: string, rowData: any): void {
    if (!this.actionsDisabled()) {
      this.actionClick.emit({ actionType, rowData });
    }
  }

  onPageChange(event: { first: number; rows: number }): void {
    this.currentPage = event.first / event.rows;
    this.rowsPerPage = event.rows;

    localStorage.setItem('currentPage', this.currentPage.toString());
    localStorage.setItem('rowsPerPage', this.rowsPerPage.toString());
  }
}
