import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListComponent } from '../../../shared/components/table-list/table-list.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ActivityMonitoringFiltersComponent } from '../activity-monitoring-filters/activity-monitoring-filters.component';

@Component({
  selector: 'stc-apps-activity-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    TableListComponent,
    SharedUiModule,
    ActivityMonitoringFiltersComponent,
  ],
  templateUrl: './activity-monitoring-list.component.html',
  styleUrls: ['./activity-monitoring-list.component.scss'],
})
export class ActivityMonitoringListComponent implements AfterViewInit {
  @ViewChild('statusCustomTemplate') statusCustomTemplate!: TemplateRef<any>;
  columnsSchema: ColumnsSchema[] = [];

  dataSource = [
    {
      email: 'john.doe@example.com',
      userRole: 'User',
      action: 'Login',
      dateTime: '2023-10-01 10:30 AM',
      status: 'Success',
    },
    {
      email: 'jane.smith@example.com',
      userRole: 'Admin',
      action: 'Add standard',
      dateTime: '2023-10-01 11:15 AM',
      status: 'Success',
    },
    {
      email: 'alice.johnson@example.com',
      userRole: 'Admin',
      action: 'Update standard',
      dateTime: '2023-10-01 12:00 PM',
      status: 'Failed',
    },
    {
      email: 'bob.brown@example.com',
      userRole: 'Admin',
      action: 'Add standard',
      dateTime: '2023-10-01 01:45 PM',
      status: 'Success',
    },
    {
      email: 'charlie.davis@example.com',
      userRole: 'User',
      action: 'Login',
      dateTime: '2023-10-01 02:30 PM',
      status: 'Failed',
    },
  ];
  filteredDataSource = this.dataSource;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columnsSchema = [
        { key: 'email', type: 'text', label: 'Email' },
        { key: 'userRole', type: 'text', label: 'User Role' },
        { key: 'action', type: 'text', label: 'Action' },
        { key: 'dateTime', type: 'text', label: 'Date & Time' },
        {
          key: 'status',
          type: 'custom',
          label: 'Status',
          complexViewTemp: this.statusCustomTemplate,
        },
      ];
    });
  }

  onFiltersChanged(filters: any) {
    this.filteredDataSource = this.dataSource.filter((item) => {
      return (
        (!filters.email ||
          item.email.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.userRole?.value ||
          item.userRole === filters.userRole.value) &&
        (!filters.status?.value || item.status === filters.status.value) &&
        (!filters.action?.value || item.action === filters.action.value) &&
        (!filters.date ||
          new Date(item.dateTime).toDateString() ===
            new Date(filters.date).toDateString())
      );
    });
  }
}
