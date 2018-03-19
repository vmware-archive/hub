import { Component, OnInit, Input } from '@angular/core';
import { Chart } from '../shared/models/chart';
import { Star } from '../shared/models/rate';
import { RateService } from '../shared/services/rate.service';

@Component({
  selector: 'app-chart-list',
  templateUrl: './chart-list.component.html',
  styleUrls: ['./chart-list.component.scss']
})
export class ChartListComponent implements OnInit {
  @Input() charts: Chart[];
  @Input() maxColumns: Number = 4;
  stars: { [id: string]: Star } = {};

  constructor(private rateSvc: RateService) {}

  ngOnInit() {
    this.rateSvc.getStars().subscribe((data) => {
      this.stars = data;
    });
  }
}
