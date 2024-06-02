import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-dy-reports',
  templateUrl: './dy-reports.component.html',
  styleUrls: ['./dy-reports.component.scss'],
})
export class DyReportsComponent {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    public router: Router
  ) {}
}
