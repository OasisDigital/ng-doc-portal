import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  cdpProvideThemeOptions,
  cdpProvideTitle,
  cdpProvideToolbarPlugins,
  NgDocPortalModule,
} from '@oasisdigital/ng-doc-portal';

import { AppComponent } from './app.component';
import { CustomPluginComponent } from './custom-plugin.component';
import { CustomTitleComponent } from './custom-title-component';
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
    cdpProvideTitle(CustomTitleComponent),
    cdpProvideToolbarPlugins([CustomPluginComponent]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
