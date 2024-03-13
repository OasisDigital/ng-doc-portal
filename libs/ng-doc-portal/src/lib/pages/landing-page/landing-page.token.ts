import { InjectionToken, Provider, Type } from '@angular/core';

export const NG_DOC_PORTAL_LANDING_PAGE_TOKEN = new InjectionToken<Type<any>>(
  'NG_DOC_PORTAL_LANDING_PAGE_TOKEN'
);

export function ngDocPortalProvideLandingPage(
  landingPage: Type<any>
): Provider {
  return {
    provide: NG_DOC_PORTAL_LANDING_PAGE_TOKEN,
    useValue: landingPage,
  };
}
