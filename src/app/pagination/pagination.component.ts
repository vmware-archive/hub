import { Component, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnChanges {
  @Input() totalPages: string;
  @Input() page: string;
  @Input() onSelect: (page: string) => void;
  get pages(): string[] {
    const pages = [];
    for (let i = 1; i <= parseInt(this.totalPages, 10); i++) {
      pages.push(i.toString());
    }
    return pages;
  }

  ngOnChanges(changes: SimpleChanges) {
    const totalPages: SimpleChange = changes.totalPages;
    if (totalPages) {
      this.totalPages = totalPages.currentValue;
    }
  }
}
