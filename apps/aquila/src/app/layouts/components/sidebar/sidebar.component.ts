import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  menuItems = [
    { label: 'API test', link: 'api-test' },
    { label: 'Test history', link: 'test-history' },
    { label: 'API Standard', link: '#' },
    { label: 'Settings', link: '#' },
    { label: 'Logout', link: '#' },
  ];
}
