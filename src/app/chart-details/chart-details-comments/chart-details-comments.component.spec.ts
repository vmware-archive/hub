import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDetailsCommentsComponent } from './chart-details-comments.component';

describe('ChartDetailsCommentsComponent', () => {
  let component: ChartDetailsCommentsComponent;
  let fixture: ComponentFixture<ChartDetailsCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartDetailsCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartDetailsCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
