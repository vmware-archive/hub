import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-pagination-item',
  templateUrl: './pagination-item.component.html'
})
export class PaginationItemComponent {
  @Input() page: number;
  @Input() current: boolean;
  @Input() onSelect: (page: string) => void;
}
