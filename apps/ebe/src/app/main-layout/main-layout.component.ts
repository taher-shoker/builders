import { Component, inject, OnInit } from '@angular/core';
import { ScorecardService } from '../services/scorecard.service';
import { CookieService } from 'ngx-cookie';
import { NavLinks, UserModel } from '../models/scorecard.model';
@Component({
  selector: 'stc-apps-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit{
  logoSrc!:string;
  userName!:string;
  userNameLogo!:string;
  isChanged = false;
  scorecardService = inject(ScorecardService);
  cookieService = inject(CookieService)
  navItems!:NavLinks[];
  ngOnInit(): void {
    this.logoSrc = 'assets/images/stc-logo.svg';
    this.userNameLogo = 'assets/images/username-logo.svg';
    this.navItems = this.scorecardService.getNavLinks();
    // this.getUserDetails()
    // this.userName = this.cookieService.get('USER_FULLNAME') || '';
    console.log(this.userName);
    // const token = this.cookieService.get("token")
    // if(token)
    // {
    //   const username = this.decodeToken(token);
    //   console.log(username)
    //   this.userName = username.sub;
    // }
  }
  private getUserDetails()
  {
    this.scorecardService.getCurrentUserInfo().subscribe({
      next :(res:UserModel) => {
        this.userName = res.dto.username;
        this.scorecardService.setUsername(res.dto.displayName);
      }
    })
  }
  getCurrentMode(mode:'editMode' | 'viewMode')
  {
    this.scorecardService.setEditMode(mode);
  }
  decodeToken (token:string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }
}
