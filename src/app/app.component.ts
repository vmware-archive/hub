import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ChartsService } from './shared/services/charts.service';
import { ConfigService } from './shared/services/config.service';
import { SeoService } from './shared/services/seo.service';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ChartsService]
})
export class AppComponent implements OnInit {
  // Config
  public config;
  public loggedIn: boolean = false;

  constructor(
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    config: ConfigService,
    private router: Router,
    private seo: SeoService,
    private authService: AuthService,
  ) {
    this.config = config;
  }

  ngOnInit() {
    this.authService.loggedIn().subscribe(loggedIn => { this.loggedIn = loggedIn; });
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      window.location.reload();
    });
  }
}
