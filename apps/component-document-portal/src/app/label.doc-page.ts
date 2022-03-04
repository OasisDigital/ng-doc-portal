import { Component, NgModule } from '@angular/core';

import { DocPageConfig } from '@cdp/component-document-portal/util-types';

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
  title: 'General/Label',
  docPage: LabelDocumentPageComponent,
  ngModule: DocumentPageModule,
};

export default docPageConfig;
