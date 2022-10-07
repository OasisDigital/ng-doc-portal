import { InjectionToken, Provider, Type } from '@angular/core';

export const CDP_TOOLBAR_PLUGINS_TOKEN = new InjectionToken<Type<any>[]>(
  'CDP_TOOLBAR_PLUGINS_TOKEN'
);

export function cdpProvideToolbarPlugins(plugins: Type<any>[]): Provider {
  return {
    provide: CDP_TOOLBAR_PLUGINS_TOKEN,
    useValue: plugins,
  };
}
