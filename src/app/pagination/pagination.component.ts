import { Component, Input, OnChanges, OnInit, SimpleChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() totalPages: number;
  @Input() page: number;
  @Input() onSelect: (page: string) => void;
  pages: number[];

  ngOnInit()  {
    this.getPages();
  }

  ngOnChanges(changes: SimpleChanges) {
    const totalPages: SimpleChange = changes.totalPages;
    if (totalPages) {
      this.totalPages = totalPages.currentValue;
      this.getPages();
    }
  }

  getPages() {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
    return this.pages;
  }
}
