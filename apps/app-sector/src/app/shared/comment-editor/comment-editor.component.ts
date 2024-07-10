import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  InputSignal,
  OnChanges,
  Output,
  SimpleChanges,
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
export class CommentEditorComponent implements AfterViewInit, OnChanges {
  @ViewChild('contentEditable', { static: true })
  contentEditable!: ElementRef<HTMLDivElement>;
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

  constructor(
    private mentionsService: mentionRegexService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editedText']) {
      this.setValue(this.editedText());
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.setupMentionListener();
    this.preventScrollOnFocusLoss();
  }

  preventScrollOnFocusLoss(): void {
    fromEvent<Event>(this.contentEditable.nativeElement, 'focusout').subscribe(
      (event) => {
        event.preventDefault();
      }
    );
  }

  writeValue(value: string): void {
    this.content = value;
    if (this.contentEditable && this.contentEditable.nativeElement) {
      this.contentEditable.nativeElement.innerHTML = this.highlightMentions(
        this.content
      );
      if (this.editedText()) {
        this.extractMentions(this.content).forEach((mention) => {
          this.addMention(mention);
        });
      } else {
        if (this.content) {
          this.setCaretPosition(
            this.contentEditable.nativeElement,
            this.content.length
          );
        }
      }
    }
  }

  extractMentions(text: string): string[] {
    const mentionPattern = /@([\w\s]+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionPattern.exec(text)) !== null) {
      mentions.push(match[1].trim());
    }
    return mentions;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setValue(content: string): void {
    this.content = content;
    this.contentEditable.nativeElement.innerText = content;
    this.cdr.detectChanges();
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

    if (mentionIndex > -1 && event.key === '@') {
      const query = textBeforeCursor.slice(mentionIndex + 1).toLowerCase();
      this.filteredList = this.mentions().filter((mention: any) =>
        mention[this.mentionProperty()].toLowerCase().includes(query)
      );

      if (this.filteredList.length > 0) {
        this.activeMentionIndex = 0;
        this.showDropdown = true;
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

        case 'Enter':
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
    const mentionStartIndex = value.lastIndexOf('@');

    const textBeforeMention = value.slice(0, mentionStartIndex);
    const textAfterMention = this.editedText()
      ? ''
      : value.slice(mentionStartIndex + 1).replace(/\s*\S*/, '');

    const mentionSpan = document.createElement('span');
    mentionSpan.className = 'mention';
    mentionSpan.textContent = `@${mention}`;

    input.innerHTML = '';
    input.appendChild(document.createTextNode(textBeforeMention));
    input.appendChild(mentionSpan);

    input.innerHTML += ' ';

    // input.appendChild(document.createTextNode(textAfterMention));

    const newText = `${textBeforeMention}${mentionSpan.textContent} ${textAfterMention}`;
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
    fromEvent<KeyboardEvent>(input, 'keydown')
      .pipe(filter((event) => event.key === 'Backspace'))
      .subscribe((event) => this.onBackspace(event));
  }

  onBackspace(event: KeyboardEvent): void {
    const input = this.contentEditable.nativeElement;
    const caretPosition = this.getCaretPosition(input);

    if (caretPosition === 0) {
      this.showDropdown = false;
      return; // No action needed if caret is at the beginning
    }

    const mention = this.getMentionAtCaretPosition(input, caretPosition);

    if (mention) {
      // If the caret is immediately after a mention, delete the mention
      this.deleteMention(mention);
      event.preventDefault();
    } else {
      // Delete a single character before the caret
      const textContent = input.textContent || '';
      const textBeforeCaret = textContent.slice(0, caretPosition - 1);
      const textAfterCaret = textContent.slice(caretPosition);
      const newText = textBeforeCaret + textAfterCaret;

      input.textContent = ''; // Clear existing content
      input.innerHTML = this.highlightMentions(newText); // Update HTML content
      this.content = input.textContent || ''; // Update content
      this.setCaretPosition(input, caretPosition - 1); // Adjust caret position
      this.contentChange.emit(this.content); // Emit content change event
      this.showDropdown = false; // Hide dropdown after deletion
      event.preventDefault();
    }
  }

  getMentionAtCaretPosition(
    element: HTMLElement,
    caretPosition: number
  ): any | null {
    const mentionElements = element.querySelectorAll('.mention');
    let mention = null;
    mentionElements.forEach((mentionElement: Element) => {
      const range = document.createRange();
      range.selectNodeContents(mentionElement);
      const start = this.getRangeOffset(range, element);
      const end = start + mentionElement.textContent!.length;
      if (caretPosition > start && caretPosition <= end) {
        mention = { name: mentionElement.textContent!.slice(1), start, end }; // remove '@' from name
      }
    });
    return mention;
  }

  getRangeOffset(range: Range, root: Node): number {
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(root);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    return preCaretRange.toString().length;
  }

  deleteMention(mention: any): void {
    const input = this.contentEditable.nativeElement;
    const content = input.innerHTML;
    const mentionHtml = `<span class="mention">@${mention.name}</span>`;
    const mentionIndex = content.indexOf(mentionHtml);

    if (mentionIndex !== -1) {
      const newText =
        content.slice(0, mentionIndex) +
        content.slice(mentionIndex + mentionHtml.length);

      input.innerHTML = this.highlightMentions(newText);
      this.content = input.textContent || '';
      this.onChange(this.content);
      this.contentChange.emit(this.content);

      // Adjust caret position after mention deletion
      const caretPosition = mention.start;
      this.setCaretPosition(input, caretPosition);
      this.showDropdown = false; // Hide the dropdown after deletion
    }
  }

  highlightMentions(content: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const mentions = this.mentions().map((mention: any) => `@${mention.name}`);
    const mentionRegex = new RegExp(mentions.join('|'), 'gi');

    // Convert NodeList to array to use forEach
    Array.from(tempDiv.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        let textContent = node.textContent || '';
        textContent = textContent.replace(mentionRegex, (match) => {
          return `<span class="mention">${match}</span>`;
        });
        const newSpan = document.createElement('span');
        newSpan.innerHTML = textContent;
        node.replaceWith(...Array.from(newSpan.childNodes));
      }
    });

    return tempDiv.innerHTML;
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
