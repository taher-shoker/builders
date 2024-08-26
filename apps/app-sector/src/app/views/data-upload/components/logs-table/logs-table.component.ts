import {
  Component,
  effect,
  input,
  InputSignal,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { logs } from '../../models/logModel';
import { DataUploadService } from '../../services/data-upload.service';

@Component({
  selector: 'stc-apps-logs-table',
  templateUrl: './logs-table.component.html',
  styleUrl: './logs-table.component.scss',
})
export class LogsTableComponent implements OnInit {
  ELEMENT_DATA: logs[] = [];
  searchValue: InputSignal<string> = input('');
  constructor(private dataUploadService: DataUploadService) {
    effect(() => {
      if (this.searchValue()) {
        this.ELEMENT_DATA = this.ELEMENT_DATA.filter((history) =>
          history.originalFileName
            .toLowerCase()
            .includes(this.searchValue().toLowerCase())
        );
      }
    });
  }

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
  dataSource: any;
  // ngAfterViewInit() {}
  ngOnInit(): void {
    this.getLogsHistory();
  }
  getLogsHistory() {
    this.dataUploadService.getLogHistory().subscribe({
      next: (result) => {
        this.ELEMENT_DATA = result;
        console.log(this.ELEMENT_DATA, 'dataupload');

        this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
      },
    });
  }
}
