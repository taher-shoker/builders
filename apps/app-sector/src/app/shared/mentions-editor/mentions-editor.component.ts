import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  input,
  InputSignal,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
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
  implements ControlValueAccessor, OnChanges, OnInit, AfterViewInit
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
  mentionsArray: string[] = [];

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
    private notificationService: NotificationsService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    const contentEditableDiv = this.contentEditable.nativeElement;

    contentEditableDiv.addEventListener('paste', (event: any) => {
      event.preventDefault();

      const clipboardData = event.clipboardData || window.Clipboard;
      const htmlData = clipboardData.getData('text/html');
      const plainText = clipboardData.getData('text/plain');

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlData;
      const hasIdSpans = tempDiv.querySelectorAll('span[data-id]').length > 0;

      if (hasIdSpans) {
        document.execCommand('insertHTML', false, htmlData);
      } else {
        document.execCommand('insertText', false, plainText);
      }
    });
  }

  ngOnInit(): void {
    this.setupContentChangeListener();
  }

  writeValue(value: string): void {
    console.log('writeValue', value);
    if (value == null) {
      console.log('hee', value);
      this.contentEditable.nativeElement.textContent = value;
    } else if (this.editedText()) {
      console.log('found edited text');

      if (this.notificationService.mentionsObjects) {
        console.log(this.notificationService.mentionsObjects);
        this.contentEditable.nativeElement.innerHTML =
          this.highlightMentions(value);
      }
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
            return `<span contenteditable=false data-index=${this.notificationService.mentionsObjects[index].index} data-id=${this.notificationService.mentionsObjects[index].id} class="mention" >${match}</span>`;
          });
        }
        // else {
        //   textContent = textContent.replace(mentionRegex, (match) => {
        //     return `<span contenteditable=false class="mention" >${match}</span>`;
        //   });
        // }

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
    this.mentionConfig = {
      items: this.items,
      triggerChar: '@',
      labelKey: this.mentionProperty(),
      mentionSelect: this.textToInsertWhenSelect.bind(this),
      mentionFilter: this.filter.bind(this),
      allowSpace: true,
      returnTrigger: false,
    };
  }

  onKeyUp(event: any) {
    const input = event.target as HTMLDivElement;
    this.value = input.innerHTML || '';

    if (event.key == 'Backspace') {
      const spans = event.target.querySelectorAll('span');
      let dataInfo;
      let dataIndex;
      const dataIds: any[] = [];
      const dataIndexes: any[] = [];
      spans.forEach((span: any) => {
        // Access data attributes using the dataset property
        // For example, if you have a data attribute like data-info
        console.log(span.id, 'ID');
        dataIndex = span.dataset.index;
        dataInfo = span.dataset.id;
        if (dataInfo) {
          dataIds.push(dataInfo);
          dataIndexes.push(dataIndex);
        }
      });
      console.log('dataIDS', dataIndex);

      this.deletionEmitter.emit(dataIndexes);
    }
  }

  textToInsertWhenSelect(item: any): any {
    const index = this.notificationService.index;
    setTimeout(() => {
      pasteHtmlAtCaret(
        `<span contenteditable=false class="mention" 
      data-index=${index}
        data-id=
          ${item.id}
          >${item.name}</span>&nbsp`
      );
      const contentDiv = this.contentEditable.nativeElement;
      this.onContentChange(contentDiv.textContent ?? contentDiv.innerHTML);
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
      if (this.value.endsWith('@' + item.name)) {
        this.value = this.value.replace('@' + item.name, item.name);
      } else {
        this.value += item.name;
      }
    }
  }

  setupContentChangeListener(): void {
    const contentDiv = this.contentEditable.nativeElement;
    // contentDiv.addEventListener('keyup', () =>
    //   this.onContentChange(contentDiv.textContent ?? contentDiv.innerHTML)
    // );
  }

  // onContentChange(content: string): void {
  //   console.log('Content:', content);
  //   // const mentionsArray = this.extractMentions(content);

  //   // this.mentionsArray = mentionsArray;
  //   this.value = content;
  //   this.processMentions(content);
  // }

  onContentChange(content: string): void {
    const contentDiv = this.contentEditable.nativeElement;
    this._value = contentDiv.innerHTML;
    this.onChange(this._value);
    this.contentChange.emit(this._value);
  }

  processMentions(content: string): void {
    console.log('inside process mentions');
    // Parse the HTML content and find all span elements with a data-id attribute
    const spans = document.querySelectorAll('span[data-id]');
    console.log(spans);
    const brElements = document.querySelectorAll(
      'br.Apple-interchange-newline'
    );
    console.log('br elements', brElements);
    if (brElements) {
      brElements.forEach((br: any) => {
        this.renderer.removeChild(document, br);
      });
    }
    const mentionObjects: any[] = this.notificationService.mentionsObjects;
    spans.forEach((span) => {
      const id = span.getAttribute('data-id');
      console.log(id);

      if (id) {
        const mention = this.mentions().find(
          (m: any) => m.id.toString() === id
        );
        if (mention) {
          const mentionExist = mentionObjects.some(
            (mentions) => mentions.id === mention.id
          );
          console.log('mention', mention.id, mentionExist);
          if (!mentionExist) {
            mentionObjects.push(mention);
            this.notificationService.addMentionObjects(mention);
          }
        }
      }
    });
  }

  extractMentions(text: string): string[] {
    const mentions: string[] = this.mentions().map(
      (mention: any) => mention.name
    );
    const mentionPattern = new RegExp(mentions.join('|'), 'gi');
    const extractedMentions: string[] = [];
    let match;

    while ((match = mentionPattern.exec(text)) !== null) {
      extractedMentions.push(match[0]);
    }

    // console.log('Extracted mentions:', extractedMentions);
    return extractedMentions;
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
