import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  menuItems = [
    { label: 'API test', link: 'user/api-test' },
    { label: 'Test history', link: '' },
    { label: 'API Standard', link: '' },
    { label: 'Settings', link: '' },
    { label: 'Logout', link: '' },
  ];
}
