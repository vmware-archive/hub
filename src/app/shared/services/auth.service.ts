import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/map';

import { Http, Response } from '@angular/http';

/* TODO, This is a mocked class. */
@Injectable()
export class AuthService {
  user: any = {};

  constructor(
    private http: Http,
    private config: ConfigService,
    private cookieService: CookieService,
    private router: Router,
  ) {
  }

  /**
   * Get the details of the logged in user
   *
   * @return {Observable} An observable object with the user info
   */
  getUser(): Observable<any> {
    let userClaims = this.cookieService.get("ka_claims");
    if (userClaims) {
      // parse as unicode string (see: https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem)
      return JSON.parse(decodeURIComponent(atob(userClaims).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));
    }
  }

  /**
   * Check if logged in on the API server
   *
   * @return {Observable} An observable boolean that will be true if logged in or if auth is disabled
   */
  loggedIn(): Observable<boolean> {
    return this.http.get('/auth/verify', {withCredentials: true})
      .map((res: Response) => { return res.ok; })
      .catch(res => {
        if (res.status == 404) {
          // If 404, authentication is disabled on the API server and we are considered logged in
          return Observable.of(true);
        } else {
          return Observable.of(false);
        }
      });
  }

  /**
   * Logs user out
   */
  logout(): Observable<Response> {
    this.cookieService.remove('ka_claims');
    return this.http.delete('/auth/logout', {withCredentials: true});
  }
}
