import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArray',
  standalone : false
})
export class FilterArrayPipe implements PipeTransform {
  transform(items: any[], filterStr: string): any[] {
    if (!items || !filterStr) {
      return items;
    }

    const searchFilter = filterStr.toLowerCase().trim();

    return items.filter((item) => {
      return Object.values(item).some((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchFilter);
        }
        return false;
      });
    });
  }
}
