import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        const token = this.cookieService.get('fraud-token')
          ? JSON.parse(this.cookieService.get('fraud-token'))
          : '';

          const roles = this.cookieService.get('fraud-roles')

        const isAuth = !!user || !!token;
        if (isAuth) {
          if(route.data['permissions']){
            // route.data['permissions'].includes('')
            roles.includes(route.data['permissions']) ? true : this.router.navigate(['/unauthorized-page']);
          }
          return true;
        }
        return this.router.createUrlTree(['/login']);
      }),
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
