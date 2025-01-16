import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ButtonModule } from 'primeng/button';
import { NotificationsListComponent } from '../../../features/notifications-list/notifications-list.component';
import { SpeedDialModule } from 'primeng/speeddial';

@Component({
  selector: 'stc-apps-top-banner',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    ButtonModule,
    NotificationsListComponent,
    SpeedDialModule,
  ],
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.scss'],
})
export class TopBannerComponent {
  logoSrc = input('');
  userName = 'Sara Alkurdy';
  showNotifications = false;
  notifications = [
    {
      title: 'TMF622 - Product Ordering Management API',
      message: 'has been updated',
      time: 'Today at 9:42 AM',
      read: false,
    },
    {
      title: 'TMF622 - Product Ordering Management API',
      message: 'has been updated',
      time: 'Last Wednesday at 9:42 AM',
      read: false,
    },
    {
      title: 'TMF622 - Product Ordering Management API',
      message: 'has been updated',
      time: 'Last Wednesday at 9:42 AM',
      read: false,
    },
    {
      title: 'TMF622 - Product Ordering Management API',
      message: 'has been updated',
      time: 'Last Wednesday at 9:42 AM',
      read: true,
    },
    {
      title: 'TMF622 - Product Ordering Management API',
      message: 'has been updated',
      time: 'Last Wednesday at 9:42 AM',
      read: true,
    },
  ];

  handleNotificationClick(notification: string) {
    console.log('Clicked:', notification);
    // Add your logic here for handling notification clicks
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
