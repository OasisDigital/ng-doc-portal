import { Component } from '@angular/core';
import { DynamicDocPageConfig } from '@doc-page-config/types';

import { docPageConfigs } from './doc-page-configs';

type DocPageRoute = {
  title: string;
  route: string;
};

interface NestedDocPageRoutes {
  title: string;
  children: (DocPageRoute | NestedDocPageRoutes)[];
}

type DocPageRoutes = (DocPageRoute | NestedDocPageRoutes)[];

interface DocPageRoutesDictionary {
  [titlePiece: string]:
    | (DocPageRoute & { isConfig: true })
    | (DocPageRoutesDictionary & { isConfig: false });
}

@Component({
  selector: 'cdp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  docPageRoutes: DocPageRoutes;

  constructor() {
    const routesDictionary = createDocRoutesDictionary(docPageConfigs);

    this.docPageRoutes = convertToDocPageRoutes(routesDictionary);
  }
}

function createDocRoutesDictionary(
  configsRecord: Record<string, DynamicDocPageConfig>
) {
  return Object.entries(configsRecord).reduce(
    (routesDictionary, [route, config]) => {
      const titlePieces = config.title.toLowerCase().split('/');

      let dictionaryLocation: DocPageRoutesDictionary = {};

      for (let i = 0; i < titlePieces.length; i++) {
        if (i === 0) {
          if (!routesDictionary[titlePieces[i]]) {
            routesDictionary[titlePieces[i]] = {
              isConfig: false,
            } as DocPageRoutesDictionary & { isConfig: false };
          }
          dictionaryLocation = routesDictionary[
            titlePieces[i]
          ] as DocPageRoutesDictionary;
        } else if (0 < i && i < titlePieces.length - 1) {
          if (!dictionaryLocation[titlePieces[i]]) {
            dictionaryLocation[titlePieces[i]] = {
              isConfig: false,
            } as DocPageRoutesDictionary & { isConfig: false };
          }
          dictionaryLocation = dictionaryLocation[
            titlePieces[i]
          ] as DocPageRoutesDictionary;
        } else {
          if (dictionaryLocation[titlePieces[i]]) {
            console.warn(
              `Overwriting duplicate nested doc page title/route: ${config.title} - ${titlePieces[i]}`
            );
          }
          dictionaryLocation[titlePieces[i]] = {
            isConfig: true,
            route,
            ...config,
          };
        }
      }

      return routesDictionary;
    },
    {} as DocPageRoutesDictionary
  );
}

function convertToDocPageRoutes(
  dictionary: DocPageRoutesDictionary
): DocPageRoutes {
  return Object.entries(dictionary)
    .map(([title, dictOrConfig]) => {
      title = title.charAt(0).toUpperCase() + title.slice(1);
      if (dictOrConfig.isConfig) {
        return { title, route: dictOrConfig.route };
      } else {
        // Doing the disable here since it complains about the unused variable we don't want
        // eslint-disable-next-line
        const { isConfig, ...configToConvert } = dictOrConfig;
        return {
          title,
          children: convertToDocPageRoutes(configToConvert),
        } as NestedDocPageRoutes;
      }
    })
    .sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      } else if (a.title > b.title) {
        return 1;
      } else {
        return 0;
      }
    });
}
