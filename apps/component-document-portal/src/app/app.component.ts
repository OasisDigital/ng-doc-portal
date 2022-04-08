import { Component } from '@angular/core';
import {
  DocPageRoutes,
  DynamicDocPageConfig,
} from '@cdp/component-document-portal/util-types';

import { docPageConfigs } from './doc-page-configs';

@Component({
  selector: 'cdp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  docPageRoutes: DocPageRoutes;

  constructor() {
    this.docPageRoutes = createDocPageRoutes(docPageConfigs);
  }
}

function createRoutesStructure(
  docPageRoutes: DocPageRoutes,
  titles: string[],
  route: string
) {
  const currentTitle = titles[0];
  let currentMenu = docPageRoutes.find(
    (menuOrMetadata) => menuOrMetadata.title === currentTitle
  );
  if (!currentMenu && titles.length === 1) {
    docPageRoutes.push({
      kind: 'metadata',
      title: currentTitle,
      route,
    });
  } else if (!currentMenu) {
    const newMenu = {
      kind: 'menu' as const,
      title: currentTitle,
      items: [],
    };
    docPageRoutes.push(newMenu);
    createRoutesStructure(newMenu.items, titles.slice(1), route);
  } else if (currentMenu && titles.length > 1 && currentMenu.kind === 'menu') {
    createRoutesStructure(currentMenu.items, titles.slice(1), route);
  } else {
    console.warn(`Overwriting duplicate DocPageMenu ${currentTitle}`);
    currentMenu = {
      kind: 'metadata',
      title: currentTitle,
      route,
    };
  }
}

export function createDocPageRoutes(
  docPageConfigs: Record<string, DynamicDocPageConfig>
): DocPageRoutes {
  const docPageRoutes: DocPageRoutes = [];
  for (const route in docPageConfigs) {
    createRoutesStructure(
      docPageRoutes,
      docPageConfigs[route].title.split('/'),
      route
    );
  }
  return docPageRoutes;
}
