import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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
  id: number;
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

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private toastr: ToastrService
  ) {
    const token = this.cookieService.get('token')
      ? this.cookieService.get('token')
      : '';
    this._isLoggedIn$.next(!!token);

    if (token) {
      this.getUserData();
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

  isAdminUser() {
    return this.loggedUserStream
      .getValue()
      ?.userGroups[0].roles[0].roleName.includes('ADMINS');
  }
  private handleAuthentication(displayName: string, token: string) {
    const user = new User(displayName, token);
    this.user.next(user);
    this.cookieService.put('token', token);
    this.cookieService.put('displayName', displayName);
    this._isLoggedIn$.next(!!token);
  }

  getUserData() {
    const specialSys = ['FRAUD_ManagementUsers', 'DI_Management'];
    this.http
      .get<any>(`${this.loginTPUrl}/user/getCurrentUserData`)
      .subscribe((res: any) => {
        if (res.dto.systems.length > 0) {
          if (specialSys.some((o) => res.dto.systems.includes(o))) {
            this.setLoggedInUser();
            this.router.navigate(['/apps']);
          }
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
      .subscribe((res: LoggedUser) => {
        this.loggedInUser = res;
        this.loggedUserStream.next(res);
        this.setAvailableSystems(res);
      });
  }

  getAllSystem() {
    return this.http.get<System[]>(`${this.baseUrl}/users/systems`);
  }

  setAvailableSystems(res: LoggedUser) {
    this.getAllSystem().subscribe((resSys) => {
      this.filterSys(resSys, res);
      if (this.availableSystems.length === 1) {
        if (this.availableSystems[0].name === 'FRAUD_ManagementUsers') {
          this.handleFraudSys(res);
        } else if (this.availableSystems[0].name === 'DI_Management') {
          this.handleDiDashboardSys(res);
        } else {
          console.log('User have permision for CEO dashborad app');
        }
      } else {
        this.router.navigate(['/apps']);
      }
    });
  }

  // function to handle Fraud Management System
  handleFraudSys(res: LoggedUser) {
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
    this.navigateToLFraudPages();
  }

  // function to handle navigate Fraud Management System
  navigateToLFraudPages() {
    if (
      this.loggedUserStream?.getValue()?.userGroups[0].roles[0].roleName ===
      'ADMINS'
    ) {
      this.router.navigate(['users-setting']);
    } else {
      window.location.href = this.availableSystems[0]?.systemUrl
        ? this.availableSystems[0]?.systemUrl
        : 'http://localhost:51635/#/home';
    }
  }

  // function to handle DI Dashboard System
  handleDiDashboardSys(res: LoggedUser) {
    console.log('User have permision for DI dashborad app', res);
  }

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
      const routeToLogin = window.location.origin + '/cem/reporting/login';
      window.location.href = routeToLogin;
    } else {
      this.router.navigate(['/login']);
    }
  }
}

class User {
  constructor(public userName: string, private token: string) {}
}
