/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abs',
  standalone: true,
})
export class AbsPipe implements PipeTransform {

  transform(num: number): number {
    return Math.abs(num);
  }
}
