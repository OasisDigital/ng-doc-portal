import { InjectionToken, Provider, Type } from '@angular/core';

export const CDP_TITLE_TOKEN = new InjectionToken<string | Type<any>>(
  'CDP_TITLE_TOKEN'
);

export function cdpProvideTitle(title: string | Type<any>): Provider {
  return {
    provide: CDP_TITLE_TOKEN,
    useValue: title,
  };
}
