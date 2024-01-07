/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  selector: 'stc-apps-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input({ required: true }) buttonText = 'BUTTON';
  @Input() buttonType:
    | 'primary'
    | 'danger'
    | 'warn'
    | 'success'
    | 'danger-outline'
    | 'gray-outline'
    | 'stc-color-outline'
    | 'default' = 'default';
  @Input() actionType: 'button' | 'submit' = 'button';
  @Input() buttonDisable = false;
  @Input() loading = false;
  @Input() buttonIcon = '';
  @Input() bgColor: string = '#4f008c';
  @Input() textColor: string = 'black';
  @Input() fontWeight: string = 'normal';
  @Input() padding: string = '';
  @Input() paddingX: string = '12px';
  @Input() paddingY: string = '6px';
  @Output() btnClick: EventEmitter<void> = new EventEmitter();

  ngOnInit(): void {

    if(this.padding){
      this.paddingX = this.padding;
      this.paddingY = this.padding;
    }
  }
  onClick() {
    this.btnClick.emit();
  }
}
