import { Injectable } from "@angular/core";
import { BehaviorSubject, of } from "rxjs";
import { delay, tap } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { CookieService } from "ngx-cookie";


@Injectable({
  providedIn: "root"
})
export class AuthService {

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false)
  // private _loggedInUser$ = new BehaviorSubject<object>({}) // Populate with the user interface in type and value

  isLoggedIn = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient,
  private _cookieService:CookieService) {
    const token = this._cookieService.get("token");
    console.log("Token is", !!token)
    this._isLoggedIn$.next(!!token)
  }

  login(username: string, password: string){

    return this.http.post('someString', {username, password}).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this._isLoggedIn$.next(true)
      })
    )
    // return of(false).pipe(delay(500))
  }
}
