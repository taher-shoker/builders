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
  scoreCardName = window.history.state.scoreCardName;
  constructor(
    private cookieService: CookieService,
    public router: Router,
    private authService: AuthService,
    public loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) {}

  urlHome = '/home';
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
    {
      name: 'data upload',
      url: '/data-upload',
      icon: 'fa-upload',
      roles: ['APPROVERS'],
      urlHome: '/home',
    },
  ];

  ngAfterViewInit(): void {
    this.loaderService.isLoading$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    //this.userName='Habiba';
    if (
      this.cookieService.get('MODERN_SYSTEM_USER') &&
      this.cookieService.get('token')
    ) {
      this.userName = this.cookieService.get('USER_FULLNAME') || '';
      this.authService.getUserData();
      this.authService.loggedUserStream.subscribe((res) => {
        this.userName = res?.name || '';
      });
    }
  }

  backToHome() {
    this.router.navigate(['/']);
  }
  logOut() {
    // this.authService.logout();
  }
}
