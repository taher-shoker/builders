import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { UserRole, UserRoles } from '../models/role.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  // private _loggedInUser$ = new BehaviorSubject<object>({}) // Populate with the user interface in type and value

  isLoggedIn = this._isLoggedIn$.asObservable();
  userRoles!: UserRole[];
  displayName: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private _cookieService: CookieService) {
    const token = this._cookieService.get('token');
    console.log('Token is', !!token);
    this._isLoggedIn$.next(!!token);

    // if(_cookieService.get('displayName')){
    //   this.displayName = _cookieService.get('displayName')!
    // }
  }

  getCurrentUserRoles(): Observable<UserRoles> {
    return this.http.get<UserRoles>(
      `${window.location.origin}/cem/reporting/apigateway/api/v2/admin/users/currentLoggedUser`
    );
  }

  setUserRoles(roles: UserRole[]): void {
    this.userRoles = roles;
  }

  // getAllSystemRoles(): Observable<UserRole[]> {
  //   const params = { params: new HttpParams().set('system', 'DI_Management') };
  //   return this.http.get<UserRole[]>(
  //     `${environment.authUrl}/cem/reporting/apigateway/api/v2/admin/users/roles`,
  //     params
  //   );
  // }

  isDiUser(): boolean {
    const user = this._cookieService.get('MODERN_SYSTEM_USER');

    if (user) {
      const parsedUser = JSON.parse(user) as UserRoles;
      this.displayName.next(parsedUser.name);
      console.warn('el user', parsedUser);

      for (const group of parsedUser.userGroups) {
        if (
          group.roles[0].system.name === 'DI_Management' &&
          ['BUs', 'FUs', 'Technology', 'ALL'].includes(group.roles[0].roleName)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  logout() {
    this._isLoggedIn$.next(false);
    this._cookieService.removeAll();
    window.location.href = window.location.origin + environment.loginPath;
  }
  // login(username: string, password: string) {
  //   return this.http.post('someString', { username, password }).pipe(
  //     tap((res: any) => {
  //       localStorage.setItem('token', res.token);
  //       this._isLoggedIn$.next(true);
  //     })
  //   );
  // return of(false).pipe(delay(500))
  // }
}
