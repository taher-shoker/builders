/* eslint-disable for-direction */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  inject,
  input,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PaginationEvent } from '../paginator/paginator.component';
import { CustomTemplateDirective } from './custom-template.directive';
import { DatePipe } from '@angular/common';

export interface ColumnsSchema {
  key: string;
  type: 'text' | 'date' | 'actions' | 'custom';
  label: string;
  dateString?: 'longDate';
  actions?: ('edit' | 'delete' | 'details' | 'updateProgress')[];
  complexViewTemp?: any;
}

export interface PaginationConfig {
  paginationIq?: 'dumb' | 'smart';
  pageCount: number;
  showTotal?: boolean;
  pageSizesOptionals: { name: string; id: string }[];
  showPagePerItems?: boolean;
  currentPage: number;
}

@Component({
  selector: 'stc-apps-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
  standalone : false
})
export class CustomTableComponent implements OnChanges, OnInit, OnDestroy {
  @Output() paginationEvent: EventEmitter<PaginationEvent> =
    new EventEmitter<PaginationEvent>();
  @Output() sortration: EventEmitter<{ colName: string; sortType: string }> =
    new EventEmitter<{ colName: string; sortType: string }>();

  @Output() pageSizeEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteAddedRecord: EventEmitter<any> = new EventEmitter<any>();
  @Output() addRecord: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() doAction: EventEmitter<{ value: string; dataRow: any }> =
    new EventEmitter<{ value: string; dataRow: any }>();
  @Output() updatedData: EventEmitter<any> = new EventEmitter<any>();

  headers = input.required<ColumnsSchema[]>();
  psrTable = input<boolean>();
  activityTable = input<boolean>();
  fontFamily = input<string>();

  @Input({ required: true }) items!: any[];
  itemsInView!: any[]; // in case of pagination, this defines what is shown in the browser in the table.
  datePipe = inject(DatePipe);
  @Input() applyFilter: boolean = false;
  @Input() filter: string = '';
  @Input() filterForm: object = {};
  @Input() paginate: boolean = false;
  @Input() paginationConfig!: PaginationConfig;
  @Input() sort: boolean = true;
  @Input() length!: number;
  @Input() currentPage: number = 1;

  isEditMode = input<boolean>();
  userRoles = input<string>();
  paginator$: Subject<PaginationEvent> = new Subject<PaginationEvent>();
  showOptionSizePage: boolean = false;

  loadedPages: undefined | number[]; // should be defined in case of 'smart' paginationIq.
  itemsMap = new Map<string, any[]>(); // should be used and set in case of 'smart' paginationIq.

  filterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  filterStrStored: string = '';
  currentSortedByColumn$: Subject<string> = new Subject<string>();
  deleteRecord(item: any) {
    this.deleteAddedRecord.emit(item);
  }
  parseDate(dateString: Date | string) {
    if (typeof dateString !== 'string') {
      // const date:string = this.datePipe.transform(dateString, 'yyyy/MM/dd') ?? ""
      // const [day, month, year] = date.split('/');
      return new Date(dateString);
      // return date;
    } else {
      const [day, month, year] = dateString.split('/');
      return new Date(+year, +month - 1, +day);
    }
  }
  sortingDirection: 'desc' | 'asc' = 'asc';
  changeCurrentSortingColumn(colName: string): void {
    this.currentSortedByColumn$.next(colName);
  }
  addNewRecord() {
    this.addRecord.emit(true);
  }
  setupSorting() {
    this.currentSortedByColumn$.subscribe((res: string) => {
      this.sortByColumn(this.itemsInView, res);
    });
  }

  sortByColumn(list: any[] | undefined, column: string): void {
    this.sortingDirection === 'asc'
      ? (this.sortingDirection = 'desc')
      : (this.sortingDirection = 'asc');
    this.sortration.emit({ colName: column, sortType: this.sortingDirection });
  }

  @ContentChildren(CustomTemplateDirective)
  customTemplates!: QueryList<CustomTemplateDirective>;

  templateMap: Record<string, TemplateRef<any>> = {};

  getCustomTemplate(header: string, context: any): TemplateRef<any> {
    return this.templateMap[header] || null;
  }

  setupFiltration() {
    this.filterSubject.subscribe((res) => {
      this.filterStrStored = res;
    });
  }

  ngOnInit(): void {
    if (this.paginationConfig) {
      if (this.paginate && this.paginationConfig.paginationIq !== 'smart') {
        this.setupDumbPaginator();
      }
      if (this.paginate && this.paginationConfig.paginationIq === 'smart') {
        this.setupSmartPagination();
        this.showOptionSizePage = true;
      }
    }
    if (this.sort) {
      this.setupSorting();
    }
    if (this.applyFilter) {
      this.setupFiltration();
    }
  }

  setupSmartPagination() {
    this.loadedPages = [1]; // *in case of smart pagination, start tracking the pages with page number 1 on init already,
    this.itemsMap.set('1', this.items); // *and assign the first set/chunk of items to first element.

    this.paginator$.subscribe((res) => {
      this.currentPage = res.currentPage;

      if (!this.loadedPages?.includes(this.currentPage)) {
        this.handleSmartPageAddition(this.currentPage);
        this.paginationEvent.emit(res);
      } else {
        this.onDataChange();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paginationConfig']) {
      if (
        changes['paginationConfig'].currentValue?.pageCount !==
        changes['paginationConfig'].previousValue?.pageCount
      ) {
        this.loadedPages = [1];
        this.itemsMap.clear();
      }
    }
    if (changes['filterForm']) {
      if (
        changes['filterForm'].currentValue !=
        changes['filterForm'].previousValue
      ) {
        this.loadedPages = [1];
        this.itemsMap.clear();
      }
    }
    if (changes['items']) {
      this.items = changes['items'].currentValue;
      if (this.paginationConfig) {
        if (this.paginationConfig.paginationIq === 'smart') {
          this.currentPage = this.paginationConfig.currentPage;
          this.onDataChange(this.items);
        }
      }
    }

    if (changes['length']) {
      this.length = changes['length'].currentValue;
    }

    if (changes['filter']) {
      this.filterSubject.next(changes['filter'].currentValue);
    }
  }

  handleSmartPageAddition(newPageNum: number) {
    if (this.loadedPages) {
      for (let i = this.loadedPages.length - 1; i >= 0; i--) {
        if (newPageNum > this.loadedPages[i]) {
          // *this is to add the number in the right order, important for pagination harmony!
          this.loadedPages.splice(i + 1, 0, newPageNum);
          return;
        }
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
  setPageSize(size: number) {
    this.pageSizeEvent.emit(size);
  }

  ngOnDestroy(): void {
    this.paginator$.unsubscribe();
  }

  raiseAction(value: string, dataRow: any) {
    this.doAction.emit({ value, dataRow });
  }

  onDataChange(items?: any[]) {
    if (items) {
      this.setItemsMap(items);
    }
    this.itemsInView = this.itemsMap.get(this.currentPage.toString())!;
  }

  setItemsMap(items: any[]) {
    this.itemsMap.set(this.currentPage.toString(), items);
  }
  inputChanged(id: number) {
    this.updatedData.emit({ items: this.items, id: id });
  }
  keyPress(e: KeyboardEvent) {
    if (e.key === 'e') {
      e.preventDefault();
    }
  }
  keyPress2(e: KeyboardEvent) {
    if (e.key === 'e') {
      e.preventDefault();
    } else {
      if (e.target) {
        const val = e.target as HTMLInputElement;
        const val2 = val.value;
        const val3 = val2 + e.key;
        if (+val3 > 100) {
          e.preventDefault();
        }
      }
    }
  }
}
