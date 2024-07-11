import { NgComponentOutlet } from '@angular/common';
import { Component, Inject, Optional, Type } from '@angular/core';

import { NG_DOC_PORTAL_TITLE_TOKEN } from './title.token';

@Component({
  selector: 'ngdp-title',
  standalone: true,
  template: `
    @if (titleComponent) {
      <ng-container [ngComponentOutlet]="titleComponent"></ng-container>
    } @else {
      <h1>{{ titleString ?? 'Doc Portal' }}</h1>
    }
  `,
  imports: [NgComponentOutlet],
})
export class TitleComponent {
  titleString: string | undefined;
  titleComponent: Type<any> | undefined;

  constructor(
    @Optional()
    @Inject(NG_DOC_PORTAL_TITLE_TOKEN)
    public title?: string | Type<any>
  ) {
    if (title) {
      if (typeof title === 'string') {
        this.titleString = title;
      } else {
        this.titleComponent = title;
      }
    }
  }
}
