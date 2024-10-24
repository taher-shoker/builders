/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export interface PaginationConfig {
  pageCount: number;
  showTotal?: boolean;
}

export interface PaginationEvent {
  currentPage: number;
  lastPage: boolean;
  firstPage: boolean;
}

@Component({
  selector: 'stc-apps-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Output() paginationEvent: EventEmitter<PaginationEvent> =
    new EventEmitter<PaginationEvent>();
  @Output() pageSize: EventEmitter<number> = new EventEmitter<number>();
  @Input({ required: true }) pageRows!: number;
  @Input({ required: true }) elementsLength!: number;
  @Input() showTotal: boolean = false;
  @Input() showPagePerItems: boolean = false;
  @Input() pagesCountLimit: number = 5;
  @Input() numbers: { name: string; id: string }[] = [];
  pagesCount!: number;
  pagesLimitExceeded: boolean = false;
  remainingPagesShown: boolean = false;

  @Input() activePage: number = 1;
  onLastPage: boolean = false;
  onFirstPage: boolean = true;
  goLastPageBtn: boolean = false;
  goFirstPageBtn: boolean = false;
  pageItemsSelect!: FormGroup;
  ngOnInit(): void {
    this.setPagesCount();
    this.pageItemsSelect = new FormGroup({
      pageSize: new FormControl(this.pageRows.toString()),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elementsLength']) {
      this.elementsLength = changes['elementsLength'].currentValue;
      this.setPagesCount();
      this.activePage = 1;
      this.validate();
    }
  }

  setPagesCount() {
    this.pagesCount = Math.ceil(this.elementsLength / this.pageRows);
    if (this.pagesCount > this.pagesCountLimit) {
      this.pagesLimitExceeded = true;
    } else {
      this.pagesLimitExceeded = false;
    }
  }
  handleSelectSize(value: string) {
    this.pageRows = +value;
    this.setPagesCount();
    this.pageSize.emit(+value);
  }

  goPageByNumber(num: number) {
    this.activePage = num;
    this.validate();
  }

  public goNextPage(): void {
    this.goPageByNumber((this.activePage += 1));
  }

  public goPreviousPage(): void {
    this.goPageByNumber((this.activePage -= 1));
  }

  public goLastPage(): void {
    this.goPageByNumber((this.activePage = this.pageRows));
  }

  public goFirstPage(): void {
    this.goPageByNumber((this.activePage = 1));
  }

  private validate(): void {
    if (this.pagesCount === this.activePage) {
      this.onLastPage = true;
    } else {
      this.onLastPage = false;
    }

    if (this.activePage === 1) {
      this.onFirstPage = true;
    } else {
      this.onFirstPage = false;
    }

    this.paginationEvent.emit({
      currentPage: this.activePage,
      firstPage: this.onFirstPage,
      lastPage: this.onLastPage,
    });
  }

  protected toggleRemainingPages() {
    this.remainingPagesShown = !this.remainingPagesShown;
  }
}
