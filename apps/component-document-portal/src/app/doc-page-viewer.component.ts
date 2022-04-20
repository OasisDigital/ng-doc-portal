import { Component, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, Observable, switchMap, tap } from 'rxjs';

import { DynamicDocPageConfig } from '@cdp/component-document-portal/util-types';

import { docPageRouteParam } from './app.module';
import { DocPageConfigService } from './doc-page-config.service';

@Component({
  template: `<ng-container
    *ngIf="component$ | async as component"
    [ngComponentOutlet]="component"
  ></ng-container>`,
})
export class DocPageViewerComponent {
  component$: Observable<Type<any>>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private configsService: DocPageConfigService
  ) {
    this.component$ = this.route.paramMap.pipe(
      map((paramMap) => paramMap.get(docPageRouteParam) as string),
      map((routeParam) => this.configsService.configs[routeParam]),
      tap((docPageConfig) => {
        if (!docPageConfig) {
          this.router.navigate(['/']);
        }
      }),
      filter(
        (docPageConfig): docPageConfig is DynamicDocPageConfig =>
          !!docPageConfig
      ),
      switchMap((docPageConfig) => docPageConfig.loadConfig()),
      map((config) => config.docPageComponent)
    );
  }
}
