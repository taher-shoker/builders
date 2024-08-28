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
    return this._value;
  }

  set value(val: string) {
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
      this._value = '';
    }
    this._value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    console.log('registerOnChange');

    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  search(event: any) {
    console.log('search', event);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnchanges');

    this.items = this.mentions();
    this.initializeMentionConfig();
  }

  filter(searchString: string): any[] {
    return this.items.filter((item: any) =>
      item.name.toLowerCase().includes(searchString)
    );
  }

  initializeMentionConfig() {
    this.mentionConfig = {
      items: this.items,
      triggerChar: '@',
      labelKey: this.mentionProperty(),
      mentionSelect: this.textToInsertWhenSelect,
      mentionFilter: this.filter,
      allowSpace: true,
      returnTrigger: true,
    };
  }
  onKeyUp(event: any) {
    console.log('onKeyUp', event);

    const input = event.target as HTMLDivElement;
    this.value = input.textContent || '';
    if (event.key == 'Backspace') {
      const spans = event.target.querySelectorAll('span');
      console.log('keydown', spans);
      let dataInfo;
      const dataIds: any[] = [];
      spans.forEach((span: any) => {
        // Access data attributes using the dataset property
        // For example, if you have a data attribute like data-info
        dataInfo = span.dataset.id;
        dataIds.push(dataInfo);
        // Do something with the data attribute value
        // console.log(dataInfo);
      });
      this.deletionEmitter.emit(dataIds);
    }
  }
  textToInsertWhenSelect(item: any): any {
    setTimeout(() => {
      pasteHtmlAtCaret(
        '<span contenteditable=false class="mention" data-id=' +
          item.id +
          '>' +
          item.name +
          '</span>'
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
    }
  }

  onInput(event: Event): void {
    const input = event.target as HTMLDivElement;
    this.value = input.textContent || '';
  }
}

export function pasteHtmlAtCaret(html: any) {
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
