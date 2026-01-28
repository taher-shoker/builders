import { AfterViewInit, Component, forwardRef, input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Quill from 'quill';

@Component({
  selector: 'stc-apps-text-editor-quill',
  template: `<div [id]="editorId"></div>`,
  standalone : false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorQuillComponent),
      multi: true
    }
  ]
})
export class TextEditorQuillComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  private static nextId = 0;
  private quillEditor!: Quill;
  private onChangeCallback!: (value: string) => void;
  private onTouchedCallback!: () => void;

  isReadOnly = input<boolean>(false)

  editorId: string;

  constructor() {
    this.editorId = `quill-editor-${TextEditorQuillComponent.nextId++}`;

    // effect(() => {
    //   console.log("in child",this.isReadOnly())
    // })
  }

  ngAfterViewInit(): void {
      console.log("in child ngAfterViewInit",this.isReadOnly())
      this.quillEditor = new Quill(`#${this.editorId}`, {
      theme: 'snow',
      readOnly: this.isReadOnly(),
      modules: {
        toolbar: this.isReadOnly() ? false : [
          // [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ 'color': [] } ],
          [{ 'list': 'bullet' }],
        ]
      }
    });

    this.quillEditor.on('text-change', () => {
      this.onChangeCallback(this.quillEditor.root.innerHTML);
      this.onTouchedCallback();
    });
  }

  ngOnDestroy(): void {
    this.quillEditor.off('text-change');
  }

  writeValue(value: string): void {
    if (this.quillEditor) {
      this.quillEditor.root.innerHTML = value || '';
    }
  }

  registerOnChange(callback: (value: string) => void): void {
    this.onChangeCallback = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouchedCallback = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.quillEditor) {
      this.quillEditor.enable(!isDisabled);
    }
  }
}
