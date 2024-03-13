/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  AfterContentInit,
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
  attachments?: string[];
  stepObject?: any;
}

@Directive({
  selector: '[stcAppsStepView]',
  standalone: true,
})
export class StepDirective {
  constructor(private templateRef: TemplateRef<any>) {}
}

@Component({
  selector: 'stc-apps-actions-stepper',
  templateUrl: './actions-stepper.component.html',
  styleUrls: ['./actions-stepper.component.scss'],
})
export class ActionsStepperComponent implements AfterContentInit {
  @Output() stepperAction: EventEmitter<{ actionName: string; item: any }> =
    new EventEmitter<{ actionName: string; item: any }>();

  @Input({ required: true }) steps!: Step[];
  @Input() stepperConfig!: StepperConfig;

  @ContentChild(TemplateRef) stepTemplate!: TemplateRef<any>;

  ngAfterContentInit(): void {
    console.log('PROJECTED to stepper:', this.stepTemplate);
    console.log('steps:', this.steps);
  }

  raiseAction(actionName: string, optionalItem?: any) {
    console.log('THE OPT ITEM:', optionalItem);
    console.log('THE actionName:', actionName);
    this.stepperAction.emit({ actionName, item: optionalItem });
  }
}
