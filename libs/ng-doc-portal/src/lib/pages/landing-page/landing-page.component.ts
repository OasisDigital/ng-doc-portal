import { NgComponentOutlet, NgIf } from '@angular/common';
import { Component, Inject, Optional, Type } from '@angular/core';

import { NG_DOC_PORTAL_LANDING_PAGE_TOKEN } from './landing-page.token';

@Component({
  selector: 'ngdp-landing-page',
  standalone: true,
  template: `
    <ng-container *ngIf="!landingPageOverride">
      <h1>Please select a component document page from the side navigation.</h1>
    </ng-container>
    <ng-container
      *ngIf="landingPageOverride"
      [ngComponentOutlet]="landingPageOverride"
    ></ng-container>
  `,
  imports: [NgIf, NgComponentOutlet],
})
export class LandingPageComponent {
  constructor(
    @Optional()
    @Inject(NG_DOC_PORTAL_LANDING_PAGE_TOKEN)
    public landingPageOverride?: Type<any>
  ) {}
}
