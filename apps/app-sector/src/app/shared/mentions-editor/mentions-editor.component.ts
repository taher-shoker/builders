import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  input,
  InputSignal,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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

  filteredList: any[] = [];

  items: any[] = [];
  mentionConfig: any;
  _value: string = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
    this.onChange(val);
    this.contentChange.emit(val);
  }

  constructor(private cd: ChangeDetectorRef) {}

  writeValue(value: string): void {
    this._value = value;
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
      let newe = document.createElement('div');
      let html = e.target.innerHTML;
      newe.innerHTML = e.target.innerHTML;
      newe.querySelectorAll('b').forEach((elem: any) => {
        let id = elem.getAttribute('data-id');
        elem.replaceWith(id);
      });
    }, 0);
  }

  onItemSelected(item: any): void {
    if (item) {
      this.value = item.name;
    }
  }
}

export function pasteHtmlAtCaret(html: any) {
  let sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel?.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();
      let el = document.createElement('div');
      el.innerHTML = html;
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
