/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @angular-eslint/directive-selector */
import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appSortableTable]',
  standalone : false
})
export class SortableTableDirective {
  @Input() appSortableTable:any;
  @Output() sorted = new EventEmitter<any[]>();

  private currentSortKey: string = '';
  private isAscOrder: boolean = true;

  @HostListener('click', ['$event.target'])
  onClick(th: any) {
      
      if (th.tagName === 'TH') {
      const sortKey = th.getAttribute('data-sort-key');

      if (sortKey) {
        this.sort(sortKey);
        console.log('Sorting table by ');
      }
    }
  }

  private sort(sortKey: string): void {
    if (sortKey === this.currentSortKey) {
      this.isAscOrder = !this.isAscOrder;
    } else {
      this.currentSortKey = sortKey;
      this.isAscOrder = true;
    }

    const sortedData = this.appSortableTable.sort((a: any, b: any) => {
      const valueA = a[this.currentSortKey];
      const valueB = b[this.currentSortKey];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.isAscOrder ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        return this.isAscOrder ? valueA - valueB : valueB - valueA;
      }
    });

    this.sorted.emit(sortedData);
  }
}
