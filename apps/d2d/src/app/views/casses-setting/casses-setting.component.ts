import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-casses-setting',
  templateUrl: './casses-setting.component.html',
  styleUrls: ['./casses-setting.component.scss'],
})
export class CassesSettingComponent {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    public router: Router
  ) {}
}
