import { Component, EventEmitter, Input, Output, input } from '@angular/core';

@Component({
  selector: 'stc-apps-notifications-dropdown',
  templateUrl: './notifications-dropdown.component.html',
  styleUrl: './notifications-dropdown.component.scss',
})
export class NotificationsDropdownComponent {
  @Input() items!: any[];
  @Output() clickItem: EventEmitter<number> = new EventEmitter<number>();
  notificationsTitle = input.required<string>();

  onClickItem(id: number) {
    this.clickItem.emit(id);
  }
}
