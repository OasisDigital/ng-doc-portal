import { Component, NgModule } from '@angular/core';

import { DocPageConfig } from '@doc-page-config/types';

@Component({
  template: `
    <h1>Label Component Document Page</h1>
    <label>Example Label</label>
  `,
})
export class LabelDocumentPageComponent {}

// This can probably go away when Optional Modules is in Angular
@NgModule({
  declarations: [],
  imports: [],
  providers: [],
})
class DocumentPageModule {}

const docPageConfig: DocPageConfig = {
  title: 'Label',
  route: 'label',
  docPage: LabelDocumentPageComponent,
  ngModule: DocumentPageModule,
};

export default docPageConfig;
