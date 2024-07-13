import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarLinksModel } from './sidebarLinks.model';

@Component({
  selector: 'stc-apps-sidebar',
  standalone: true,
  imports: [CommonModule , RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  // @Input({required : true}) logoSrc!:string;
  logoSrc = input.required<string>({alias : 'logoSrc'})
  usernameImage = input<string>()
  userName = input<string>()
  sidebarLinks = input.required<SidebarLinksModel[]>()
}
