import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sqlHighlight',
})
export class SqlHighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: string): SafeHtml {
    if (!value) return '';

    const keywords = [
      'SELECT',
      'FROM',
      'WHERE',
      'AND',
      'OR',
      'AS',
      'BETWEEN',
      'GROUP BY',
      'ORDER BY',
      'INNER JOIN',
      'LEFT JOIN',
      'RIGHT JOIN',
      'ON',
      'IN',
      'NOT',
      'IS',
      'NULL',
      'LIKE',
      'DISTINCT',
      'LIMIT',
    ];
    const functions = ['lower', 'upper'];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    const functionRegex = new RegExp(`\\b(${functions.join('|')})\\b`, 'gi');
    let highlighted = value.replace(keywordRegex, (match) => {
      return `<span class="sql-keyword">${match.toUpperCase()}</span>`;
    });
    highlighted = highlighted.replace(functionRegex, (match) => {
      return `<span class="sql-function">${match.toLowerCase()}</span>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
