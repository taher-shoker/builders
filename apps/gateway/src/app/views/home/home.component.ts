import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AuthService, System } from '../../shared/services/auth.service';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  apps!: System[];
  constructor(
    private cookieService: CookieService,
    public authService: AuthService
  ) {}
  ngOnInit(): void {
    this.authService.setLoggedInUser();
    this.apps = this.authService.availableSystems;
  }
}
