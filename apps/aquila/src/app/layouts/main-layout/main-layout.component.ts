import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'stc-apps-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterModule],
})
export class MainLayoutComponent {}
