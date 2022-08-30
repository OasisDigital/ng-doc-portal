import { Component, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, Observable, of, switchMap, tap } from 'rxjs';

import { DocPageConfigService } from '../../services/doc-page-config.service';
import {
  DynamicDocPageConfig,
  RuntimeDocPageConfig,
} from '../../types/doc-page-config.types';
import { docPageRouteParam } from '../../util/constants';

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
        (
          docPageConfig
        ): docPageConfig is DynamicDocPageConfig | RuntimeDocPageConfig =>
          !!docPageConfig
      ),
      switchMap((docPageConfig) => {
        if (docPageConfig.mode === 'lazy') {
          return docPageConfig.loadConfig();
        } else {
          return of(docPageConfig.config);
        }
      }),
      // Temporary hacky code to get the component out of the config
      // or assume the "config" is actually just a default exported component
      // TODO: Update the typing to accurately reflect this
      map((config) => config.docPageComponent ?? config)
    );
  }
}