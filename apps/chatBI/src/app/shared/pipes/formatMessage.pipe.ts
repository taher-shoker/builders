import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMessage',
})
export class FormatMessagePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    value = value.replace(/(?:<\/?)?think>/gi, '');

    value = value.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    value = value.replace(/\n/g, '<br>');
    // value = value.replace(/\n/g, '<br>');

    return value;
  }
}
