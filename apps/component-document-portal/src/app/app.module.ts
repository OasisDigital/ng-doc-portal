import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DocPageViewerComponent } from './doc-page-viewer.component';
import { HomePageComponent } from './home-page.component';

export const docPageRouteParam = 'doc-page-param';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: `:${docPageRouteParam}`,
    component: DocPageViewerComponent,
  },
  {
    path: '**',
    component: HomePageComponent,
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  bootstrap: [AppComponent],
})
export class AppModule {}
