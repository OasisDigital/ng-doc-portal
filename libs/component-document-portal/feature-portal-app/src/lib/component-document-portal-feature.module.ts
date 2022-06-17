import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { DocComponentsModule } from '@cdp/component-document-portal/ui-portal-components';
import {
  CompilerMode,
  LazyDocConfigRecord,
  RuntimeDocConfigArray,
} from '@cdp/component-document-portal/util-types';

import { DocPageViewerComponent } from './pages/doc-page-viewer/doc-page-viewer.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ComponentDocumentPortalFeatureComponent } from './pages/main-feature/component-document-portal-feature.component';
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
  imports: [CommonModule, RouterModule.forRoot(routes), DocComponentsModule],
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
export class ComponentDocumentPortalFeatureModule {
  static forRoot(
    docPageConfigs: RuntimeDocConfigArray | LazyDocConfigRecord,
    compilerMode: CompilerMode
  ): ModuleWithProviders<ComponentDocumentPortalFeatureModule> {
    return {
      ngModule: ComponentDocumentPortalFeatureModule,
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
