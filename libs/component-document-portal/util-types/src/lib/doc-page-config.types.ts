import { Type } from '@angular/core';

export interface DynamicDocPageConfig {
  title: string;
  getDocPage: () => Promise<Type<any>>;
  getNgModule: () => Promise<Type<any>>;
}

export interface DocPageConfig {
  title: string;
  docPage: Type<any>;
  ngModule: Type<any>;
}
