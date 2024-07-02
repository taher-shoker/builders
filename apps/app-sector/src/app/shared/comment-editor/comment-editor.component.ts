import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  InputSignal,
  Output,
  ViewChild,
  forwardRef,
  input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
} from 'rxjs';
import { mentionRegexService } from '../services/mentionRegex.service';

@Component({
  selector: 'stc-apps-comment-editor',
  templateUrl: './comment-editor.component.html',
  styleUrls: ['./comment-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommentEditorComponent),
      multi: true,
    },
  ],
})
export class CommentEditorComponent implements AfterViewInit {
  @ViewChild('contentEditable') contentEditable!: ElementRef<HTMLDivElement>;
  @ViewChild('mentionList') mentionList!: ElementRef<HTMLUListElement>;

  placeholder: InputSignal<string> = input('');
  title: InputSignal<string> = input('');
  mentionProperty: InputSignal<string> = input('name');
  editedText: InputSignal<string> = input('');
  mentions: InputSignal<any> = input([]);
  @Output() contentChange = new EventEmitter<string>();
  content = '';
  showDropdown = false;
  filteredList: any[] = [];
  value: string | undefined;
  activeMentionIndex = -1;
  mentions2 = ['Naden Draz', 'Habiba'];
  constructor(private mentionsService: mentionRegexService) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.setupMentionListener();
  }
  writeValue(value: string): void {
    this.content = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLDivElement;
    this.content = input.textContent || '';
    this.onChange(this.content);
    this.contentChange.emit(this.content);
  }

  onKeyUp(event: KeyboardEvent): void {
    const input = this.contentEditable.nativeElement;
    const cursorPosition = this.getCaretPosition(input);
    const textBeforeCursor = input.textContent!.slice(0, cursorPosition);
    const mentionIndex = textBeforeCursor.lastIndexOf('@');
    console.log('mentionIndex', mentionIndex, this.mentionProperty());
    if (mentionIndex > -1) {
      const query = textBeforeCursor.slice(mentionIndex + 1).toLowerCase();
      this.filteredList = this.mentions().filter((mention: any) =>
        mention[this.mentionProperty()].toLowerCase().includes(query)
      );
      if (this.filteredList.length > 0) {
        if (!this.showDropdown) {
          this.activeMentionIndex = 0;
          this.showDropdown = true;
        }
      } else {
        this.activeMentionIndex = -1;
        this.showDropdown = false;
      }
    }

    if (this.showDropdown) {
      switch (event.key) {
        case 'ArrowUp':
          if (this.activeMentionIndex > 0) {
            this.activeMentionIndex--;
          } else {
            this.activeMentionIndex = this.filteredList.length - 1;
          }
          this.scrollToActiveMention();
          event.preventDefault();
          break;
        case 'ArrowDown':
          if (this.activeMentionIndex < this.filteredList.length - 1) {
            this.activeMentionIndex++;
          } else {
            this.activeMentionIndex = 0;
          }
          this.scrollToActiveMention();
          event.preventDefault();
          break;

        case 'Enter': {
          if (this.activeMentionIndex > -1) {
            this.addMention(
              this.filteredList[this.activeMentionIndex][this.mentionProperty()]
            );
            this.showDropdown = false;
            event.preventDefault();
          }
          break;
        }
      }
    }
  }

  scrollToActiveMention(): void {
    const mentionListElement = this.mentionList.nativeElement;
    const activeMentionElement = mentionListElement.children[
      this.activeMentionIndex
    ] as HTMLElement;

    if (activeMentionElement) {
      const mentionListRect = mentionListElement.getBoundingClientRect();
      const activeMentionRect = activeMentionElement.getBoundingClientRect();

      if (activeMentionRect.top < mentionListRect.top) {
        mentionListElement.scrollTop -=
          mentionListRect.top - activeMentionRect.top;
      } else if (activeMentionRect.bottom > mentionListRect.bottom) {
        mentionListElement.scrollTop +=
          activeMentionRect.bottom - mentionListRect.bottom;
      }
    }
  }

  addMention(mention: string): void {
    const input = this.contentEditable.nativeElement;
    const value = input.textContent || '';
    const mentionIndex = value.lastIndexOf('@');
    const textBeforeMention = value.slice(0, mentionIndex);
    const textAfterMention = value
      .slice(mentionIndex + 1)
      .replace(/\s*\S*/, '');
    const newText = `${textBeforeMention}<span class="mention">@${mention}</span> ${textAfterMention}`;

    input.innerHTML = this.highlightMentions(newText);
    this.content = input.textContent || '';

    if (input.textContent !== null && input.textContent !== undefined) {
      // Set the caret position at the end of the contenteditable div
      this.setCaretPosition(input, input.textContent.length);
    }
    input.focus();

    this.showDropdown = false;
    this.onChange(this.content);
    this.contentChange.emit(this.content);
  }

  setupMentionListener(): void {
    const input = this.contentEditable.nativeElement;
    fromEvent(input, 'input')
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map(() => {
          const mentionIndex = this.content.lastIndexOf('@');
          return mentionIndex > -1
            ? this.content.slice(mentionIndex + 1).toLowerCase()
            : null;
        }),
        filter((query) => query !== null)
      )
      .subscribe((query) => {
        this.filteredList = this.mentions().filter((mention: any) =>
          mention[this.mentionProperty()].toLowerCase().includes(query!)
        );
      });
  }

  highlightMentions(text: string): string {
    let highlightedText = text;
    this.mentions().forEach((mention: any) => {
      const mentionPattern = new RegExp(
        `(@${mention[this.mentionProperty()]})(\\s|$)`,
        'gi'
      );
      highlightedText = highlightedText.replace(
        mentionPattern,
        '<span class="mention">$1</span>$2'
      );
    });
    return highlightedText;
  }

  getCaretPosition(element: HTMLElement): number {
    let caretOffset = 0;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
  }

  setCaretPosition(element: HTMLElement, position: number): void {
    const selection = window.getSelection();
    const range = document.createRange();
    let offset = position;
    const childNodesArray = Array.from(element.childNodes);

    for (const node of childNodesArray) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (offset <= node.textContent!.length) {
          range.setStart(node, offset);
          break;
        } else {
          offset -= node.textContent!.length;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (offset <= node.textContent!.length) {
          range.setStart(node.firstChild!, offset);
          break;
        } else {
          offset -= node.textContent!.length;
        }
      }
    }

    range.collapse(true);
    selection!.removeAllRanges();
    selection!.addRange(range);
    element.focus();
  }
}
