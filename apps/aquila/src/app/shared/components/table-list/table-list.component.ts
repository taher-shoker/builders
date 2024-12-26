/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  computed,
  effect,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { ApiStandard } from '../../models/standards.models';
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'stc-apps-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss'],
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule],
})
export class TableListComponent {
  dataSource = input<ApiStandard[]>([]);
  columnSchema = input<ColumnsSchema[]>([]);
  noDataMessage = input<string>('');
  tableActions = input<string[]>([]);
  @Output() actionClick = new EventEmitter<{
    actionType: string;
    rowData: ApiStandard;
  }>();

  displayedColumns = computed(() => {
    const columns = this.columnSchema();
    if (this.tableActions().length > 0) {
      columns.push({ key: 'actions', type: 'text', label: 'Actions' });
    }
    return columns;
  });

  onActionClick(actionType: string, rowData: ApiStandard): void {
    this.actionClick.emit({ actionType, rowData });
  }
}
