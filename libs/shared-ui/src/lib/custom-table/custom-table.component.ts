/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
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
  paginationIq?: 'dumb' | 'smart';
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

  loadedPages: undefined | number[]; // should be defined in case of 'smart' paginationIq.
  itemsMap = new Map<string, any[]>();// should be used and set in case of 'smart' paginationIq.

  ngOnInit(): void {
    if (this.paginate && this.paginationConfig.paginationIq !== 'smart') {
      this.setupDumbPaginator();
    }
    if (this.paginate && this.paginationConfig.paginationIq === 'smart') {
      this.setupSmartPagination();
    }
  }

  setupSmartPagination() {
    this.loadedPages = [1]; // *in case of smart pagination, start tracking the pages with page number 1 on init already,
    this.itemsMap.set('1', this.items); //= [{1: this.items}] // * and assign the first set/chunk of items to first element.

    this.paginator$.subscribe((res) => {
      this.currentPage = res.currentPage;

      if (!this.loadedPages?.includes(this.currentPage)) {
        this.handleSmartPageAddition(this.currentPage);
        this.paginationEvent.emit(res);
      } else {
        this.onDataChange(true);
      }
    });
  }

  handleSmartPageAddition(newPageNum: number) {
    if (this.loadedPages) {
      for (let i = 0; i < this.loadedPages.length; i++) {
        if (newPageNum > this.loadedPages[i]) {
          // *this is to add the number in the right order, important for pagination harmony!
          this.loadedPages.splice(i + 1, 0, newPageNum);
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.items = changes['items'].currentValue;
      console.warn(this.items);

      if (this.paginationConfig.paginationIq === 'smart') {
        this.onDataChange();
      }
    }
  }

  setupDumbPaginator() {
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

  onDataChange(smartPath: boolean = false) {
    if (this.items) {
      if (!smartPath) {
        if (!this.loadedPages?.includes(this.currentPage)) {
          this.setItemsMap();
        }
      } else {
        this.setItemsMap();
      }

      if (this.itemsMap.get(this.currentPage.toString())) {
        this.itemsInView = this.itemsMap.get(this.currentPage.toString())!;
      }
      console.warn('in sub', this.items);
    }
  }

  setItemsMap() {
    const startIndex = (this.currentPage - 1) * this.paginationConfig.pageCount;
    const endIndex = startIndex + this.paginationConfig.pageCount;
    this.itemsMap.set(
      this.currentPage.toString(),
      this.items.slice(startIndex, endIndex)
    ); // = this.items.slice(startIndex, endIndex); // Update data based on page
  }
}
