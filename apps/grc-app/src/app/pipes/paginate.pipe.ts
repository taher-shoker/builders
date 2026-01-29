import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'paginate',
  pure: true,
})
export class PaginatePipe implements PipeTransform {
  transform<T>(
    items: T[] | null | undefined,
    first: number,
    rows: number
  ): T[] {
    if (!items || items.length === 0) {
      return [];
    }

    return items.slice(first, first + rows);
  }
}
