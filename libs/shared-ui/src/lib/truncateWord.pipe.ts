import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateWord',
  standalone: false,
})
export class TruncateWordPipe implements PipeTransform {
  transform(value: string, limit = 20): string {
    if (!value) {
      return '';
    }

    const words = value.split(' ');
    return (
      words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '')
    );
  }
}
