import { Component } from '@angular/core';

import { docPageConfigs } from './doc-page-configs';

@Component({
  selector: 'component-document-portal-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  docPageRoutes = docPageConfigs.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    } else if (a.title > b.title) {
      return 1;
    } else {
      return 0;
    }
  });
}
