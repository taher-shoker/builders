import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export type MaturityEditValues = {
  strategy: number;
  structure: number;
  processes: number;
  people: number;
  technology: number;
};

export type MaturityEditPayload = {
  values: MaturityEditValues;
  keyHighlightsTitle: string;
  keyHighlightsContentHtml: string;
};

@Component({
  selector: 'stc-apps-agile-maturity-edit-form',
  standalone: false,
  templateUrl: './agile-maturity-edit-form.component.html',
  styleUrls: ['./agile-maturity-edit-form.component.scss'],
})
export class AgileMaturityEditFormComponent implements OnInit, OnChanges {
  @Input() initialValues: {
    values: Partial<MaturityEditValues>;
    keyHighlightsTitle?: string;
    keyHighlightsContentHtml?: string;
  } = { values: {} };
  @Output() save = new EventEmitter<MaturityEditPayload>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
  };

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  hasHighlightContent: boolean = false;
  private normalizeHtml(val: string): string {
    const doc = new DOMParser().parseFromString(String(val ?? ''), 'text/html');
    const text = (doc.body.textContent || '')
      .replace(/\u00A0/g, ' ')
      .replace(/\u200B/g, '')
      .trim();
    return text;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      strategy: [
        this.initialValues.values.strategy ?? null,
        [Validators.required, Validators.min(0), Validators.max(4)],
      ],
      structure: [
        this.initialValues.values.structure ?? null,
        [Validators.required, Validators.min(0), Validators.max(4)],
      ],
      processes: [
        this.initialValues.values.processes ?? null,
        [Validators.required, Validators.min(0), Validators.max(4)],
      ],
      people: [
        this.initialValues.values.people ?? null,
        [Validators.required, Validators.min(0), Validators.max(4)],
      ],
      technology: [
        this.initialValues.values.technology ?? null,
        [Validators.required, Validators.min(0), Validators.max(4)],
      ],
      keyHighlightsTitle: [
        this.initialValues.keyHighlightsTitle ?? '',
        [Validators.required],
      ],
      keyHighlightsContentHtml: [
        this.initialValues.keyHighlightsContentHtml ?? '',
        // [this.htmlRequiredValidator()],
      ],
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();

    const contentCtrl = this.form.get('keyHighlightsContentHtml');
    if (contentCtrl) {
      const update = (val: any) => {
        this.hasHighlightContent = this.normalizeHtml(val ?? '').length > 0;
      };

      update(contentCtrl.value);
      contentCtrl.valueChanges.subscribe(update);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValues'] && this.form) {
      this.form.patchValue(
        {
          strategy: this.initialValues.values.strategy ?? null,
          structure: this.initialValues.values.structure ?? null,
          processes: this.initialValues.values.processes ?? null,
          people: this.initialValues.values.people ?? null,
          technology: this.initialValues.values.technology ?? null,
          keyHighlightsTitle: this.initialValues.keyHighlightsTitle ?? '',
          keyHighlightsContentHtml:
            this.initialValues.keyHighlightsContentHtml ?? '',
        },
        { emitEvent: false }
      );
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  }
  onSave() {
    if (this.form.invalid) return;
    const payload: MaturityEditPayload = {
      values: {
        strategy: Number(this.form.value.strategy),
        structure: Number(this.form.value.structure),
        processes: Number(this.form.value.processes),
        people: Number(this.form.value.people),
        technology: Number(this.form.value.technology),
      },
      keyHighlightsTitle: this.form.value.keyHighlightsTitle || '',
      keyHighlightsContentHtml: this.form.value.keyHighlightsContentHtml || '',
    };
    this.save.emit(payload);
  }

  onCancel() {
    this.cancel.emit();
  }

  onTextChange(event: any) {
    const html = event?.htmlValue ?? '';
    this.hasHighlightContent = this.normalizeHtml(html).length > 0;

    // ensure template refresh (sometimes Quill events are outside Angular zone)
    this.cdr.detectChanges();
  }

  isHasHighlightContent() {
    return this.hasHighlightContent;
  }
}
