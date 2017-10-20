import { Component, OnInit } from '@angular/core';
import { Chart } from '../shared/models/chart';
import { Star } from '../shared/models/rate';
import { RateService } from '../shared/services/rate.service';
import { ConfigService } from '../shared/services/config.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chart-item',
  templateUrl: './chart-item.component.html',
  styleUrls: ['./chart-item.component.scss'],
  inputs: ['chart', 'showVersion', 'showDescription', 'star']
})
export class ChartItemComponent implements OnInit {
  public iconUrl: string;
  // Chart to represent
  public chart: Chart;
  // Show version form by default
  public showVersion: boolean = true;
  // Truncate the description
  public showDescription: boolean = true;
  // Star data
  public star: Star;

  constructor(
    private config: ConfigService,
    private rateService: RateService,
    private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
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
    this.iconUrl = this.getIconUrl();
    if (!this.star) {
      this.star = new Star();
    }
  }

  goToDetailUrl(): string {
    return `/charts/${this.chart.attributes.repo.name}/${this.chart.attributes
      .name}`;
  }

  goToRepoUrl(): string {
    return `/charts/${this.chart.attributes.repo.name}`;
  }

  getIconUrl(): string {
    let icons = this.chart.relationships.latestChartVersion.data.icons;
    if (icons !== undefined && icons.length > 0) {
      const icon =
        this.config.backendHostname +
        icons.find(icon => icon.name === '160x160-fit').path;
      return icon;
    } else {
      return '/assets/images/placeholder.png';
    }
  }

  toggleStarred(e: any) {
    e.stopPropagation();
    let was_starred = this.star.has_starred;
    let stargazers_count = this.star.stargazers_count;
    if (was_starred) {
      this.star.stargazers_count = stargazers_count - 1;
      this.rateService.unstarChart(this.chart.id).subscribe();
    } else {
      this.star.stargazers_count = stargazers_count + 1;
      this.rateService.starChart(this.chart.id).subscribe();
    }
    this.star.has_starred = !was_starred;
    return false;
  }
}
