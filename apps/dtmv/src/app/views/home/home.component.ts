import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  MilestonesService,
  Reminders,
} from '../milestones-setting/milestones.service';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private authService: AuthService,
    public milestonesService: MilestonesService,
    public router: Router
  ) {}

  remindersItems: Reminders[] = [];
  urlHome = '/home';
  title = { title: 'home', text: '' };
  userName = '';
  logoSrc = 'assets/images/brand/stc-logo.png';
  sidebarLogoSrc = 'assets/images/brand/sidebar-logo.png';
  navItems = [
    {
      name: 'home',
      url: '/home',
      icon: 'fa-home',
      roles: ['APPROVERS,CREATORS'],
      urlHome: '/home',
    },
  ];
  ngOnInit() {
    this.authService.getUserData();
    this.getRemindersData();
    this.userName = this.cookieService.get('USER_FULLNAME') || '';
    this.authService.loggedUserStream.subscribe((res) => {
      this.userName = res?.name || '';
      if (res?.roles) {
        const items = [];
        for (let i = 0; i < this.navItems.length; i++) {
          const similar = this.navItems[i].roles.filter((element) =>
            element.includes(res.roles[0])
          );
          if (similar.length > 0) {
            items.push(this.navItems[i]);
            this.urlHome = this.navItems[i].urlHome;
          }
        }
        this.navItems = items;
      }
    });
  }

  getRemindersData() {
    this.milestonesService.getReminders().subscribe((res) => {
      console.log(res);
      this.remindersItems = res;
    });
  }
  backToHome() {
    this.router.navigate([this.urlHome]);
  }
  logOut() {
    this.authService.logout();
  }
}
