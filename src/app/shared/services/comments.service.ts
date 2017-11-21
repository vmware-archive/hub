import { Injectable } from '@angular/core';

import { ConfigService } from './config.service';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/map';

import { Http, Response } from '@angular/http';
import { Comment } from '../models/comment';

@Injectable()
export class CommentsService {
  hostname: string;

  constructor(
    private http: Http,
    private config: ConfigService
  ) {
    this.hostname = config.backendHostname;
  }

  /**
   * Get list of comments
   *
   * @return {Observable} An observable response
   */
  getComments(repo: string, chartName: string): Observable<Comment[]> {
    return this.http.get(`/api/ratesvc/v1/comments/${repo}/${chartName}`, {withCredentials: true})
      .map(this.extractData)
      .catch(this.handleError);
  }

  createComment(repo: string, chartName: string, comment: Comment): Observable<Comment> {
    return this.http.post(`/api/ratesvc/v1/comments/${repo}/${chartName}`, comment, {withCredentials: true})
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteComment(repo: string, chartName: string, id: string): Observable<Comment> {
    return this.http.delete(`/api/ratesvc/v1/comments/${repo}/${chartName}/${id}`, {withCredentials: true})
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
