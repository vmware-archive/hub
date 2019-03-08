import { Injectable } from '@angular/core';
import { Chart } from '../models/chart';
import { ChartVersion } from '../models/chart-version';
import { ConfigService } from './config.service';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/map';

import { Http, Response } from '@angular/http';

/* TODO, This is a mocked class. */
@Injectable()
export class ChartsService {
  hostname: string;
  cacheCharts: {[key: string]: {charts: Chart[], meta: any}};

  constructor(
    private http: Http,
    private config: ConfigService
  ) {
    this.hostname = `${config.backendHostname}/chartsvc`;
    this.cacheCharts = {};
  }

  requestCharts(url: string, cacheKey: string): Observable<{charts: Chart[], meta: any}> {
    if (this.cacheCharts[cacheKey]) {
      return Observable.create((observer) => {
        observer.next(this.cacheCharts[cacheKey]);
      });
    } else {
      return this.http.get(url, {withCredentials: true})
                    .map((res) => {
                      const body = res.json();
                      this.storeCache({charts: body.data, meta: body.meta}, cacheKey);
                      return {charts: body.data, meta: body.meta};
                    })
                    .catch(this.handleError);
    }
  }

  /**
   * Get all charts from the API
   *
   * @return {Observable} An observable that will an array with all Charts
   */
  getCharts(repo: string = 'all', page: number = 1): Observable<{charts: Chart[], meta: any}> {
    const url = repo === 'all' ?
      `${this.hostname}/v1/charts?size=36&page=${page}` :
      `${this.hostname}/v1/charts/${repo}?size=36&page=${page}`;
    const cacheKey = `${repo}/${page}`;
    return this.requestCharts(url, cacheKey);
  }

  /**
   * Get a chart using the API
   *
   * @param {string} repo Repository name
   * @param {string} chartName Chart name
   * @return {Observable} An observable that will a chart instance
   */
  getChart(repo: string, chartName: string): Observable<Chart> {
    // Transform Observable<Chart[]> into Observable<Chart>[]
    return this.http.get(`${this.hostname}/v1/charts/${repo}/${chartName}`, {withCredentials: true})
                  .map(this.extractData)
                  .catch(this.handleError);
  }

  searchCharts(query, repo?: string): Observable<Chart[]> {
    const url = repo ?
      `${this.hostname}/v1/charts/${repo}/search?q=${query}` :
      `${this.hostname}/v1/charts/search?q=${query}`;
    const cacheKey = `${repo}/${query}`;
    return this.requestCharts(url, cacheKey).map(res => res.charts);
  }

  arrayMatch(keywords: string[], re): boolean {
    if(!keywords) return false

    return keywords.some((keyword) => {
      return !!keyword.match(re)
    })
  }

  /**
   * Get a chart Readme using the API
   *
   * @param {string} repo Repository name
   * @param {string} chartName Chart name
   * @param {string} version Chart version
   * @return {Observable} An observable that will be a chartReadme
   */
  getChartReadme(chartVersion: ChartVersion): Observable<Response> {
    return this.http.get(`${this.hostname}${chartVersion.attributes.readme}`)
  }
  /**
   * Get chart versions using the API
   *
   * @param {string} repo Repository name
   * @param {string} chartName Chart name
   * @return {Observable} An observable containing an array of ChartVersions
   */
  getVersions(repo: string, chartName: string): Observable<ChartVersion[]> {
    return this.http.get(`${this.hostname}/v1/charts/${repo}/${chartName}/versions`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /**
   * Get chart version using the API
   *
   * @param {string} repo Repository name
   * @param {string} chartName Chart name
   * @return {Observable} An observable containing an array of ChartVersions
   */
  getVersion(repo: string, chartName: string, version: string): Observable<ChartVersion> {
    return this.http.get(`${this.hostname}/v1/charts/${repo}/${chartName}/versions/${version}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /**
   * Get the URL for retrieving the chart's icon
   *
   * @param {Chart} chart Chart object
   */
  getChartIconURL(chart: Chart): string {
    if (chart.attributes.icon) {
      return `${this.hostname}${chart.attributes.icon}`;
    } else {
      return '/assets/images/placeholder.png';
    }
  }

  /**
   * Store the charts in the cache
   *
   * @param {Chart[]} data Elements in the response
   * @return {Chart[]} Return the same response
   */
  private storeCache(data: {charts: Chart[], meta: any}, key: string): {charts: Chart[], meta: any} {
    this.cacheCharts[key] = data;
    return data;
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
