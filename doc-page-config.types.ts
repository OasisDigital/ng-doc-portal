import { Type } from '@angular/core';

export interface DynamicDocPageConfig {
  title: string;
  route: string;
  getDocPage: () => Promise<Type<any>>;
  getNgModule: () => Promise<Type<any>>;
}

export interface DocPageConfig {
  title: string;
  route: string;
  docPage: Type<any>;
  ngModule: Type<any>;
}
