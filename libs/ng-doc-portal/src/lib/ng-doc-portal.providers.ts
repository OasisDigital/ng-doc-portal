import {
  EnvironmentProviders,
  Provider,
  Type,
  makeEnvironmentProviders,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { NG_DOC_PORTAL_TOOLBAR_PLUGINS_TOKEN } from './components';
import { NG_DOC_PORTAL_TITLE_TOKEN } from './components/title/title.token';
import { ngDocPortalRoutes } from './ng-doc-portal.routes';
import {
  NG_DOC_PORTAL_THEME_OPTIONS_TOKEN,
  ThemeOption,
} from './services/tokens';
import { DocPageLoaderRecord } from './types/doc-page-config.types';
import { DOC_PAGE_LOADERS_TOKEN } from './util/injection-tokens';

export const enum NgDocPortalFeatureKind {
  TitleFeature,
  ThemeOptionsFeature,
  ToolbarPluginsFeature,
}

export interface NgDocPortalFeature<
  FeatureKind extends NgDocPortalFeatureKind
> {
  ɵkind: FeatureKind;
  ɵproviders: Provider[];
}

export type ToolbarPluginsFeature =
  NgDocPortalFeature<NgDocPortalFeatureKind.ToolbarPluginsFeature>;
export type ThemeOptionsFeature =
  NgDocPortalFeature<NgDocPortalFeatureKind.ThemeOptionsFeature>;
export type TitleFeature =
  NgDocPortalFeature<NgDocPortalFeatureKind.TitleFeature>;

export type NgDocPortalFeatures =
  | TitleFeature
  | ThemeOptionsFeature
  | ToolbarPluginsFeature;

export function provideNgDocPortal(
  docPageConfigs: DocPageLoaderRecord,
  ...features: NgDocPortalFeatures[]
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: DOC_PAGE_LOADERS_TOKEN,
      useValue: docPageConfigs,
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      },
    },
    provideRouter(ngDocPortalRoutes),
    features.map((feature) => feature.ɵproviders),
  ]);
}

// Utility function to create an NgDocPortalFeature object
function ngDocPortalFeature<FeatureKind extends NgDocPortalFeatureKind>(
  kind: FeatureKind,
  providers: Provider[]
): NgDocPortalFeature<FeatureKind> {
  return { ɵkind: kind, ɵproviders: providers };
}

export function withTitle(title: string | Type<any>): TitleFeature {
  const providers: Provider[] = [
    {
      provide: NG_DOC_PORTAL_TITLE_TOKEN,
      useValue: title,
    },
  ];
  return ngDocPortalFeature(NgDocPortalFeatureKind.TitleFeature, providers);
}

export function withThemeOptions(options: ThemeOption[]): ThemeOptionsFeature {
  const providers: Provider[] = [
    {
      provide: NG_DOC_PORTAL_THEME_OPTIONS_TOKEN,
      useValue: options,
    },
  ];
  return ngDocPortalFeature(
    NgDocPortalFeatureKind.ThemeOptionsFeature,
    providers
  );
}

export function withToolbarPlugins(
  plugins: Type<any> | Type<any>[]
): ToolbarPluginsFeature {
  const providers: Provider[] = [
    {
      provide: NG_DOC_PORTAL_TOOLBAR_PLUGINS_TOKEN,
      useValue: Array.isArray(plugins) ? plugins : [plugins],
    },
  ];
  return ngDocPortalFeature(
    NgDocPortalFeatureKind.ToolbarPluginsFeature,
    providers
  );
}
