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

export type DocPageRoutes = (DocPageMetadata | DocPagesMenu)[];

export interface DocPagesMenu {
  kind: 'menu';
  title: string;
  items: DocPageRoutes;
}

export interface DocPageMetadata {
  kind: 'metadata';
  title: string;
  route: string;
}
