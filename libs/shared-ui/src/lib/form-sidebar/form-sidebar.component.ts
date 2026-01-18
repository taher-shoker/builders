import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'stc-apps-form-sidebar',
  standalone: false,
  templateUrl: './form-sidebar.component.html',
  styleUrls: ['./form-sidebar.component.scss'],
})
export class FormSidebarComponent {
  @Input() visible = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() title = '';
  @Input() position: 'right' | 'left' = 'right';
  @Input() showCloseIcon = false;
  @Input() styleClass = 'form-sidebar';
  @Output() onHide: EventEmitter<void> = new EventEmitter<void>();
  @Output() onShow: EventEmitter<void> = new EventEmitter<void>();

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.onHide.emit();
  }

  handleHide() {
    this.onHide.emit();
  }

  handleShow() {
    this.onShow.emit();
  }
}

