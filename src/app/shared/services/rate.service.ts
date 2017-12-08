import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/map';

import { Http, Response } from '@angular/http';
import { Star } from '../models/rate';

@Injectable()
export class RateService {
  hostname: string;

  constructor(
    private http: Http,
    private config: ConfigService,
    private cookieService: CookieService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.hostname = config.backendHostname;
  }
  
  /**
   * Get list of stars
   * 
   * @return {Observable} An observable response
   */
  getStars(): Observable<{[id: string]: Star}> {
    return this.http.get(`/api/ratesvc/v1/stars`)
      .flatMap(this.extractData)
      .reduce((m, s: Star) => { m[s.id] = s; return m; }, {})
      .catch((e, c) => { return this.handleError(e); });
  }

  toggleStar(s: Star): void {
    let was_starred = s.has_starred;
    let stargazers_count = s.stargazers_count;
    s.has_starred = !was_starred;
    s.stargazers_count = s.has_starred ? stargazers_count + 1 : stargazers_count - 1;

    this.updateStar(s).subscribe(null, (error) => {
      // Reset star on error
      s.has_starred = was_starred;
      s.stargazers_count = stargazers_count;
    });
  }

  /**
   * Update a Star
   * 
   * @return {Observable} An observable response
   */
  updateStar(s: Star): Observable<Response> {
    return this.http.put(`/api/ratesvc/v1/stars`, s)
      .catch((e, c) => { return this.handleError(e); });
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || [];
  }

  private handleError (error: any) {
    let errorMsg = "You must be signed in to star a chart";
    this.snackBar.open(errorMsg, "Login / Sign Up", { duration: 5000 }).onAction().subscribe(() => {
      window.location.href = "/auth";
    });
    return Observable.throw(errorMsg);
  }
}
