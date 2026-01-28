import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
  keyTitle = '';

  constructor(private fb: FormBuilder) {}

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
      keyHighlightsContentHtml: [
        this.initialValues.keyHighlightsContentHtml ?? '',
        [],
      ],
    });
    this.keyTitle = this.initialValues.keyHighlightsTitle ?? '';
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValues'] && this.form) {
      this.form.patchValue({
        strategy: this.initialValues.values.strategy ?? null,
        structure: this.initialValues.values.structure ?? null,
        processes: this.initialValues.values.processes ?? null,
        people: this.initialValues.values.people ?? null,
        technology: this.initialValues.values.technology ?? null,
        keyHighlightsContentHtml: this.initialValues.keyHighlightsContentHtml ?? '',
      }, { emitEvent: false });
      this.keyTitle = this.initialValues.keyHighlightsTitle ?? '';
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
      keyHighlightsTitle: this.keyTitle,
      keyHighlightsContentHtml: this.form.value.keyHighlightsContentHtml || '',
    };
    this.save.emit(payload);
  }

  onCancel() {
    this.cancel.emit();
  }
}
