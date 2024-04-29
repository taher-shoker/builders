/* eslint-disable @angular-eslint/no-input-rename */
import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[stcAppsCustomTemplate]',
})
export class CustomTemplateDirective {
  @Input() header!: string;
  @Input('stcAppsCustomTemplate') templateRef!: TemplateRef<any>;

}