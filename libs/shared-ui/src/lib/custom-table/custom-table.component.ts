/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

export interface ActionEventData {
  row: any;
  actionType: string;
}
export interface ColumnsSchema {
  key: string;
  type: 'text' | 'date' | 'actions';
  label: string;
  dateString?: 'longDate';
  actions?: ('edit' | 'delete')[];
}

// enum CaseStatus {
//   registered = <any>'Registered',
//   pending = <any>'Pending',
//   inprogress = <any>'In Progress',
//   closed = <any>'Closed',
// }

@Component({
  selector: 'stc-apps-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements OnInit, OnChanges {
  @Output() pageIndexChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() doAction: EventEmitter<{ value: string; dataRow: any }> =
    new EventEmitter<{ value: string; dataRow: any }>();

  @Input({ required: true }) data: any;

  @Input({ required: true }) columnsSchema!: ColumnsSchema[];
  @Input() pagesFetchedIndexes: number[] = [0];
  @Input() detailsRoute?: string;

  dataSource!: MatTableDataSource<any>;
  isLoading = true;

  displayedColumns!: string[];

  // readonly caseStatus = CaseStatus;

  casesPagesCount: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.data = changes['data'].currentValue;
      this.dataSource = new MatTableDataSource<any>(this.data);
      this.dataSource.sort = this.sort;

      this.dataSource.paginator = this.paginator;

      if (this.paginator) {
        this.paginator.page.subscribe((pageRes) => {
          if (!this.pagesFetchedIndexes.includes(pageRes.pageIndex)) {
            this.pagesFetchedIndexes.push(pageRes.pageIndex);
            this.pageIndexChange.emit(pageRes.pageIndex);
          }
        });
      }
    }
  }

  ngOnInit(): void {
    this.displayedColumns = this.columnsSchema.map((col) => col.key);
  }

  raiseAction(value: string, dataRow: any) {
    this.doAction.emit({ value, dataRow });
  }

  detailsNavigate(id: string | number) {
    this.router.navigate([`./${this.detailsRoute}`, id], { relativeTo: this.route });
  }
}
