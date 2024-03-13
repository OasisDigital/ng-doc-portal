import { DialogModule } from '@angular/cdk/dialog';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideNgDocPortal,
  withTitle,
  withThemeOptions,
  withToolbarPlugins,
  withLandingPage,
} from '@oasisdigital/ng-doc-portal';

import { AppComponent } from './app/app.component';
import { CustomLandingPageComponent } from './app/custom-landing-page.component';
import { CustomPluginComponent } from './app/custom-plugin.component';
import { CustomTitleComponent } from './app/custom-title-component';
import { docPageLoaders } from './app/doc-page-loaders';

bootstrapApplication(AppComponent, {
  providers: [
    provideNgDocPortal(
      docPageLoaders,
      withTitle(CustomTitleComponent),
      withLandingPage(CustomLandingPageComponent),
      withThemeOptions([
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
      withToolbarPlugins([CustomPluginComponent])
    ),
    importProvidersFrom(DialogModule),
  ],
});
