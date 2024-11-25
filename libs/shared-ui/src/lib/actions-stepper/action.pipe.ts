import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayCaption',
  standalone : false
})
export class DisplayCaptionPipe implements PipeTransform {
  transform(value: { uniqueTitle: string, displayCaption: string } | string): string {
    // Check if the value is an object with a displayCaption property
    if (typeof value === 'object' && value !== null && 'displayCaption' in value) {
      return (value as { uniqueTitle: string, displayCaption: string }).displayCaption;
    } else {
      // If not, return the value as it is
      return String(value);
    }
  }
}
