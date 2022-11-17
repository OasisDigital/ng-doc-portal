import { Component, Inject, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, Observable, switchMap, tap } from 'rxjs';

import {
  DocPageLoader,
  DocPageLoaderRecord,
} from '../../types/doc-page-config.types';
import { docPageRouteParam } from '../../util/constants';
import { DOC_PAGE_LOADERS_TOKEN } from '../../util/injection-tokens';

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
    @Inject(DOC_PAGE_LOADERS_TOKEN)
    docPageLoaders: DocPageLoaderRecord
  ) {
    this.component$ = this.route.paramMap.pipe(
      map((paramMap) => paramMap.get(docPageRouteParam) as string),
      map((routeParam) => docPageLoaders[routeParam]),
      tap((docPageLoader) => {
        if (!docPageLoader) {
          this.router.navigate(['/']);
        }
      }),
      filter(
        (
          docPageLoader: DocPageLoader | undefined
        ): docPageLoader is DocPageLoader => !!docPageLoader
      ),
      switchMap((docPageLoader) => docPageLoader.fetch()),
      map((componentOrConfig) => {
        if ('component' in componentOrConfig) {
          return componentOrConfig.component;
        } else {
          return componentOrConfig;
        }
      })
    );
  }
}
