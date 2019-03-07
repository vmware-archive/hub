import { Component, OnInit } from '@angular/core';
import { ChartsService } from '../shared/services/charts.service';
import { Star } from '../shared/models/rate';
import { RateService } from '../shared/services/rate.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-featured-item',
  templateUrl: './featured-item.component.html',
  styleUrls: ['./featured-item.component.scss'],
})
export class FeaturedItemComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
