import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { LoaderService } from '../services/loader.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'stc-apps-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  userName = '';
  logoSrc = 'assets/images/brand/stc-logo.png';
  sidebarLogoSrc = 'assets/images/brand/sidebar-logo.png';
 
  constructor(
    private cookieService: CookieService,
    public router: Router,
    public loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
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
