import { Routes } from '@angular/router';

import { docPageRouteParam } from './util/constants';

export const ngDocPortalRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/main-feature/main-feature.component').then(
        (file) => file.MainFeatureComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/landing-page/landing-page.component').then(
            (file) => file.LandingPageComponent
          ),
      },
      {
        path: `:${docPageRouteParam}`,
        loadComponent: () =>
          import('./pages/doc-page-viewer/doc-page-viewer.component').then(
            (file) => file.DocPageViewerComponent
          ),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
