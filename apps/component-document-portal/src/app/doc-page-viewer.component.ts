import {
  Component,
  createNgModuleRef,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, Subject, takeUntil, tap } from 'rxjs';

import { DynamicDocPageConfig } from '@cdp/component-document-portal/util-types';

import { docPageRouteParam } from './app.module';
import { docPageConfigs } from './doc-page-configs';

@Component({
  template: `<ng-template #docPageRenderer></ng-template>`,
})
export class DocPageViewerComponent implements OnInit, OnDestroy {
  @ViewChild('docPageRenderer', { read: ViewContainerRef })
  docPageRenderer?: ViewContainerRef;

  destroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy),
        map((paramMap) => paramMap.get(docPageRouteParam) as string),
        map((routeParam) => docPageConfigs[routeParam]),
        tap((docPageConfig) => {
          if (!docPageConfig) {
            this.router.navigate(['/']);
          }
        }),
        filter(
          (docPageConfig): docPageConfig is DynamicDocPageConfig =>
            !!docPageConfig
        )
      )
      .subscribe(async (dynamicConfig) => {
        const config = await dynamicConfig.loadConfig();
        let ngModuleRef;
        if (config.ngModule) {
          ngModuleRef = createNgModuleRef(config.ngModule, this.injector);
        }
        if (this.docPageRenderer) {
          this.docPageRenderer.clear();
          this.docPageRenderer.createComponent(config.docPageComponent, {
            ngModuleRef,
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
