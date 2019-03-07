/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FeaturedItemComponent } from './featured-item.component';
import { ConfigService } from '../shared/services/config.service';

describe('Component: FeaturedItem', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [FeaturedItemComponent],
      providers: [ConfigService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('should create an instance', () => {
    let component = TestBed.createComponent(FeaturedItemComponent);
    expect(component).toBeTruthy();
  });
});
