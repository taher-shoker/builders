import {
  Component,
  computed,
  EventEmitter,
  input,
  OnInit,
  Output,
} from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Standard } from '../../models/standards.models';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'stc-apps-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss'],
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, TooltipModule],
})
export class TableListComponent implements OnInit {
  dataSource = input<Standard[]>([]);
  columnSchema = input<ColumnsSchema[]>([]);
  noDataMessage = input<string>('');
  tableActions = input<{ action: string; title: string }[]>([]);
  actionsDisabled = input<boolean>(false);
  @Output() actionClick = new EventEmitter<{
    actionType: string;
    rowData: any;
  }>();

  displayedColumns = computed(() => {
    const columns = this.columnSchema();
    if (this.tableActions().length > 0) {
      columns.push({ key: 'actions', type: 'text', label: 'Actions' });
    }
    return columns;
  });

  currentPage = 0;
  rowsPerPage = 10;

  ngOnInit(): void {
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
      this.currentPage = parseInt(savedPage, 10);
    }
  }

  onActionClick(actionType: string, rowData: any): void {
    if (!this.actionsDisabled()) {
      this.actionClick.emit({ actionType, rowData });
    }
  }

  onPageChange(event: { first: number; rows: number }): void {
    this.currentPage = event.first / event.rows;
    localStorage.setItem('currentPage', this.currentPage.toString());
  }
}
