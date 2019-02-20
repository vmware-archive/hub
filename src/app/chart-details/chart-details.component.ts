import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChartsService } from '../shared/services/charts.service';
import { RateService } from '../shared/services/rate.service';
import { Chart } from '../shared/models/chart';
import { ChartVersion } from '../shared/models/chart-version';
import { Star } from '../shared/models/rate';
import { SeoService } from '../shared/services/seo.service';
import { ConfigService } from '../shared/services/config.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chart-details',
  templateUrl: './chart-details.component.html',
  styleUrls: ['./chart-details.component.scss']
})
export class ChartDetailsComponent implements OnInit {
  /* This resource will be different, probably ChartVersion */
  chart: Chart;
  loading: boolean = true;
  currentVersion: ChartVersion;
  iconUrl: string;
  titleVersion: string;
  star: Star = new Star();

  constructor(
    private route: ActivatedRoute,
    private chartsService: ChartsService,
    private config: ConfigService,
    private seo: SeoService,
    private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public rateService: RateService,
  ) {}

  ngOnInit() {
    this.mdIconRegistry.addSvgIcon(
      'star',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/star.svg')
    );
    this.mdIconRegistry.addSvgIcon(
      'star-border',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/star-border.svg')
    );
    this.route.params.forEach((params: Params) => {
      let repo = params['repo'];
      let chartName = params['chartName'];
      let chartId = `${repo}/${chartName}`;
      this.chartsService.getChart(repo, chartName).subscribe(chart => {
        this.loading = false;
        this.chart = chart;
        let version =
          params['version'] ||
          this.chart.relationships.latestChartVersion.data.version;
        this.chartsService
          .getVersion(repo, chartName, version)
          .subscribe(chartVersion => {
            this.currentVersion = chartVersion;
            this.titleVersion = this.currentVersion.attributes.app_version || '';
            this.updateMetaTags();
          });
        this.iconUrl = this.chartsService.getChartIconURL(this.chart)
      });
      this.rateService.getStars().subscribe(stars => this.star = stars[chartId] || new Star({id: chartId}));
    });
  }

  /**
   * Update the metatags with the name and the description of the application.
   */
  updateMetaTags(): void {
    if (this.titleVersion.length > 0) {
      this.seo.setMetaTags('chartDetailsWithVersion', {
        name: this.chart.attributes.name,
        description: this.chart.attributes.description,
        version: this.titleVersion
      });
    } else {
      this.seo.setMetaTags('chartDetails', {
        name: this.chart.attributes.name,
        description: this.chart.attributes.description
      });
    }
  }

  goToRepoUrl(): string {
    return `/charts/${this.chart.attributes.repo.name}`;
  }
}
