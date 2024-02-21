/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { PaginationEvent } from '../paginator/paginator.component';

export interface ColumnsSchema {
  key: string;
  type: 'text' | 'date' | 'actions';
  label: string;
  dateString?: 'longDate';
  actions?: ('edit' | 'delete' | 'details')[];
  useCustomTemplate?: (header?: ColumnsSchema, item?: any) => any;
}

export interface PaginationConfig {
  pageCount: number;
  showTotal?: boolean;
}



@Component({
  selector: 'stc-apps-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements OnChanges,OnInit , OnDestroy{
  // headers: { value: string; displayName: string; [key: string]: string }[] = [
  //   { value: 'milestoneName', displayName: 'Milestone Name' },
  //   { value: 'activiyName', displayName: 'Activiy Name' },
  //   { value: 'status', displayName: 'Status' },
  // ];

  @Output() paginationEvent: EventEmitter<PaginationEvent> = new EventEmitter<PaginationEvent>();

  @Input({ required: true }) headers!: ColumnsSchema[];

  @Input({ required: true }) items!: any[];
  @Input() paginate: boolean = false;
  @Input() paginationConfig!: PaginationConfig;

  paginator$: Subject<PaginationEvent> = new Subject<PaginationEvent>();

  // = [
  //   { milestoneName: 'First milestone', status: 'complete', activiyName: 'build' },
  //   { milestoneName: 'second one', status: 'working', activiyName: 'test' },
  //   { milestoneName: 'the last', status: 'failed', activiyName: 'deploy' },
  // ];

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  // @Output() pageIndexChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() doAction: EventEmitter<{ value: string; dataRow: any }> =
    new EventEmitter<{ value: string; dataRow: any }>();

  ngOnInit(): void {

    if (this.paginate) {
      this.setupPaginator();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']){
      this.items = changes['items'].currentValue;
      console.warn(this.items)
      this.onDataChange();
    }
  }

  setupPaginator() {
    this.paginator$.subscribe(res => {
      this.paginationEvent.emit(res)
    })
  }

  raisePagination(event: PaginationEvent){
    this.paginator$.next(event)
  }

  ngOnDestroy(): void {
    this.paginator$.unsubscribe();
  }

  // getCustomTemplateHtml(header: ColumnsSchema, item: any): string {
  //   if(header.useCustomTemplate){
  //     console.warn("both", header, item)
  //     return header.useCustomTemplate()
  //       .replace(/\{\{([^\}]+)\}\}/g, (match: any, prop: any) => item[prop]);
  //   }else{
  //     return ``
  //   }
  // }
  // @Input({ required: true }) data: any;

  // @Input({ required: true }) columnsSchema!: ColumnsSchema[];
  // @Input() pagesFetchedIndexes: number[] = [0];
  // @Input() pagesCount!: number;
  // @Input() detailsRoute?: string;
  // @Input() pageChanged?: number;

  // dataSource!: MatTableDataSource<any>;
  // isLoading = true;

  // displayedColumns!: string[];

  // currentPage: number = 1;

  // pagesCountSet: boolean = false;

  // paginatorAndSortSet: boolean = false;

  // setPaginatorAndSortOnce(changesPagesCounts: number) {
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;

  //   setTimeout(() => {
  //     this.pagesCount = changesPagesCounts;
  //   }, 1000);

  //   if (this.paginator) {
  //     this.paginator.page.subscribe((pageRes) => {
  //       console.log('Page flipped to num:', pageRes);
  //       this.currentPage = pageRes.pageIndex;
  //       if (!this.pagesFetchedIndexes.includes(pageRes.pageIndex)) {
  //         this.pagesFetchedIndexes.push(pageRes.pageIndex);
  //         this.pageIndexChange.emit(pageRes.pageIndex);
  //       }
  //     });
  //     this.paginatorAndSortSet = true;
  //   }
  // }

  // dataInitialized: boolean = false;
  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('changes', changes);

  //   if (changes['data']) {
  //     this.data = changes['data'].currentValue;
  //     this.dataSource = new MatTableDataSource<any>(this.data);

  //     // if(this.dataInitialized){
  //     //   this.onPageChange();
  //     // }
  //     // this.dataInitialized = true;

  //     if (!this.paginatorAndSortSet) {
  //       this.setPaginatorAndSortOnce(changes['pagesCount'].currentValue);
  //     }
  //   }

  //   // if(changes['pageChanged']){
  //   //   this.onPageChange();
  //   // }
  // }

  // ngOnInit(): void {
  //   this.displayedColumns = this.columnsSchema.map((col) => col.key);
  // }

  raiseAction(value: string, dataRow: any) {
    this.doAction.emit({ value, dataRow });
  }

  onDataChange() {
    if (this.items) {
      this.paginator$.subscribe(pagiEvent => {
        const startIndex = (pagiEvent.currentPage - 1) * this.paginationConfig.pageCount;
        const endIndex = startIndex + this.paginationConfig.pageCount;
        this.items = this.items.slice(startIndex, endIndex); // Update data based on page
      })
    }
  }
}
