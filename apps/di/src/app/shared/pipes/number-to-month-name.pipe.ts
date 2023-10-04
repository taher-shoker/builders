/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToMonthName',
  standalone: true,
})
export class NumberToMonthNamePipe implements PipeTransform {
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  monthNamesShort = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  transform(date: string, short: boolean = false): string {
    const d = new Date(date);
    if (short) {
      return this.monthNamesShort[d.getMonth()];
    } else {
      return this.monthNames[d.getMonth()];
    }
  }
}
