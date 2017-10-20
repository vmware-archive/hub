import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';

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
      .catch(this.handleError);
  }

  /**
   * Star a chart
   * 
   * @return {Observable} An observable response
   */
  starChart(chartid: string): Observable<Response> {
    return this.http.put(`/api/ratesvc/v1/stars`, {id: chartid, has_starred: true})
      .catch(this.handleError);
  }

  /**
   * Unstar a chart
   * 
   * @return {Observable} An observable response
   */
  unstarChart(chartid: string): Observable<Response> {
    return this.http.put(`/api/ratesvc/v1/stars`, {id: chartid, has_starred: false})
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  private handleError (error: any) {
    let errorMsg = "cannot star charts when authentication is disabled";
    if (error.status == 404) {
      console.error(errorMsg);
    }
    return Observable.throw(errorMsg);
  }
}
