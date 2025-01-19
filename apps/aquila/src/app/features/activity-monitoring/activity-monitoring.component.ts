import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListComponent } from '../../shared/components/table-list/table-list.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { SharedUiModule } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-activity-monitoring',
  standalone: true,
  imports: [CommonModule, TableListComponent, SharedUiModule],
  templateUrl: './activity-monitoring.component.html',
  styleUrls: ['./activity-monitoring.component.scss'],
})
export class ActivityMonitoringComponent {
  columnsSchema: ColumnsSchema[] = [
    { key: 'name', type: 'text', label: 'Name' },
    { key: 'version', type: 'text', label: 'Version' },
    { key: 'businessArea', type: 'text', label: 'Business Area' },
    { key: 'publishUpdate', type: 'text', label: 'Publish Date' },
    { key: 'lastUpdate', type: 'text', label: 'Latest Update Date' },
  ];
}
