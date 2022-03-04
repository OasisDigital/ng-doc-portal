import { Component, NgModule } from '@angular/core';

import { DocPageConfig } from '@doc-page-config/types';

@Component({
  template: `
    <h1>Input Component Document Page</h1>
    <input placeholder="Example Input" />
  `,
})
export class InputDocumentPageComponent {}

// This can probably go away when Optional Modules is in Angular
@NgModule({
  declarations: [],
  imports: [],
  providers: [],
})
class DocumentPageModule {}

const docPageConfig: DocPageConfig = {
  title: 'Forms/Input',
  docPage: InputDocumentPageComponent,
  ngModule: DocumentPageModule,
};

export default docPageConfig;
