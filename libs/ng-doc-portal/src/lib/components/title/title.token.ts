import { InjectionToken, Provider, Type } from '@angular/core';

export const NG_DOC_PORTAL_TITLE_TOKEN = new InjectionToken<string | Type<any>>(
  'NG_DOC_PORTAL_TITLE_TOKEN'
);

export function ngDocPortalProvideTitle(title: string | Type<any>): Provider {
  return {
    provide: NG_DOC_PORTAL_TITLE_TOKEN,
    useValue: title,
  };
}
