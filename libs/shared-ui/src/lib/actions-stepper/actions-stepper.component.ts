/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { MilestoneAttachment } from './../../../../../apps/dtmv/src/app/views/milestones-setting/milestones.service';
import {
  Component,
  ContentChild,
  Directive,
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
  state: 'done' | 'undone' | 'warning';
  actions?: string[];
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
})
export class ActionsStepperComponent {
  @Output() stepperAction: EventEmitter<{ actionName: string; item: any }> =
    new EventEmitter<{ actionName: string; item: any }>();

  @Input({ required: true }) steps!: Step[];
  @Input() stepperConfig!: StepperConfig;

  @ContentChild(TemplateRef) stepTemplate!: TemplateRef<any>;

  raiseAction(actionName: string, optionalItem?: any) {
    this.stepperAction.emit({ actionName, item: optionalItem });
  }
}
