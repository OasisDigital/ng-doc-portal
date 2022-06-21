import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ComponentDocumentPortalFeatureModule } from '@cdp/component-document-portal/feature-portal-app';

import { AppComponent } from './app.component';
import { compilerMode, docPageConfigs } from './doc-page-configs';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ComponentDocumentPortalFeatureModule.forRoot(docPageConfigs, compilerMode),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
