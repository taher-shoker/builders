import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  input,
  InputSignal,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NotificationsService } from '../../views/details/services/notifications.service';

@Component({
  selector: 'stc-apps-mentions-editor',
  templateUrl: './mentions-editor.component.html',
  styleUrls: ['./mentions-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MentionsEditorComponent),
      multi: true,
    },
  ],
})
export class MentionsEditorComponent
  implements ControlValueAccessor, OnChanges
{
  @ViewChild('contentEditable', { static: true })
  contentEditable!: ElementRef<HTMLDivElement>;
  placeholder: InputSignal<string> = input('');
  title: InputSignal<string> = input('');
  mentionProperty: InputSignal<string> = input('name');
  editedText: InputSignal<string> = input('');
  mentions: InputSignal<any> = input([]);
  @Output() contentChange = new EventEmitter<string>();
  @Output() deletionEmitter = new EventEmitter<number[]>();
  filteredList: any[] = [];

  items: any[] = [];
  mentionConfig: any;
  _value: any = '';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  get value(): string {
    console.log('get');

    return this._value;
  }

  set value(val: string) {
    console.log('set');

    this._value = val;
    this.onChange(val);
    this.contentChange.emit(val);
  }

  constructor(
    private cd: ChangeDetectorRef,
    private notificationService: NotificationsService
  ) {}

  writeValue(value: string): void {
    console.log('writeValue', value);
    if (value == null) {
      console.log('hee', value);
      this.contentEditable.nativeElement.innerHTML = value;
    } else if (this.editedText()) {
      console.log('found edited text');

      if (this.notificationService.mentionsObjects) {
        console.log(this.notificationService.mentionsObjects);
        this.contentEditable.nativeElement.innerHTML =
          this.highlightMentions(value);
      }

      // this.contentEditable.nativeElement.innerHTML = value;
      // console.log(this.contentEditable.nativeElement.innerHTML);
    } else {
      this._value = value;
    }
  }
  highlightMentions(content: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const mentions = this.notificationService.mentionsObjects.map(
      (mention: any) => `${mention.name}`
    );
    const mentionRegex = new RegExp(mentions.join('|'), 'gi');
    // Convert NodeList to array to use forEach
    Array.from(tempDiv.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        let textContent = node.textContent || '';
        if (this.notificationService.mentionsObjects?.length !== 0) {
          let index = -1;
          textContent = textContent.replace(mentionRegex, (match) => {
            index++;
            return `<span contenteditable=false data-id=${this.notificationService.mentionsObjects[index].id} class="mention" >${match}</span>`;
          });
        } else {
          textContent = textContent.replace(mentionRegex, (match) => {
            return `<span contenteditable=false class="mention" >${match}</span>`;
          });
        }

        const newSpan = document.createElement('span');
        newSpan.innerHTML = textContent;
        node.replaceWith(...Array.from(newSpan.childNodes));
      }
    });

    return tempDiv.innerHTML;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.items = this.mentions();
    this.initializeMentionConfig();
  }

  filter(searchString: string): any[] {
    return this.items.filter((item: any) =>
      item.name.toLowerCase().includes(searchString)
    );
  }

  initializeMentionConfig() {
    console.log('initializeMentionConfig');

    this.mentionConfig = {
      items: this.items,
      triggerChar: '@',
      labelKey: this.mentionProperty(),
      mentionSelect: this.textToInsertWhenSelect,
      mentionFilter: this.filter,
      allowSpace: true,
      returnTrigger: false,
    };
  }
  onKeyUp(event: any) {
    const input = event.target as HTMLDivElement;
    this.value = input.textContent || '';
    if (event.key == 'Backspace') {
      const spans = event.target.querySelectorAll('span');
      let dataInfo;
      const dataIds: any[] = [];
      spans.forEach((span: any) => {
        // Access data attributes using the dataset property
        // For example, if you have a data attribute like data-info
        dataInfo = span.dataset.id;
        dataIds.push(dataInfo);
      });
      this.deletionEmitter.emit(dataIds);
    }
  }
  textToInsertWhenSelect(item: any): any {
    setTimeout(() => {
      pasteHtmlAtCaret(
        `<span contenteditable=false class="mention" data-id=
          ${item.id}
          >${item.name}</span>&nbsp;`
      );
    }, 0);

    return '';
  }

  change(e: any) {
    setTimeout(() => {
      console.log('change', e);
      const newe = document.createElement('div');
      const html = e.target.innerHTML;
      newe.innerHTML = e.target.innerHTML;
      newe.querySelectorAll('b').forEach((elem: any) => {
        const id = elem.getAttribute('data-id');
        elem.replaceWith(id);
      });
    }, 0);
  }

  onItemSelected(item: any): void {
    console.log('onItemSelected', item);

    if (item) {
      this.notificationService.addMentionObjects(item);
      this.value += item.name;
      this.value=this.value.replace('@','');
    }
  }
}

export function pasteHtmlAtCaret(html: any) {
  console.log('pasteHtmlAtCaret', html);

  let sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel?.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();
      const el = document.createElement('div');
      el.innerHTML = html;
      // eslint-disable-next-line prefer-const
      let frag = document.createDocumentFragment(),
        node,
        lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }
}
