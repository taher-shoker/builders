import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mentionHighlight'
})
export class MentionHighlightPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Regular expression to match @mentions
    const mentionRegex = /@(\w+)/g;
    
    return value.replace(mentionRegex, '<span style="color:red" class="mention-highlight">$&</span>');
  }
}