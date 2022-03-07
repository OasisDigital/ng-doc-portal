import { Type } from '@angular/core';

export interface DynamicDocPageConfig {
  title: string;
  loadConfig: () => Promise<DocPageConfig>;
}

export interface DocPageConfig {
  title: string;
  docPageComponent: Type<any>;
  ngModule?: Type<any>;
}
