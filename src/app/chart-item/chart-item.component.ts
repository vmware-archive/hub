import { Component, OnInit } from '@angular/core';
import { Chart } from '../shared/models/chart';
import { ChartsService } from '../shared/services/charts.service';
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
    private chartsService: ChartsService,
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
    this.iconUrl = this.chartsService.getChartIconURL(this.chart)
;
    if (!this.star) {
      this.star = new Star({id: this.chart.id});
    }
  }

  goToDetailUrl(): string {
    return `/charts/${this.chart.attributes.repo.name}/${this.chart.attributes
      .name}`;
  }

  goToRepoUrl(): string {
    return `/charts/${this.chart.attributes.repo.name}`;
  }

  toggleStarred(e: any) {
    e.stopPropagation();
    this.rateService.toggleStar(this.star);
    return false;
  }
}
