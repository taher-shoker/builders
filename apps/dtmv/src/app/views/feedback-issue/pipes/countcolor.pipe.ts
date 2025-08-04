import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'countColor' })
export class CountColorPipe implements PipeTransform {
  transform(title: string): string {
    switch (title?.toLowerCase()) {
      case 'feedback':
        return 'green';
      case 'issues':
        return 'red';
      default:
        return 'blue';
    }
  }
}
