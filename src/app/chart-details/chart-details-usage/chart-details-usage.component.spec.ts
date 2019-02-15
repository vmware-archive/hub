/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChartDetailsUsageComponent } from './chart-details-usage.component';
import { ConfigService } from '../../shared/services/config.service';
import { DeploymentsService } from '../../shared/services/deployments.service';
import { DialogsService } from '../../shared/services/dialogs.service';

describe('Component: ChartDetailsUsage', () => {

  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ChartDetailsUsageComponent],
      providers: [
        DialogsService,
        ConfigService,
        { provide: DeploymentsService },
        { provide: Router }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    component = TestBed.createComponent(ChartDetailsUsageComponent);
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a link to Kubeapps Github', () => {
    const detailsElement: HTMLElement = component.nativeElement;
    const kubeappsGithubAnchor = detailsElement
      .querySelector(
        'a[href="https://github.com/kubeapps/kubeapps/blob/master/docs/user/getting-started.md"]'
      );
    expect(kubeappsGithubAnchor).toBeDefined();
  });
});
