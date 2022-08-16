import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  cdpProvideThemeOptions,
  NgDocPortalModule,
} from '@oasisdigital/ng-doc-portal';

import { AppComponent } from './app.component';
import { compilerMode, docPageConfigs } from './doc-page-configs';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgDocPortalModule.forRoot(docPageConfigs, compilerMode),
  ],
  providers: [
    cdpProvideThemeOptions([
      { value: 'light-theme', display: 'Light Theme' },
      { value: 'dark-theme', display: 'Dark Theme' },
    ]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
