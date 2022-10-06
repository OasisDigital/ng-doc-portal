import { Component, Inject, Optional, Type } from '@angular/core';

import { CDP_TITLE_TOKEN } from './title.token';

@Component({
  selector: 'cdp-title',
  template: `
    <ng-container *ngIf="!titleComponent">
      <h1>{{ titleString ?? 'Doc Portal' }}</h1>
    </ng-container>
    <ng-container
      *ngIf="titleComponent"
      [ngComponentOutlet]="titleComponent"
    ></ng-container>
  `,
})
export class TitleComponent {
  titleString: string | undefined;
  titleComponent: Type<any> | undefined;

  constructor(
    @Optional() @Inject(CDP_TITLE_TOKEN) public title?: string | Type<any>
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
