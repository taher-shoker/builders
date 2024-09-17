import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'stc-apps-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
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

  yearsArray: any = [
    { name: 2020 },
    { name: 2021 },
    { name: 2022 },
    { name: 2023 },
  ];

  constructor(
    private cookieService: CookieService,
    public router: Router,
    public loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.loaderService.isLoading$.subscribe((res) => {
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    if (
      this.cookieService.get('MODERN_SYSTEM_USER') &&
      this.cookieService.get('token')
    ) {
      this.userName = this.cookieService.get('USER_FULLNAME') || '';
    }
  }

  backToHome() {
    this.router.navigate(['/']);
  }
  logOut() {
    //apply logout action
  }
}
