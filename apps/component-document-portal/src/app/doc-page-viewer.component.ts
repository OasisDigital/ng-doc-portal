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
import { docPageRouteParam } from './app.module';
import { DynamicDocPageConfig } from '@cdp/component-document-portal/util-types';

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
      .subscribe(async (config) => {
        const component = await config.getDocPage();
        const ngModule = await config.getNgModule();
        let ngModuleRef;
        if (ngModule) {
          ngModuleRef = createNgModuleRef(ngModule, this.injector);
        }
        if (this.docPageRenderer) {
          this.docPageRenderer.clear();
          this.docPageRenderer.createComponent(component, { ngModuleRef });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
