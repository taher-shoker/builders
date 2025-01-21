import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TPUserModel } from '../models/TP/TPUserModel';
import { UserData, UserGroup } from '../models/users-settings.model';
import { AuthResponseData, LoggedUser, System } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl;
  loginTPUrl =
    window.location.origin === 'https://igateapp.stc.com.sa'
      ? window.location.origin + '/cem' + environment.tpLogInUrl
      : environment.tpLogInUrl;

  availableSystems!: System[];
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);

  isLoggedIn = this._isLoggedIn$.asObservable();

  user = new BehaviorSubject<User | null>(null);

  loggedInUser: LoggedUser | null = null;

  loggedUserStream: BehaviorSubject<LoggedUser | null> =
    new BehaviorSubject<LoggedUser | null>(null);
  isLoading = false;

  gratnedSystems: string[] = [];

  passedSystems: System[] = [];

  ceoRedirected = false;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

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

  /**
   * Authenticates the user with the given username and password.
   * @param data - Object containing username and password
   * @returns An Observable of the authentication response data
   */
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

  /**
   * Checks if the current user has admin role.
   * @returns True if the user has an admin role, otherwise false
   */
  isAdminUser(): boolean {
    const user = this.loggedInUser || this.cookieService.get('token');
    const isAdminRole =
      this.loggedInUser?.userGroups[0]?.roles[0]?.roleName.includes('ADMINS') ??
      false;

    return user != null && isAdminRole;
  }

  private handleAuthentication(displayName: string, token: string) {
    const user = new User(displayName, token);
    this.user.next(user);
    this.cookieService.put('token', token);
    this._isLoggedIn$.next(!!token);
  }
  setCurrentLoggedInUser = false;

  /**
   * Retrieves the current user data and handles access to various systems.
   */
  getUserData() {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.gratnedSystems = [];
    this.http
      .get<UserData>(`${this.loginTPUrl}/user/getCurrentUserData`, { headers })
      .subscribe((res: UserData) => {
        if (res.dto.systems.length == 1) {
          this.handleSingleSystemAccess(res);
        } else if (res.dto.systems.length > 1) {
          this.handleMultipleSystemAccess(res);
        } else {
          this.cookieService.removeAll();
          this.toastr.error(
            'There is something wrong; please contact the administrator'
          );
        }
        this.handleUserSystems();
      });
  }

  /**
   * Handles access for users with a single system.
   * @param res - User data response
   */
  private handleSingleSystemAccess(res: UserData) {
    if (res.dto.systems.includes('TP_DashboardUsers')) {
      this.handleTPSysNeeds(res);
      this.gratnedSystems.push('TP_DashboardUsers');
      this.router.navigate(['/apps']);
    } else if (res.dto.systems.includes('CEO_DashboardUsers')) {
      this.cookieService.put('ceo-username', res.dto.username);
      this.gratnedSystems.push('CEO_DashboardUsers');
      this.router.navigate(['/apps', res]);
    } else if (
      res.dto.systems.includes('FRAUD_ManagementUsers') ||
      res.dto.systems.includes('DI_Management') ||
      res.dto.systems.includes('DI_Milestones') ||
      res.dto.systems.includes('Dynamic_Report_Flow') ||
      res.dto.systems.includes('Business_Excellence_Dashboard') ||
      res.dto.systems.includes('Score_Card_Report_DB') ||
      res.dto.systems.includes('Strategic_Dashboard') ||
      res.dto.systems.includes('ChatBI')
    ) {
      this.handleFraudOrDIManagementAccess(res);
    }
    this.cookieService.put(
      'granted-systems',
      JSON.stringify(this.gratnedSystems)
    );
  }

  /**
   * Handles access for users with multiple systems.
   * @param res - User data response
   */
  private handleMultipleSystemAccess(res: UserData) {
    if (res.dto.systems.includes('TP_DashboardUsers')) {
      this.handleTPSysNeeds(res);
    }
    if (res.dto.systems.includes('CEO_DashboardUsers')) {
      this.cookieService.put('ceo-username', res.dto.username);
    }
    if (
      res.dto.systems.includes('FRAUD_ManagementUsers') ||
      res.dto.systems.includes('DI_Management') ||
      res.dto.systems.includes('DI_Milestones') ||
      res.dto.systems.includes('Dynamic_Report_Flow') ||
      res.dto.systems.includes('Business_Excellence_Dashboard') ||
      res.dto.systems.includes('Jira_Dahsboard') ||
      res.dto.systems.includes('Score_Card_Report_DB') ||
      res.dto.systems.includes('Strategic_Dashboard') ||
      res.dto.systems.includes('ChatBI')
    ) {
      this.setLoggedInUser();
    }
    this.gratnedSystems = res.dto.systems;
    this.cookieService.put(
      'granted-systems',
      JSON.stringify(this.gratnedSystems)
    );
    this.router.navigate(['/apps']);
  }

  /**
   * Handles access to Fraud or DI Management systems.
   * @param res - User data response
   */
  private handleFraudOrDIManagementAccess(res: UserData) {
    if (res.dto.systems.includes('FRAUD_ManagementUsers')) {
      this.gratnedSystems.push('FRAUD_ManagementUsers');
    }
    if (res.dto.systems.includes('DI_Management')) {
      this.gratnedSystems.push('DI_Management');
    }
    if (res.dto.systems.includes('DI_Milestones')) {
      this.gratnedSystems.push('DI_Milestones');
    }
    if (res.dto.systems.includes('Dynamic_Report_Flow')) {
      this.gratnedSystems.push('Dynamic_Report_Flow');
    }
    if (res.dto.systems.includes('Business_Excellence_Dashboard')) {
      this.gratnedSystems.push('Business_Excellence_Dashboard');
    }
    if (res.dto.systems.includes('Jira_Dahsboard')) {
      this.gratnedSystems.push('Jira_Dahsboard');
    }
    if (res.dto.systems.includes('Score_Card_Report_DB')) {
      this.gratnedSystems.push('Score_Card_Report_DB');
    }
    if (res.dto.systems.includes('Strategic_Dashboard')) {
      this.gratnedSystems.push('Strategic_Dashboard');
    }
    if (res.dto.systems.includes('ChatBI')) {
      this.gratnedSystems.push('ChatBI');
    }
    this.setLoggedInUser();
  }

  /**
   * Sets the logged-in user details.
   */
  setLoggedInUser(): void {
    if (!this.setCurrentLoggedInUser) {
      this.setCurrentLoggedInUser = true;
      this.cookieService.put(
        'granted-systems',
        JSON.stringify(this.gratnedSystems)
      );
      this.http
        .get<LoggedUser>(`${this.baseUrl}/users/currentLoggedUser`)
        .subscribe(async (res: LoggedUser) => {
          this.loggedInUser = res;
          this.loggedUserStream.next(res);
          this.handleSingleGrantedSystem(res);
          const userCookieData = {
            id: res.id,
            name: res.name,
            username: res.username,
            email: res.email,
            userDelegates: res.userDelegates,
            userGroups: res.userGroups,
          };
          this.cookieService.put(
            'MODERN_SYSTEM_USER',
            JSON.stringify(userCookieData)
          );
        });
    }
  }

  /**
   * Handles navigation for a single granted system.
   * @param res - Logged user response
   */
  private handleSingleGrantedSystem(res: LoggedUser) {
    if (this.gratnedSystems.length == 1) {
      console.log(res.userGroups[0].roles[0].roleName);
      if (
        res.userGroups[0].roles[0].roleName === 'ADMINS'
        // res.userGroups[0].roles[0].roleName === 'BUSINESS_USER'
      ) {
        this.router.navigate(['users-setting']);
      } else {
        this.navigateToSystem(this.gratnedSystems[0]);
      }
    } else {
      this.router.navigate(['/apps']);
    }
  }

  /**
   * Navigates to the specified system.
   * @param system - System name
   */
  private navigateToSystem(system: string) {
    const systemUrls: Record<string, string> = {
      DI_Management: environment.systems.di_system,
      FRAUD_ManagementUsers: environment.systems.fraud_system,
      DI_Milestones: environment.systems.di_milestones_system,
      Dynamic_Report_Flow: environment.systems.dynamic_rf_system,
      Business_Excellence_Dashboard:
        environment.systems.business_excellence_system,
      Score_Card_Report_DB: environment.systems.score_card_report_db,
      Strategic_Dashboard: environment.systems.strategic_dashboard,
      Chat_Bi: environment.systems.chat_bi,
    };
    const url = systemUrls[system];
    if (url) {
      // window.location.href = window.location.origin + url;
      window.location.href = url;
    } else {
      console.log('not handled system');
    }
  }

  /**
   * Retrieves all systems available to the user.
   * @returns An Observable of the available systems
   */
  getAllSystem() {
    return this.http.get<System[]>(`${this.baseUrl}/users/systems`);
  }

  /**
   * Handles the needs for TP system access.
   * @param res - User data response
   */
  handleTPSysNeeds(res: UserData) {
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
    this.cookieService.remove('generatedToken');
    this.loggedInUser = null;
    this.navigateToLogin();
  }
  navigateToLogin() {
    const routeToLogin = window.location.origin + '/cem/reporting/';
    window.location.href = routeToLogin;
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
    // this.cookieService.put('tokenType', 'Web', {
    //   // httpOnly: true,
    //   secure: true,
    // });
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
                systemUrl:
                  window.location.origin + environment.systems.tp_system,
                name: 'TP Dashboard',
                displayName: 'TP Dashboard',
                mobileView: false,
              });
              break;
            case 'CEO_DashboardUsers':
              this.passedSystems.push({
                systemUrl:
                  environment.systems.ceo_system +
                  this.cookieService.get('ceo-username'),
                name: 'CCEX Workspace',
                displayName: 'CCEX Workspace',
                mobileView: true,
              });
              break;
            case 'FRAUD_ManagementUsers':
              this.setLoggedInUser();
              this.passedSystems.push({
                systemUrl:
                  window.location.origin + environment.systems.fraud_system,
                name: 'Fraud Management Workspace',
                displayName: 'Fraud Management Workspace',
                mobileView: false,
              });
              break;
            case 'DI_Management':
              this.setLoggedInUser();
              this.passedSystems.push({
                systemUrl:
                  window.location.origin + environment.systems.di_system,
                name: 'DT Workspace',
                displayName: 'DT Workspace',
                mobileView: false,
              });
              break;
            case 'DI_Milestones':
              this.setLoggedInUser();
              this.passedSystems.push({
                systemUrl:
                  window.location.origin +
                  environment.systems.di_milestones_system,
                name: 'DT Milestones Validation',
                displayName: 'DT Milestones Validation',
                mobileView: false,
              });
              break;
            case 'Dynamic_Report_Flow':
              this.setLoggedInUser();
              this.passedSystems.push({
                systemUrl:
                  window.location.origin +
                  environment.systems.dynamic_rf_system,
                name: 'Dynamic Report Flow',
                displayName: 'Dynamic Report Flow',
                mobileView: false,
              });
              break;
            case 'Business_Excellence_Dashboard':
              this.setLoggedInUser();
              this.passedSystems.push({
                systemUrl:
                  window.location.origin +
                  environment.systems.business_excellence_system,
                name: 'Business Excellence Dashboard',
                displayName: 'Business Excellence Dashboard',
                mobileView: false,
              });
              break;
            case 'Jira_Dahsboard':
              this.setLoggedInUser();
              this.passedSystems.push({
                systemUrl:
                  window.location.origin + environment.systems.jira_system,
                name: 'Jira Dashboard',
                displayName: 'Jira Dashboard',
                mobileView: false,
              });
              break;
            case 'Score_Card_Report_DB':
              this.setLoggedInUser();
              this.passedSystems.push({
                systemUrl:
                  window.location.origin +
                  environment.systems.score_card_report_db,
                name: 'Score Card Report',
                displayName: 'Score Card Report',
                mobileView: false,
              });
              break;
            case 'Strategic_Dashboard':
              this.setLoggedInUser();
              this.passedSystems.push({
                systemUrl:
                  window.location.origin +
                  environment.systems.strategic_dashboard,
                name: 'Strategic Dashboard',
                displayName: 'Strategic Dashboard',
                mobileView: false,
              });
              break;
            case 'ChatBI':
              this.setLoggedInUser();
              this.passedSystems.push({
                systemUrl: window.location.origin + environment.systems.chat_bi,
                name: 'CEM Chat AI',
                displayName: 'CEM Chat AI',
                mobileView: true,
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
          window.location.href =
            window.location.origin + environment.systems.tp_admin_system;
        } else {
          // navigate to the app
          window.location.href =
            window.location.origin + environment.systems.tp_system;
        }
      }

      if (gratnedSystems[0] === 'CEO_DashboardUsers') {
        // the user is related to the CEO only
        // navigate to the CEO Link
        if (this.ceoRedirected == false) {
          this.ceoRedirected = true;
          window.location.href =
            environment.systems.ceo_system +
            this.cookieService.get('ceo-username');
        }
      }

      return gratnedSystems[0] ? [{ name: gratnedSystems[0] }] : [];
    }
  }
}

class User {
  constructor(public userName: string, private token: string) {}
}
