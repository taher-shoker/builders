import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProcessAdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.loggedUserStream.pipe(
      map((user) => {
        if (user && user.roles.includes('PROCESS_ADMIN')) {
          return true;
        } else {
          this.router.navigate(['../']); // Redirect to not authorized page
          return false;
        }
      })
    );
  }
}
