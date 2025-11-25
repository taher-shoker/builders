import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BannerDataService } from '@stc-apps/shared-ui';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../services/auth.service';
import { MilestonesService } from '../milestones-setting/milestones.service';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  activeTabIndex = 0;
  showTabs = true;

  constructor(
    private cookieService: CookieService,
    private authService: AuthService,
    public milestonesService: MilestonesService,
    public router: Router,
    public route: ActivatedRoute,
    private bannerDataService: BannerDataService
  ) {}

  private readonly TAB_ROUTES_SET = new Set([
    '/home',
    '/di-kpi-integration',
    '/',
  ]);
  urlHome = '/home';
  title = { title: 'home', text: '' };
  userName = '';
  logoSrc = 'assets/images/brand/stc-logo.png';
  sidebarLogoSrc = 'assets/images/brand/sidebar-logo.png';
  navItems = [
    {
      name: 'Milestone Management',
      url: '/home',
      icon: 'fa-home',
      roles: ['all'],
      urlHome: '/home',
    },
    {
      name: 'KPI Management',
      url: '/kpi-dashboard',
      icon: 'fa-tachometer-alt',
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
    {
      name: 'Archived DT Milestones',
      url: '/archived-milestones',
      icon: 'fa fa-archive',
      roles: ['VP_VIEWER', 'VP_EDITOR', 'PMO', 'DT_User'],
      urlHome: '/home',
    },
    {
      name: 'Feedback/Issues Logs',
      url: '/feedback-issue-logs',
      icon: 'fa fa-list',
      roles: ['TICKET_ADMIN'],
      urlHome: '/home',
    },
  ];
  ngOnInit() {
    this.updateActiveTabAndBanner(this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActiveTabAndBanner(event.url);
      }
    });

    this.authService.getUserData();
    const isRestricted =
      this.milestonesService.checkIsPMO() ||
      this.milestonesService.checkIsExecutive() ||
      this.milestonesService.checkIsAdmin();
    if (!isRestricted) {
      this.milestonesService.getRemindersData();
    }
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
  private updateActiveTabAndBanner(url: string): void {
    this.updateActiveTab(url);
    this.updateBannerBasedOnRoute(url);
    this.updateShowTabs(url);
  }
  private updateBannerBasedOnRoute(url: string): void {
    if (url.includes('/archived-milestones')) {
      this.bannerDataService.updateData({
        title: 'Archived Milestones',
        text: '',
      });
    } else if (url.includes('/kpi-dashboard')) {
      this.bannerDataService.updateData({
        title: 'DT-Milestone-DI-KPIs-Integration',
        text: '',
      });
    } else {
      this.bannerDataService.updateData({ title: 'milestones', text: '' });
    }
  }

  private updateActiveTab(url: string): void {
    if (url.includes('/di-kpi-integration')) {
      this.activeTabIndex = 1;
    } else {
      this.activeTabIndex = 0;
    }
  }

  private updateShowTabs(url: string): void {
    this.showTabs = this.TAB_ROUTES_SET.has(url);
  }

  onTabChanged(tabIndex: number): void {
    this.activeTabIndex = tabIndex;

    switch (this.activeTabIndex) {
      case 0:
        this.router.navigate(['']);
        break;
      case 1:
        this.router.navigate(['/di-kpi-integration']);
        break;

      default:
        this.router.navigate(['']);
    }
  }
}
