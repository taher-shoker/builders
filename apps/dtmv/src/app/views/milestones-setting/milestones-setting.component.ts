import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-milestones-setting',
  templateUrl: './milestones-setting.component.html',
  styleUrls: ['./milestones-setting.component.scss'],
})
export class MilestonesSettingComponent {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    public router: Router
  ) {}
}
