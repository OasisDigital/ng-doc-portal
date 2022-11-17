import { Type } from '@angular/core';

export interface DocPageLoader {
  title: string;
  fetch: () => Promise<Type<any> | DocPageConfig>;
}

export interface DocPageConfig {
  title: string;
  component: Type<any>;
}

export type DocPageLoaderRecord = Record<string, DocPageLoader>;

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
