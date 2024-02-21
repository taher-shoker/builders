/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
export class PaginatorComponent implements OnInit {
  @Output() paginationEvent: EventEmitter<PaginationEvent> =
    new EventEmitter<PaginationEvent>();

  @Input({ required: true }) pageRows!: number; // how many elements in one page should be.
  @Input({ required: true }) elementsLength!: number; // how many elements in one page should be.
  @Input() showTotal: boolean = false;

  pagesCount!: number;

  activePage: number = 1;
  onLastPage: boolean = false;
  onFirstPage: boolean = true;
  goLastPageBtn: boolean = false;
  goFirstPageBtn: boolean = false;

  ngOnInit(): void {
    this.setPagesCount();
  }

  setPagesCount() {
    this.pagesCount = Math.ceil(this.elementsLength / this.pageRows);
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
}
