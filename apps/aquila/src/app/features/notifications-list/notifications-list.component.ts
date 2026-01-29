import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeedDialModule } from 'primeng/speeddial';
import { ButtonModule } from 'primeng/button';

interface Notification {
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'stc-apps-notifications-list',
  standalone: true,
  imports: [CommonModule, SpeedDialModule, ButtonModule],
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss'],
})
export class NotificationsListComponent {
  notifications = input<any[]>([]);

  get unreadCount(): number {
    return this.notifications().filter((notification) => !notification.read)
      .length;
  }

  markAsRead(notification: Notification) {
    notification.read = true;
  }

  markAllAsRead() {
    this.notifications().forEach((notification) => (notification.read = true));
  }
}
