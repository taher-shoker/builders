// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';
// import { catchError, map } from 'rxjs';

// export const authGuard: CanActivateFn = (route, state) => {
//   const auth = inject(AuthService);
//   const router = inject(Router);
//   constructor(public authService: AuthService, public router: Router) {}

//   // return auth
//   //   .isAuthorizedUser()
//   //   .pipe(map((isLoggedIn) => isLoggedIn || router.createUrlTree(['login'])));

//   // return auth.isLoggedIn.pipe(
//   //   map((loggedIn) =>
//   //     loggedIn
//   //       ? true
//   //       : router.createUrlTree(['login'], {
//   //           queryParams: { loggedOut: true, origUrl: state.url },
//   //         })
//   //   ),
//   //   // catchError((err) => {
//   //   //   console.error('Auth Guard Error', err);
//   //   //   router.navigate(['login'], {
//   //   //     queryParams: { loggedOut: true, origUrl: state.url },
//   //   //   });
//   //   //   return false;
//   //   // })
//   // );



//    canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
//     if (this.authService.isLoggedIn !== true) {
//       window.alert('Access Denied, Login is Required to Access This Page!');
//       this.router.navigate(['sign-in']);
//     }
//     return true;
//   }

// };




import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(public authService: AuthService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    if (this.authService.isAuthorizedUser() !== true) {
      this.router.navigate(['login']);
    }
    return true;
  }
}
