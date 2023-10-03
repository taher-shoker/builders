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

  passedSystems: System[] = [];

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
    this.availableSystems = [];
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
      .post<any>(`http://localhost:7080/administration/saml/login`, {
        username: 'mohfibrahim.c@stc.com.sa',
        password: 'cem@123456',
      })
      .pipe(
        tap((resData: any) => {
          console.log('SSO', resData);
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

          this.handleUserSystems();
        } else if (res.dto.systems.length > 1) {
          this.loggedInUser = {
            name: res.dto.displayName,
            id: res.dto.id,
            email: res.dto.username,
            username: res.dto.username,
            jobTitle: '',
            userGroups: res.dto.userGroupedMenusDTO,
          };
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
          this.router.navigate(['/apps']);

          //  this.setLoggedInUser();
          this.handleUserSystems();
        } else {
          this.cookieService.removeAll();
          this.toastr.error(
            'There is something wrong; please contact the administrator'
          );
        }
      });
  }

  setLoggedInUser(): void {
    this.cookieService.put(
      'granted-systems',
      JSON.stringify(this.gratnedSystems)
    );
    this.http
      .get<LoggedUser>(`${this.baseUrl}/users/currentLoggedUser`)
      .subscribe(async (res: LoggedUser) => {
        this.loggedInUser = res;
        this.loggedUserStream.next(res);
        // this.cookieService.put('USER_FULLNAME', res.name);
        this.cookieService.put('MODERN_SYSTEM_USER', JSON.stringify(res));

        this.handleSystemsNeeds(res);

        if (this.gratnedSystems.length == 1) {
          if (res.userGroups[0].roles[0].roleName === 'ADMINS') {
            this.router.navigate(['users-setting']);
          } else {
            if (this.gratnedSystems[0] == 'DI_Management') {
              window.location.href = environment.systems.di_system;
            } else if (this.gratnedSystems[0] == 'FRAUD_ManagementUsers') {
              window.location.href = environment.systems.fraud_system;
            } else {
              console.log('not handled system');
            }
          }
        } else {
          this.router.navigate(['/apps']);
        }
      });
  }

  getAllSystem() {
    return this.http.get<System[]>(`${this.baseUrl}/users/systems`);
  }

  handleSystemsNeeds(res: LoggedUser, tpUser?: TPUserModel) {
    this.getAllSystem().subscribe((resSys) => {
      this.filterSys(resSys, res);
      if (this.availableSystems.length === 1) {
        if (this.availableSystems[0].name === 'FRAUD_ManagementUsers') {
          //this.handleFraudSysNeeds(res);
          // this.navigateToLFraudPages();
        } else if (this.availableSystems[0].name === 'DI_Management') {
          // this.handleDiDashboardSysNeeds(res);
          // this.navigateToLDIPages();
        } else {
          if (tpUser) {
            console.log('User have permission to TP or CEO');
          }
        }
      } else {
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

  handleUserSystems(): System[] {
    this.passedSystems = [];
    // the user has access to legacy systems TP or CEO
    const gratnedSystems: string[] = JSON.parse(
      this.cookieService.get('granted-systems') || ''
    );

    if (gratnedSystems.length > 1) {
      if (gratnedSystems) {
        gratnedSystems.forEach((system) => {
          switch (system) {
            case 'TP_DashboardUsers':
              this.passedSystems.push({
                systemUrl: environment.systems.tp_system,
                name: 'TP Dashboard',
                displayName: 'TP Dashboard',
              });
              break;
            case 'CEO_DashboardUsers':
              this.passedSystems.push({
                systemUrl:
                  environment.systems.ceo_system +
                  this.cookieService.get('ceo-username'),
                name: 'CCEX Workspace',
                displayName: 'CCEX Workspace',
              });
              break;
            case 'FRAUD_ManagementUsers':
              this.setLoggedInUser();
              this.passedSystems.push({
                systemUrl: environment.systems.fraud_system,
                name: 'Fraud Management Workspace',
                displayName: 'Fraud Management Workspace',
              });
              break;
            case 'DI_Management':
              this.setLoggedInUser();
              this.passedSystems.push({
                systemUrl: environment.systems.di_system,
                name: 'DT Workspace',
                displayName: 'DT Workspace',
              });
              break;
            default:
              break;
          }
        });

        return this.passedSystems;
      }
      return [];
    } else {
      // navigate to the system directly after checking the user role
      if (gratnedSystems[0] === 'TP_DashboardUsers') {
        // the user is related to the TP only
        if (this.cookieService.get('tp-role') === 'ADMIN_TECHNICAL') {
          // navigate to the admin module
          window.location.href = environment.systems.tp_admin_system;
        } else {
          // navigate to the app
          window.location.href = environment.systems.tp_system;
        }
      }

      if (gratnedSystems[0] === 'CEO_DashboardUsers') {
        // the user is related to the CEO only
        // navigate to the CEO Link
        window.location.href =
          environment.systems.ceo_system +
          this.cookieService.get('ceo-username');
      }

      // console.log(
      //   this.getLoggedInUser().getValue()?.userGroups[0].roles[0].roleName
      // );
      // if (gratnedSystems[0] === 'FRAUD_ManagementUsers') {
      //   // the user is related to the Fraud only
      //   if (
      //     this.getLoggedInUser().getValue()?.userGroups[0].roles[0].roleName ===
      //     'ADMINS'
      //   ) {
      //     // this.router.navigate(['users-setting']);
      //   } else {
      //     // window.location.href = environment.systems.fraud_system; //'http://localhost:9001/';
      //   }
      // }

      // if (gratnedSystems[0] === 'DI_Management') {
      //   // the user is related to the Fraud only
      //   if (
      //     this.getLoggedInUser().getValue()?.userGroups[0].roles[0].roleName ===
      //     'ADMINS'
      //   ) {
      //     // this.router.navigate(['users-setting']);
      //   } else {
      //     // window.location.href = environment.systems.di_system; //'http://localhost:9001/';
      //   }
      // }

      return [{ name: gratnedSystems[0] }];
    }
  }
}

class User {
  constructor(public userName: string, private token: string) {}
}
