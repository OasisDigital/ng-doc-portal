import { InjectionToken, Provider } from '@angular/core';

export const NG_DOC_PORTAL_THEME_OPTIONS_TOKEN = new InjectionToken<
  ThemeOption[]
>('NG_DOC_PORTAL_THEME_OPTIONS_TOKEN');

export interface ThemeOption {
  display: string;
  value: string;
  default?: boolean;
  hljsTheme?: string;
}

export function ngDocPortalProvideThemeOptions(
  options: ThemeOption[]
): Provider {
  return {
    provide: NG_DOC_PORTAL_THEME_OPTIONS_TOKEN,
    useValue: options,
  };
}

export const THEME_KEY = 'ng-doc-portal-cached-theme';
