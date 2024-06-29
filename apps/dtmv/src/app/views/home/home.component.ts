import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MilestonesService } from '../milestones-setting/milestones.service';

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
      roles: ['all'],
      urlHome: '/home',
    },
    {
      name: 'Vp Report',
      url: '/vp-report',
      icon: 'fa-file-signature',
      roles: ['VP_VIEWER', 'VP_EDITOR', 'PMO'],
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
          const item = this.navItems[i];
          // Check if the item should be included based on roles
          if (
            item.roles.includes('all') ||
            item.roles.some((role) => res.roles.includes(role))
          ) {
            items.push(item);
            this.urlHome = item.urlHome;
          }
        }
        // Update the navItems with the filtered list
        this.navItems = items;
      }
    });
  }

  clickReminder(item: any) {
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
