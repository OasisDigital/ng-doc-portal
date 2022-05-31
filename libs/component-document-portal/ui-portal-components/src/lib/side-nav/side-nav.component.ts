import { Component, Input } from '@angular/core';

import {
  DocPageRoutes,
  LazyDocConfigRecord,
} from '@cdp/component-document-portal/util-types';

@Component({
  selector: 'cdp-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent {
  @Input() set configs(value: LazyDocConfigRecord) {
    this.docPageRoutes = createDocPageRoutes(value);
  }

  docPageRoutes: DocPageRoutes = [];
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
  docPageConfigs: LazyDocConfigRecord
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
