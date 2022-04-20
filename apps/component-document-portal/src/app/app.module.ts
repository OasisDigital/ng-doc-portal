import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { DocComponentsModule } from '@cdp/component-document-portal/ui-portal-components';
import {
  CompilerMode,
  LazyDocConfigRecord,
  RuntimeDocConfigArray,
} from '@cdp/component-document-portal/util-types';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { AppComponent } from './app.component';
import { applicationMode, docPageConfigs } from './doc-page-configs';
import { DocPageViewerComponent } from './doc-page-viewer.component';
import { HomePageComponent } from './home-page.component';

export const DOC_PAGE_CONFIG_TOKEN = new InjectionToken<
  RuntimeDocConfigArray | LazyDocConfigRecord
>('DOC_PAGE_CONFIG_TOKEN');

export const COMPILER_MODE_TOKEN = new InjectionToken<CompilerMode>(
  'COMPILER_MODE'
);

export const docPageRouteParam = 'doc-page-param';

const routes: Routes = [
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
];

@NgModule({
  declarations: [AppComponent, DocPageViewerComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    DocComponentsModule,
  ],
  providers: [
    {
      provide: DOC_PAGE_CONFIG_TOKEN,
      useValue: docPageConfigs,
    },
    {
      provide: COMPILER_MODE_TOKEN,
      useValue: applicationMode,
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
