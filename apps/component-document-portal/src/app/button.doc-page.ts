import { Component, NgModule } from '@angular/core';

import { DocPageConfig } from '@doc-page-config/types';

@Component({
  template: `
    <h1>Button Component Document Page</h1>
    <button>Example Button</button>
  `,
})
export class ButtonDocumentPageComponent {}

// This can probably go away when Optional Modules is in Angular
@NgModule({
  declarations: [],
  imports: [],
  providers: [],
})
class DocumentPageModule {}

const docPageConfig: DocPageConfig = {
  title: 'Button',
  route: 'button',
  docPage: ButtonDocumentPageComponent,
  ngModule: DocumentPageModule,
};

export default docPageConfig;
