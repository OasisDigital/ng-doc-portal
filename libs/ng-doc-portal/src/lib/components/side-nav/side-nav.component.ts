import { Component, Input } from '@angular/core';

import {
  DocPageRoutes,
  DocConfigRecord,
} from '../../types/doc-page-config.types';

@Component({
  selector: 'cdp-nav',
  templateUrl: './side-nav.component.html',
})
export class SideNavComponent {
  @Input() set configs(value: DocConfigRecord) {
    this.docConfigRecord = value;
    this.docPageRoutes = filterAndGenerateDocPageRoutes(
      this.docConfigRecord,
      this.currentFilter
    );
  }

  private docConfigRecord: DocConfigRecord = {};
  private currentFilter = '';
  docPageRoutes: DocPageRoutes = [];

  filterConfig(event: any) {
    this.currentFilter = (event.target.value as string)
      .toLowerCase()
      .replace(/[\s/-]/g, '');
    this.docPageRoutes = filterAndGenerateDocPageRoutes(
      this.docConfigRecord,
      this.currentFilter
    );
  }
}

function filterAndGenerateDocPageRoutes(
  config: DocConfigRecord,
  filter: string
) {
  const filteredConfig = filterConfigs(config, filter);
  return createDocPageRoutes(filteredConfig);
}

function filterConfigs(configs: DocConfigRecord, filter: string) {
  const filtered: DocConfigRecord = Object.assign(
    {},
    ...Object.entries(configs)
      .filter(
        ([k, v]) =>
          k.replace(/[-]/g, '').includes(filter) ||
          v.title.toLowerCase().replace(/[/]/g, '').includes(filter)
      )
      .map(([k, v]) => ({ [k]: v }))
  );
  return filtered;
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
  docPageConfigs: DocConfigRecord
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
