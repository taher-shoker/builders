import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'jsonParse',
})
export class JsonParsePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: any): SafeHtml {
    if (!value) return '';

    let meta = `<span style='display=block;'>Matching Table:</span><span style='display=block;background: #f9f9f9;padding: 10px;border-radius: 8px;'>${value.tableName}</span>`;
    meta += `<span style='display=block;'>Matching Columns:</span><span style='display=block;background: #f9f9f9;padding: 10px;border-radius: 8px;'>`;
    value.columnContent.split(',').forEach((column: string) => {
      meta += `${column}<br>`;
    });
    meta += `</span>`;

    return this.sanitizer.bypassSecurityTrustHtml(meta);
  }
}
