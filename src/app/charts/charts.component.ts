import { Component, OnInit } from '@angular/core';
import { ChartsService } from '../shared/services/charts.service';
import { ReposService } from '../shared/services/repos.service';
import { Chart } from '../shared/models/chart';
import { Repo, RepoAttributes } from '../shared/models/repo';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SeoService } from '../shared/services/seo.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  viewProviders: [MatIconRegistry]
})
export class ChartsComponent implements OnInit {
  charts: Chart[] = [];
  orderedCharts: Chart[] = [];
  loading: boolean = true;
  searchTerm: string;
  searchTimeout: any;
  filtersOpen: boolean = false;

  // Default filters
  filters = [
    {
      title: 'Repository',
      onSelect: i => this.onSelectRepo(i),
      items: [{ title: 'all', value: 'all', selected: true }]
    },
    {
      title: 'Order By',
      onSelect: i => this.onSelectOrderBy(i),
      items: [
        { title: 'Name', value: 'name', selected: true },
        { title: 'Created At', value: 'created', selected: false }
      ]
    }
  ];

  // Order elements
  orderBy: string = 'name';

  // Repos
  repoName: string;

  totalPages: number = 0;
  page: number = 1;

  constructor(
    private chartsService: ChartsService,
    private reposService: ReposService,
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.mdIconRegistry.addSvgIcon(
      'search',
      this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/search.svg`)
    );
    this.mdIconRegistry.addSvgIcon(
      'close',
      this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/close.svg`)
    );
    this.mdIconRegistry.addSvgIcon(
      'menu',
      this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/menu.svg`)
    );
    this.route.queryParams.forEach((params: Params) => {
      this.searchTerm = params['q'] ? params['q'] : undefined;
      if (this.searchTerm) {
        this.searchCharts();
      }
    });
    this.route.params.forEach((params: Params) => {
      this.repoName = params['repo'] ? params['repo'] : undefined;
      this.updateMetaTags();
      this.loadRepos();
      if (!this.searchTerm) {
        // If we have already search some chart, don't reload
        this.loadCharts();
      }
    });
  }

  loadCharts(page?: number): void {
    this.chartsService.getCharts(this.repoName, page).subscribe(res => {
      this.loading = false;
      this.charts = res.charts;
      this.totalPages = res.meta && res.meta.totalPages;
      if (!this.searchTerm) {
        this.orderedCharts = this.orderCharts(this.charts);
      }
    });
  }

  loadRepos(): void {
    this.reposService.getRepos().subscribe(repos => {
      // Ensure the "all" link is appended to the list of repos
      repos = [{ name: 'all', url: '' }, ...repos ];
      this.filters[0].items = repos.map(r => ({
        title: r.name,
        value: r.name,
        selected: this.repoName ? r.name == this.repoName : r.name == 'all'
      }));
    });
  }

  onSelectRepo(index) {
    this.repoName = this.filters[0].items[index].value;
    this.filters[0].items = this.filters[0].items.map(r => {
      r.selected = r.value == this.repoName;
      return r;
    });
    this.router.navigate(
      ['/charts', this.repoName === 'all' ? '' : this.repoName],
      { replaceUrl: true }
    );
  }

  onSelectOrderBy(index) {
    this.orderBy = this.filters[1].items[index].value;
    this.filters[1].items = this.filters[1].items.map(o => {
      o.selected = o.value == this.orderBy;
      return o;
    });
    this.orderedCharts = this.orderCharts(this.orderedCharts);
  }

  searchChange(e) {
    this.searchTerm = e.target.value;
    clearTimeout(this.searchTimeout);
    if (!this.searchTerm) {
      // Reload state before search
      this.loadCharts(this.page);
      return;
    }
    this.searchTimeout = setTimeout(() => this.searchCharts(), 1000);
  }

  searchCharts() {
    if (!this.searchTerm) {
      return false;
    }
    this.loading = true;
    this.chartsService
      .searchCharts(this.searchTerm, this.repoName)
      .subscribe(charts => {
        this.loading = false;
        this.orderedCharts = this.orderCharts(charts);
        // Remove pagination when doing a search
        this.totalPages = 0;
      });
  }

  // Sort charts
  orderCharts(charts): Chart[] {
    switch (this.orderBy) {
      case 'created': {
        return charts.sort(this.sortByCreated).reverse();
      }
      default: {
        return charts.sort((a, b) =>
          a.attributes.name.localeCompare(b.attributes.name)
        );
      }
    }
  }

  sortByCreated(a: Chart, b: Chart) {
    let aVersion = a.relationships.latestChartVersion.data;
    let bVersion = b.relationships.latestChartVersion.data;
    if (aVersion.created < bVersion.created) {
      return -1;
    } else if (aVersion.created > bVersion.created) {
      return 1;
    }
    return 0;
  }

  updateMetaTags(): void {
    if (this.repoName) {
      this.seo.setMetaTags('repoCharts', {
        repo: this.capitalize(this.repoName)
      });
    } else {
      this.seo.setMetaTags('charts');
    }
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  onSelect = (page: number) => {
    this.page = page;
    this.loading = true;
    this.loadCharts(page);
  }
}
