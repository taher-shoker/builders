import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

export interface MilestoneAttachment {
  id: number;
  attachmentType: string;
  fileName: string;
  url: string;
  label: string;
  note: string;
  uploadDate: string;
}

export class Actions {
  static readonly addEvidence = new Actions('Add Evidence', 'Add Evidence');
  static readonly addNewProgress = new Actions(
    'Add New Progress',
    'Add New Progress'
  );
  static readonly addJustification = new Actions(
    'Add Justification',
    'Add Justification'
  );
  static readonly addOnTrack = new Actions('Add Remarks', 'Add Remarks');
  static readonly reviewEvidence = new Actions('Approve Evidence', 'Approve');
  static readonly reviewJustification = new Actions(
    'Approve Justification',
    'Approve'
  );
  static readonly reviewOnTrack = new Actions('Approve on Track', 'Approve');
  static readonly updateDTRecord = new Actions(
    'Update Record',
    'Update Record'
  );
  static readonly initiateUpdateProgress = new Actions(
    'Update progress',
    'Update progress'
  );
  static readonly approveProgress = new Actions(
    'Approve progress',
    'Approve progress'
  );
  static readonly returnProgress = new Actions('Return progress', 'Return');

  static readonly returnJustification = new Actions(
    'Return Justification',
    'Return'
  );
  static readonly returnEvidence = new Actions('Return Evidence', 'Return');
  static readonly returnOnTrack = new Actions('Return Remarks', 'Return');
  static readonly noNeed = new Actions('No Need', 'No Need');

  // private to disallow creating other instances of this type
  private constructor(
    public readonly uniqueTitle: string,
    public readonly displayCaption: string
  ) {}

  toString() {
    return this.uniqueTitle;
  }
}

export interface StepperConfig {
  axis?: 'vertical' | 'horizontal';
  direction?: 'ltr' | 'rtl';
}

export interface Step {
  template?: string;
  caption: string;
  captionTemp?: boolean;
  state: 'done' | 'undone' | 'warning' | 'danger' | 'edit';
  actions?: string[] | Actions[];
  additionalTemp?: boolean;
  extraInfo?: string[];
  notes?: string;
  attachments?: MilestoneAttachment[];
  stepObject?: any;
}

@Component({
  selector: 'stc-apps-actions-stepper',
  templateUrl: './actions-stepper.component.html',
  styleUrls: ['./actions-stepper.component.scss'],
  standalone: false,
})
export class ActionsStepperComponent {
  @Output() stepperAction: EventEmitter<{
    actionObj: string | Actions;
    item: any;
  }> = new EventEmitter<{ actionObj: string | Actions; item: any }>();

  @Input({ required: true }) steps!: Step[];
  @Input() stepperConfig!: StepperConfig;

  @ContentChild('bodyTemplate') stepTemplate!: TemplateRef<any>;
  @ContentChild('captionTemplate') stepCaptionTemplate!: TemplateRef<any>;

  getKeys(obj: any): string[] {
    return Object.keys(obj).filter(
      (k) =>
        ![
          'milestone_id',
          'milestone_change_request_id',
          'creator_username',
          'team',
          'change_type',
        ].includes(k)
    );
  }
  // 🔹 Method to format values
  formatValue(key: string, value: any): string {
    if (!value) return 'N/A';
    const date = new Date(value);

    switch (key) {
      case 'createdDate':
      case 'updatedDate':
      case 'closedDate':
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
      default:
        return String(value);
    }
  }

  raiseAction(actionObj: string | Actions, optionalItem?: any) {
    this.stepperAction.emit({ actionObj, item: optionalItem });
  }
}
