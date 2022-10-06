import { InjectionToken, Provider } from '@angular/core';

export const CDP_THEME_OPTIONS_TOKEN = new InjectionToken<ThemeOption[]>(
  'CDP_THEME_OPTIONS_TOKEN'
);

export interface ThemeOption {
  display: string;
  value: string;
  default?: boolean;
}

export function cdpProvideThemeOptions(options: ThemeOption[]): Provider {
  return {
    provide: CDP_THEME_OPTIONS_TOKEN,
    useValue: options,
  };
}

export const THEME_KEY = 'cdp-cached-theme';
