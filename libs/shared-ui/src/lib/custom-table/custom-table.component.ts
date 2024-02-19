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

export interface ColumnsSchema {
  key: string;
  type: 'text' | 'date' | 'actions';
  label: string;
  dateString?: 'longDate';
  actions?: ('edit' | 'delete' | 'details')[];
}

@Component({
  selector: 'stc-apps-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  @Output() pageIndexChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() doAction: EventEmitter<{ value: string; dataRow: any }> =
    new EventEmitter<{ value: string; dataRow: any }>();

  @Input({ required: true }) data: any;

  @Input({ required: true }) columnsSchema!: ColumnsSchema[];
  @Input() pagesFetchedIndexes: number[] = [0];
  @Input() pagesCount!: number;
  @Input() detailsRoute?: string;

  dataSource!: MatTableDataSource<any>;

  displayedColumns!: string[];

  isLoading = true;
  page = 1;
  pageSize = 10;
  totalCount = 0;



  // pagesCountSet: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  paginatorAndSortSet: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);

    if (changes['data']) {
      this.data = changes['data'].currentValue;
      this.dataSource = new MatTableDataSource<any>(this.data);

      if (!this.paginatorAndSortSet) {
        this.setPaginatorAndSortOnce(changes['pagesCount'].currentValue);
      }
    }
  }

  ngOnInit(): void {
    this.displayedColumns = this.columnsSchema.map((col) => col.key);
  }

  
  setPaginatorAndSortOnce(changesPagesCounts: number) {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    setTimeout(() => {
      this.pagesCount = changesPagesCounts;
    }, 1000);

    if (this.paginator) {
      this.paginator.page.subscribe((pageRes) => {
        console.log('Page flipped to num:', pageRes);
        if (!this.pagesFetchedIndexes.includes(pageRes.pageIndex)) {
          this.pagesFetchedIndexes.push(pageRes.pageIndex);
          this.pageIndexChange.emit(pageRes.pageIndex);
        }
      });
      this.paginatorAndSortSet = true;
    }
  }

  
  raiseAction(value: string, dataRow: any) {
    this.doAction.emit({ value, dataRow });
  }

  detailsNavigate(id: string | number) {
    this.router.navigate([`./${this.detailsRoute}`, id], {
      relativeTo: this.route,
    });
  }
}
