// import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
const toOptionalFixed = (num:number, digits:number) =>
  `${Number.parseFloat(num.toFixed(digits))}`;
@Pipe({
  name: 'million',
  standalone: false,
})
export class MillionPipe implements PipeTransform {
  transform(value:number) {
    if(value > 0)
    {
      if (value >= 1000000000) {
        return toOptionalFixed((value / 1000000000) , 2) + ' B';
      } else if (value >= 1000000) {
        return toOptionalFixed((value / 1000000) , 2) + ' M';
      } else if (value >= 1000) {
        return toOptionalFixed((value / 1000) , 2) + ' k';
      } else {
        return value.toString();
      }
    } else {
      return 0
    }
  }
}
