import { Component, OnInit } from '@angular/core';
import { ChartsService } from '../shared/services/charts.service';
import { Chart } from '../shared/models/chart';
import { SeoService } from '../shared/services/seo.service';

@Component({
  selector: 'app-chart-index',
  templateUrl: './chart-index.component.html',
  styleUrls: ['./chart-index.component.scss']
})
export class ChartIndexComponent implements OnInit {
  charts: Chart[];
  loading: boolean = true;
  totalPages: number = 0;
  page: number = 1;

  constructor(
    private chartsService: ChartsService,
    private seo: SeoService
  ) {}

  ngOnInit() {
    this.loadCharts(this.page);
    this.seo.setMetaTags('index');
  }

  loadCharts(page?: number): void {
    this.chartsService.getCharts('all', page).subscribe(res => {
      this.loading = false;
      this.charts = res.charts;
      this.totalPages = res.meta && res.meta.totalPages;
    });
  }

  onSelect = (page: number) => {
    this.page = page;
    this.loading = true;
    this.loadCharts(page);
  }
}
