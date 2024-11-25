import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Pipe({
  name: 'newLine',
  standalone : false
})
export class NewLinePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: string): SafeHtml {
    if (!value) return value;
    const formattedText = value.replace(/\n/g, '<br/>');
    return formattedText;
  }
}