import { Type } from '@angular/core';

export interface DynamicDocPageConfig {
  mode: 'lazy';
  title: string;
  loadConfig: () => Promise<DocPageConfig>;
}

export interface RuntimeDocPageConfig {
  mode: 'runtime';
  title: string;
  config: DocPageConfig;
}

export interface DocConfig {
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

export type CompilerMode = 'lazy' | 'runtime';

export type LazyDocConfigRecord = Record<
  string,
  DynamicDocPageConfig | RuntimeDocPageConfig
>;

export type RuntimeDocConfigArray = (() => Promise<DocPageConfig>)[];
