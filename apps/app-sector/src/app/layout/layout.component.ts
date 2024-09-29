import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../services/auth.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'stc-apps-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  
  sectorName: string | undefined = '';
  navItems: any[] = [];
  constructor(
    private cookieService: CookieService,
    public router: Router,
    private authService: AuthService,
    public loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) {
    this.sectorName = this.cookieService.get('sectorName');
    console.log(this.sectorName, 'navItem');
    this.navItems = [
     
      {
        name: 'home',
        url: `/sectors/${this.sectorName}`,
        icon: 'fa-home',
        roles: ['APPROVERS,CREATORS'],
        urlHome: `/sectors/${this.sectorName}`,
      },
    ];
  }

  // urlHome = '/home';
  userName = '';
  logoSrc = 'assets/images/brand/stc-logo.png';
  sidebarLogoSrc = 'assets/images/brand/sidebar-logo.png';

  ngAfterViewInit(): void {
    this.loaderService.isLoading$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    if (
      this.cookieService.get('MODERN_SYSTEM_USER') &&
      this.cookieService.get('token')
    ) {
      this.userName = this.cookieService.get('USER_FULLNAME') || '';
      this.authService.getUserData();
      this.authService.loggedUserStream.subscribe((res) => {
        console.log(res?.userGroups);

        res?.userGroups.map((group) => {
          if (group.groupName == 'Data_Admins') {
            console.log('hey');
            let flag = false;
            this.navItems.map((item) => {
              if (item.name == 'data upload') {
                flag = true;
              }
            });
            if (!flag) {
              this.navItems.push({
                name: 'data upload',
                url: `/sectors/${this.sectorName}/data-upload`,
                icon: 'fa-upload',
                roles: ['Data_Admins'],
                urlHome: `/sectors/${this.sectorName}`,
              });
            }
          }
        });
        this.userName = res?.name || '';
      });
    }
  }

  backToHome() {
    this.router.navigate(['/']);
  }
  logOut() {
    this.authService.logout();
  }
}
