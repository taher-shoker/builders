/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Actions } from 'apps/dtmv/src/app/services/models/milestones.models';
import {
  MilestoneAttachment,
} from './../../../../../apps/dtmv/src/app/views/milestones-setting/milestones.service';
import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

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
  standalone : false
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

  raiseAction(actionObj: string | Actions, optionalItem?: any) {
    this.stepperAction.emit({ actionObj, item: optionalItem });
  }
}
