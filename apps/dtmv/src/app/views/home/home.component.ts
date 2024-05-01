import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    public router: Router,
    public route: ActivatedRoute
  ) {}

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
      roles: [],
      urlHome: '/home',
    },
    {
      name: 'Vp Report',
      url: '/vp-report',
      icon: 'fa-file-signature',
      roles: [],
      urlHome: '/home',
    },
  ];
  ngOnInit() {
    this.authService.getUserData();
    this.milestonesService.getRemindersData();
    this.userName = this.cookieService.get('USER_FULLNAME') || '';
    this.authService.loggedUserStream.subscribe((res) => {
      this.userName = res?.name || '';
      if (res?.roles) {
        const items = [];

        for (let i = 0; i < this.navItems.length; i++) {
          if (this.navItems[i].roles.length > 0) {
            const similar = this.navItems[i].roles.filter((element: string[]) =>
              element?.includes(res.roles[0])
            );
            if (similar.length === 0) {
              items.push(this.navItems[i]);
              this.urlHome = this.navItems[i].urlHome;
            }
            this.navItems = items;
          }
        }
      }
    });
  }

  clickRemider(item: any) {
    this.detailsNavigate(item?.milestoneId);
  }

  detailsNavigate(id: string | number) {
    this.router.navigate(['./home/milestone_details', id], {
      relativeTo: this.route,
    });
  }
  backToHome() {
    this.router.navigate([this.urlHome]);
  }
  logOut() {
    this.authService.logout();
  }
}
