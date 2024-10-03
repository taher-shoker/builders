import { Component, OnInit, ViewChild } from '@angular/core';
import { DataUploadService } from '../../services/data-upload.service';
import { LogService } from '../../services/logs.service';
import { logs } from '../../models/logsModel';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'stc-apps-logs-table',
  templateUrl: './logs-table.component.html',
  styleUrl: './logs-table.component.scss',
})
export class LogsTableComponent implements OnInit {
  ELEMENT_DATA: logs[] = [];
  constructor(
    private dataUploadService: DataUploadService,
    private logService: LogService
  ) {}

  displayedColumns: string[] = [
    'jobId',
    'executedBy',
    'originalFileName',
    'startTime',
    'endTime',
    'status',
    'jobCategory',
    'talendJobName',
    'sourceSubsidiaryName',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  emptyData = new MatTableDataSource([{ empty: 'row' }]);
  dataSource: any;

  ngOnInit(): void {
    this.getLogsHistory();
    this.subscribeToFailedLogs();
    this.subscribeToLogUpdates();
  }
  getLogsHistory() {
    this.dataUploadService.getLogHistory().subscribe({
      next: (result) => {
        this.ELEMENT_DATA = result;
        // console.log(this.ELEMENT_DATA, 'dataupload');

        this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  subscribeToLogUpdates() {
    this.logService.logUpdates.subscribe((newLog) => {
      if (newLog) {
        this.ELEMENT_DATA.unshift(newLog);
        this.dataSource.data = [...this.ELEMENT_DATA];
      }
    });
  }
  subscribeToFailedLogs() {
    this.logService.logFailedSubject.subscribe((failedLod) => {
      if (failedLod) {
        console.log('failedLog', failedLod);

        this.getLogsHistory();
      }
    });
  }
}
