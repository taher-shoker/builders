/* eslint-disable @typescript-eslint/no-inferrable-types */
import { AfterContentInit, Component, ContentChild, Directive, Input, TemplateRef } from '@angular/core';

export interface StepperConfig{
  axis?: "vertical" | "horizontal";
  direction?: "ltr" | "rtl";
}

export interface Step{
template?: string;
  caption: string;
  state: "done" | "undone" | "warning";
  actions?: string[];
  extraInfo? : string
}

@Directive({
  selector: '[stcAppsStepView]',
  standalone: true
})
export class StepDirective {
  constructor(private templateRef: TemplateRef<any>) {
  }
}


@Component({
  selector: 'stc-apps-actions-stepper',
  templateUrl: './actions-stepper.component.html',
  styleUrls: ['./actions-stepper.component.scss'],
})
export class ActionsStepperComponent implements AfterContentInit  {
  
  @Input({required: true}) steps!: Step[];
  @Input() stepperConfig!: StepperConfig;

  @ContentChild(TemplateRef) stepTemplate!: TemplateRef<any>;

  ngAfterContentInit(): void {
      console.log("PROJECTEC:", this.stepTemplate)
  }
  
}
