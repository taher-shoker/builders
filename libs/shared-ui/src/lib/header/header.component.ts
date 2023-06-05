import { Component, Input, OnInit } from '@angular/core';
import { NavItem } from './header.model';

@Component({
  selector: 'stc-apps-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() userName: string | undefined;
  @Input() logoSrc: string | undefined;
  @Input({ required: true })
  allItems!: NavItem[];

  showMenu = false;
  onClick(): void {
    this.showMenu = !this.showMenu;
  }
}
