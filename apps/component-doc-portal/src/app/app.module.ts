import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  ngDocPortalProvideThemeOptions,
  ngDocPortalProvideTitle,
  ngDocPortalProvideToolbarPlugins,
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
    ngDocPortalProvideThemeOptions([
      {
        value: 'light-theme',
        display: 'Light Theme',
        hljsTheme: 'assets/github.css',
      },
      {
        value: 'dark-theme',
        display: 'Dark Theme',
        hljsTheme: 'assets/github-dark-dimmed.css',
      },
    ]),
    ngDocPortalProvideTitle(CustomTitleComponent),
    ngDocPortalProvideToolbarPlugins([CustomPluginComponent]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
