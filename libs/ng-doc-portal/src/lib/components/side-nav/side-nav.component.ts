import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { map, Observable, Subject, takeUntil } from 'rxjs';

import {
  DocPageLoaderRecord,
  DocPageRoutes,
} from '../../types/doc-page-config.types';
import { DOC_PAGE_LOADERS_TOKEN } from '../../util/injection-tokens';
import { TitleComponent } from '../title/title.component';

const filterQueryParamKey = 'filter';

@Component({
  selector: 'ngdp-side-nav',
  standalone: true,
  templateUrl: './side-nav.component.html',
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    TitleComponent,
  ],
})
export class SideNavComponent implements OnDestroy {
  filteredRoutes: Observable<DocPageRoutes>;
  filterControl: FormControl<string | null>;
  destroy = new Subject<void>();

  constructor(
    @Inject(DOC_PAGE_LOADERS_TOKEN)
    docPageLoaders: DocPageLoaderRecord,
    route: ActivatedRoute,
    router: Router
  ) {
    this.filterControl = new FormControl(
      route.snapshot.queryParamMap.get(filterQueryParamKey)
    );

    this.filterControl.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        const filter = value || undefined;
        router.navigate([], {
          queryParams: { filter },
          queryParamsHandling: 'merge',
        });
      });

    this.filteredRoutes = route.queryParamMap.pipe(
      map((params) => params.get(filterQueryParamKey)),
      map((filter) => {
        if (!filter) {
          return createDocPageRoutes(docPageLoaders);
        } else {
          const filteredLoaders = filterLoaders(docPageLoaders, filter);
          return createDocPageRoutes(filteredLoaders);
        }
      })
    );
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}

export function filterLoaders(loaders: DocPageLoaderRecord, filter: string) {
  const filtered: DocPageLoaderRecord = Object.assign(
    {},
    ...Object.entries(loaders)
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
  docPageLoaders: DocPageLoaderRecord
): DocPageRoutes {
  const docPageRoutes: DocPageRoutes = [];
  for (const route in docPageLoaders) {
    createRoutesStructure(
      docPageRoutes,
      docPageLoaders[route].title.split('/'),
      route
    );
  }
  return docPageRoutes;
}
