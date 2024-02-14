/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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

enum CaseStatus {
  registered = <any>'Registered',
  pending = <any>'Pending',
  inprogress = <any>'In Progress',
  closed = <any>'Closed',
}

@Component({
  selector: 'stc-apps-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements OnInit, AfterViewInit {
  @Output() pageIndexChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() doAction: EventEmitter<ActionEventData> =
    new EventEmitter<ActionEventData>();

  @Input({ required: true }) dataSource: MatTableDataSource<any> =
    new MatTableDataSource<any>();
  @Input({ required: true }) columnsSchema!: ColumnsSchema[];
  @Input() pagesFetchedIndexes: number[] = [0];

  isLoading = true;

  displayedColumns!: string[];

  readonly caseStatus = CaseStatus;

  casesPagesCount: number = 0;
  // @ViewChild(MatSort)
  // sort!: MatSort;
  // @ViewChild(MatPaginator, { static: true })
  // paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true })
  set sort(value: MatSort) {
    if (value) this.dataSource.sort = value;
  }

  @ViewChild(MatPaginator, { static: true })
  set paginator(value: MatPaginator) {
    if (value) {
      this.dataSource.paginator = value;
    }
  }

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.displayedColumns = this.columnsSchema.map((col) => col.key);
    // this.dataSource.paginator = this.paginator;
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngAfterViewInit() {
    //this.dataSource.sort = this.sort;
    // this.paginator.page.subscribe((pageRes) => {
    //   if (!this.pagesFetchedIndexes.includes(pageRes.pageIndex)) {
    //     this.pagesFetchedIndexes.push(pageRes.pageIndex);
    //     this.pageIndexChange.emit(pageRes.pageIndex);
    //   }
    // });
  }

  getKeyByValue(obj: any, status: string) {
    return Object.keys(obj)[Object.values(obj).indexOf(status)];
  }

  raiseAction(row: any, actionType: string) {
    const data = { row, actionType };
    this.doAction.emit(data);
  }

  detailsNavigate(id: string | number) {
    this.router.navigate(['./case_details', id], { relativeTo: this.route }); //TODO: Make it dynamic or globalize the details page among all apps to one known url string.
  }
}
