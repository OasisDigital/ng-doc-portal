import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { NgDocPortalComponentsModule } from './components/ng-doc-portal-components.module';
import { ngDocPortalRoutes } from './ng-doc-portal.routes';
import { DocPageViewerComponent } from './pages/doc-page-viewer/doc-page-viewer.component';
import { MainFeatureComponent } from './pages/main-feature/main-feature.component';
import { NoSelectionPageComponent } from './pages/no-selection-page/no-selection-page.component';
import { DocPageLoaderRecord } from './types/doc-page-config.types';
import { DOC_PAGE_LOADERS_TOKEN } from './util/injection-tokens';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(ngDocPortalRoutes),
    NgDocPortalComponentsModule,
    MainFeatureComponent,
    NoSelectionPageComponent,
    DocPageViewerComponent,
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      },
    },
  ],
})
export class NgDocPortalModule {
  static forRoot(
    docPageConfigs: DocPageLoaderRecord
  ): ModuleWithProviders<NgDocPortalModule> {
    return {
      ngModule: NgDocPortalModule,
      providers: [
        {
          provide: DOC_PAGE_LOADERS_TOKEN,
          useValue: docPageConfigs,
        },
      ],
    };
  }
}
