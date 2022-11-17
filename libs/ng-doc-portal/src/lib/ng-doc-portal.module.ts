import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { NgDocPortalComponentsModule } from './components/ng-doc-portal-components.module';
import { DocPageViewerComponent } from './pages/doc-page-viewer/doc-page-viewer.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ComponentDocumentPortalFeatureComponent } from './pages/main-feature/component-doc-portal-feature.component';
import {
  CompilerMode,
  LazyDocConfigRecord,
  RuntimeDocConfigArray,
} from './types/doc-page-config.types';
import { docPageRouteParam } from './util/constants';
import {
  COMPILER_MODE_TOKEN,
  DOC_PAGE_CONFIG_TOKEN,
} from './util/injection-tokens';

const routes: Routes = [
  {
    path: '',
    component: ComponentDocumentPortalFeatureComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: `:${docPageRouteParam}`,
        component: DocPageViewerComponent,
      },
      {
        path: '**',
        component: HomePageComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    ComponentDocumentPortalFeatureComponent,
    HomePageComponent,
    DocPageViewerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    NgDocPortalComponentsModule,
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
    docPageConfigs: RuntimeDocConfigArray | LazyDocConfigRecord,
    compilerMode: CompilerMode
  ): ModuleWithProviders<NgDocPortalModule> {
    return {
      ngModule: NgDocPortalModule,
      providers: [
        {
          provide: DOC_PAGE_CONFIG_TOKEN,
          useValue: docPageConfigs,
        },
        {
          provide: COMPILER_MODE_TOKEN,
          useValue: compilerMode,
        },
      ],
    };
  }
}
