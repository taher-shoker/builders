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
import { BehaviorSubject, Subject, take } from 'rxjs';
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
export class CustomTableComponent implements OnChanges, OnInit, OnDestroy {
  @Output() paginationEvent: EventEmitter<PaginationEvent> =
    new EventEmitter<PaginationEvent>();
  @Output() doAction: EventEmitter<{ value: string; dataRow: any }> =
    new EventEmitter<{ value: string; dataRow: any }>();

  @Input({ required: true }) headers!: ColumnsSchema[];

  @Input({ required: true }) items!: any[];
  @Input() itemsInView!: any[]; // in case of pagination, this defines what is shown in the browser in the table.

  @Input() paginate: boolean = false;
  @Input() paginationConfig!: PaginationConfig;

  paginator$: Subject<PaginationEvent> = new Subject<PaginationEvent>();
  currentPage: number = 1;

  ngOnInit(): void {
    if (this.paginate) {
      this.setupPaginator();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.items = changes['items'].currentValue;
      console.warn(this.items);

      this.onDataChange();
    }
  }

  setupPaginator() {
    this.paginator$.subscribe((res) => {
      this.currentPage = res.currentPage;
      this.paginationEvent.emit(res);
    });
  }

  raisePagination(event: PaginationEvent) {
    this.paginator$.next(event);
  }

  ngOnDestroy(): void {
    this.paginator$.unsubscribe();
  }

  raiseAction(value: string, dataRow: any) {
    this.doAction.emit({ value, dataRow });
  }

  onDataChange() {
    if (this.items) {
      const startIndex =
        (this.currentPage - 1) * this.paginationConfig.pageCount;
      const endIndex = startIndex + this.paginationConfig.pageCount;
      this.items = this.items.slice(startIndex, endIndex); // Update data based on page
      console.warn('in sub', this.items);
    }
  }
}
