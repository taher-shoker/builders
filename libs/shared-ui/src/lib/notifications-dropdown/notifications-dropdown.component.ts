import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'stc-apps-notifications-dropdown',
  templateUrl: './notifications-dropdown.component.html',
  styleUrl: './notifications-dropdown.component.scss',
})
export class NotificationsDropdownComponent {
  @Input() items!: any[];
}
