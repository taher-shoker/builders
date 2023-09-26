import { Inject, Injectable, Injector, Optional } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TPUserModel } from '../models/TP/TPUserModel';

export interface AuthResponseData {
  token: string;
  displayName: string;
  result: string;
}
export interface LoggedUser {
  id: number;
  email: string;
  name: string;
  jobTitle: string;
  userGroups: UserGroup[];
  username: null | string;
}
export interface UserGroup {
  id: number;
  groupName: string;
  roles: {
    id: number;
    roleName: string;
    system: { id: number; name: string };
  }[];
}

export interface System {
  id?: number;
  name: string;
  systemUrl?: string;
  displayName?: string;
  tpGroupedMenuId?: number;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl;
  loginTPUrl = environment.tpLogInUrl;

  availableSystems!: System[];
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);

  isLoggedIn = this._isLoggedIn$.asObservable();

  user = new BehaviorSubject<any>(null);

  loggedInUser!: LoggedUser | null;

  loggedUserStream: BehaviorSubject<LoggedUser | null> =
    new BehaviorSubject<LoggedUser | null>(null);
  isLoading = false;

  gratnedSystems: string[] = [];

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    // const token = this.cookieService.get('token')
    //   ? this.cookieService.get('token')
    //   : '';
    // this._isLoggedIn$.next(!!token);
    // if (token) {
    //   this.getUserData();
    // }
  }

  getLoggedInUser(): BehaviorSubject<LoggedUser | null> {
    return this.loggedUserStream;
  }
  isAuthorizedUser(): boolean {
    const user =
      this.getLoggedInUser().getValue() || this.cookieService.get('token');
    if (user == null) {
      return false;
    } else {
      return true;
    }
  }

  login(data: { username: string; password: string }) {
    return this.http
      .post<AuthResponseData>(`${this.loginTPUrl}/user/authenticate`, data)
      .pipe(
        tap((resData: AuthResponseData) => {
          this.handleAuthentication(resData.displayName, resData.token);
          this.getUserData();
        })
      );
  }

  ssoLogin() {
    return this.http
      .post<any>(
        `http://localhost:7080/administration/saml/login`,
        { username: "mohfibrahim.c@stc.com.sa", password: "cem@123456" }
      )
      .pipe(
        tap((resData: any) => {
          console.log("SSO",resData)

        })
      );
  }

  isAdminUser() {
    const user =
      this.getLoggedInUser().getValue() || this.cookieService.get('token');

    const isAdminRole = this.loggedUserStream
      .getValue()
      ?.userGroups[0].roles[0].roleName.includes('ADMINS');

    if (user != null && isAdminRole == true) {
      return true;
    } else {
      return false;
    }
  }
  private handleAuthentication(displayName: string, token: string) {
    const user = new User(displayName, token);
    this.user.next(user);
    this.cookieService.put('token', token);
    this.cookieService.put('displayName', displayName);
    this._isLoggedIn$.next(!!token);
  }

  getUserData() {
    this.gratnedSystems = [];
    this.http
      .get<any>(`${this.loginTPUrl}/user/getCurrentUserData`)
      .subscribe((res: any) => {
        if (res.dto.systems.length == 1) {
          if (res.dto.systems.includes('TP_DashboardUsers')) {
            // checking if the user has TP access to handle the needs
            this.handleTPSysNeeds(res);
            this.gratnedSystems.push('TP_DashboardUsers');
            this.cookieService.put(
              'granted-systems',
              JSON.stringify(this.gratnedSystems)
            );
            this.router.navigate(['/apps']);
          }

          if (res.dto.systems.includes('CEO_DashboardUsers')) {
            this.cookieService.put('ceo-username', res.dto.username);
            this.gratnedSystems.push('CEO_DashboardUsers');

            this.cookieService.put(
              'granted-systems',
              JSON.stringify(this.gratnedSystems)
            );
            this.router.navigate(['/apps', res]);
          }

          if (
            res.dto.systems.includes('FRAUD_ManagementUsers') ||
            res.dto.systems.includes('DI_Management')
          ) {
            // checking if the user has fraud or DI access to handle the needs
            if (res.dto.systems.includes('FRAUD_ManagementUsers')) {
              this.gratnedSystems.push('FRAUD_ManagementUsers');
            }
            if (res.dto.systems.includes('DI_Management')) {
              this.gratnedSystems.push('DI_Management');
            }

            this.setLoggedInUser();
          }
        } else if (res.dto.systems.length > 1) {
          if (res.dto.systems.includes('TP_DashboardUsers')) {
            this.handleTPSysNeeds(res);
          }
          if (res.dto.systems.includes('CEO_DashboardUsers')) {
            this.cookieService.put('ceo-username', res.dto.username);
          }

          if (
            res.dto.systems.includes('FRAUD_ManagementUsers') ||
            res.dto.systems.includes('DI_Management')
          ) {
            this.setLoggedInUser();
          }

          this.gratnedSystems = res.dto.systems;
          this.cookieService.put(
            'granted-systems',
            JSON.stringify(this.gratnedSystems)
          );
          // eslint-disable-next-line no-debugger
          debugger;
          this.router.navigate(['/apps']);

          //  this.setLoggedInUser();
        } else {
          this.cookieService.removeAll();
          this.toastr.error(
            'There is something wrong; please contact the administrator'
          );
        }
      });
  }

  setLoggedInUser(): void {
    this.http
      .get<LoggedUser>(`${this.baseUrl}/users/currentLoggedUser`)
      .subscribe(async (res: LoggedUser) => {
        this.loggedInUser = res;
        this.loggedUserStream.next(res);
        this.cookieService.put('USER_FULLNAME', res.name);
        await this.cookieService.put('MODERN_SYSTEM_USER', JSON.stringify(res));

        this.setAvailableSystems(res);

        this.cookieService.put(
          'granted-systems',
          JSON.stringify(this.gratnedSystems)
        );
        // eslint-disable-next-line no-debugger
        debugger;
        this.router.navigate(['/apps']);
      });
  }

  getAllSystem() {
    return this.http.get<System[]>(`${this.baseUrl}/users/systems`);
  }

  setAvailableSystems(res: LoggedUser, tpUser?: TPUserModel) {
    this.getAllSystem().subscribe((resSys) => {
      this.filterSys(resSys, res);
      if (this.availableSystems.length === 1) {
        if (this.availableSystems[0].name === 'FRAUD_ManagementUsers') {
          this.handleFraudSysNeeds(res);
          // this.navigateToLFraudPages();
        } else if (this.availableSystems[0].name === 'DI_Management') {
          this.handleDiDashboardSysNeeds(res);
          // this.navigateToLDIPages();
        } else {
          if (tpUser) {
            console.log('User have permission to TP or CEO');
          }
        }
      } else {
        // eslint-disable-next-line no-debugger
        debugger;
        this.router.navigate(['/apps']);
      }
    });
  }

  // function to handle TP
  handleTPSysNeeds(res: any) {
    const TPUserMode: TPUserModel = {
      username: res.dto.username,
      token: this.cookieService.get('token') || '',
      value: res.dto.username,
      userTeam: res.dto.username,
      displayName: res.dto.displayName,
      usermenu: [],
      tokenType: this.cookieService.get('tokenType') || '',
      systems: ['TP_DashboardUsers'],
    };
    this.applyUserValuesCookies(TPUserMode);

    this.cookieService.put('tp-role', res.dto.userRole.environmentName);
  }

  // function to handle Fraud Management System
  handleFraudSysNeeds(res: LoggedUser) {
    this.cookieService.put('fraud-roles', res.userGroups[0].roles[0].roleName);
    this.cookieService.put('fraud-user', JSON.stringify(res));
    this.cookieService.put(
      'system',
      JSON.stringify(res.userGroups[0].roles[0].system.name)
    );

    this.cookieService.put(
      'login-path',
      JSON.stringify(window.location.origin)
    );
  }

  // function to handle navigate Fraud Management System
  // navigateToLFraudPages() {
  //   if (
  //     this.loggedUserStream?.getValue()?.userGroups[0].roles[0].roleName ===
  //     'ADMINS'
  //   ) {
  //     this.router.navigate(['users-setting']);
  //   } else {
  //     window.location.href = this.availableSystems[0]?.systemUrl
  //       ? this.availableSystems[0]?.systemUrl
  //       : 'http://localhost:51635/#/home';
  //   }
  // }

  // function to handle DI Dashboard System
  handleDiDashboardSysNeeds(res: LoggedUser) {
    this.cookieService.put('di-roles', res.userGroups[0].roles[0].roleName);
    this.cookieService.put('di-user', JSON.stringify(res));
    this.cookieService.put(
      'system',
      JSON.stringify(res.userGroups[0].roles[0].system.name)
    );

    this.cookieService.put(
      'login-path',
      JSON.stringify(window.location.origin)
    );
  }
  // function to handle navigate DI System
  // navigateToLDIPages() {
  //   if (
  //     this.loggedUserStream?.getValue()?.userGroups[0].roles[0].roleName ===
  //     'ADMINS'
  //   ) {
  //     this.router.navigate(['users-setting']);
  //   } else {
  //     window.location.href = this.availableSystems[0]?.systemUrl
  //       ? this.availableSystems[0]?.systemUrl
  //       : 'http://localhost:51635/#/home';
  //   }
  // }

  // function to Filter All system according to loged user Fraud
  filterSys(allSys: System[], res: LoggedUser) {
    const filteredSys: System[] = [];
    allSys?.forEach((ele1: System) => {
      res.userGroups?.forEach((ele2: UserGroup) => {
        ele1.name === ele2.roles[0].system.name && filteredSys.push(ele1);
      });
    });
    this.availableSystems = filteredSys;
  }

  logout() {
    this.user.next(null);
    this.cookieService.remove('token');
    this.loggedInUser = null;
    this.navigateToLogin();
  }
  navigateToLogin() {
    if (environment.production) {
      const routeToLogin = window.location.origin + '/cem/reporting/#/login';
      window.location.href = routeToLogin;
    } else {
      this.router.navigate(['/login']);
    }
  }

  // adding token to simulate TP system
  applyUserValuesCookies(user: TPUserModel) {
    console.log('user', user);
    this.cookieService.put('username', user.username, {
      // httpOnly: true,
      secure: true,
    });
    this.cookieService.put('token', user.token, {
      // httpOnly: true,
      secure: true,
    });
    this.cookieService.put('displayName', user.displayName, {
      // httpOnly: true,
      secure: true,
    });
    this.cookieService.put('userTeam', user.userTeam, {
      // httpOnly: true,
      secure: true,
    });
    this.cookieService.put('tokenType', 'Web', {
      // httpOnly: true,
      secure: true,
    });
  }
  // create TP model from token
  createUserModelFromCookies(): TPUserModel {
    const userModel: TPUserModel = {
      username: this.cookieService.get('username') || '',
      token: this.cookieService.get('token') || '',
      value: this.cookieService.get('username') || '',
      userTeam: this.cookieService.get('username') || '',
      displayName: this.cookieService.get('username') || '',
      usermenu: [],
      tokenType: this.cookieService.get('tokenType') || '',
      systems: ['TP_DashboardUsers'],
    };
    return userModel;
  }
}

class User {
  constructor(public userName: string, private token: string) {}
}
