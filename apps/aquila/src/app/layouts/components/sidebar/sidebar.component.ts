import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'stc-apps-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class SidebarComponent {
  menuItems = [
    { label: 'API test', link: 'api-test' },
    { label: 'Test history', link: 'test-history' },
    { label: 'API Standard', link: 'api-standard-list' },
    { label: 'Settings', link: '#' },
    { label: 'Logout', link: '#' },
  ];
}
