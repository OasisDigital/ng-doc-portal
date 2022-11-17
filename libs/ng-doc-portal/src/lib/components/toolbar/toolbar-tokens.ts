import { InjectionToken, Provider, Type } from '@angular/core';

export const NG_DOC_PORTAL_TOOLBAR_PLUGINS_TOKEN = new InjectionToken<
  Type<any>[]
>('NG_DOC_PORTAL_TOOLBAR_PLUGINS_TOKEN');

export function ngDocPortalProvideToolbarPlugins(
  plugins: Type<any>[]
): Provider {
  return {
    provide: NG_DOC_PORTAL_TOOLBAR_PLUGINS_TOKEN,
    useValue: plugins,
  };
}
