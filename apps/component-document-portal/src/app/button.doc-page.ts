import { Component, NgModule } from '@angular/core';

import { DocPageConfig } from '@cdp/component-document-portal/util-types';
import { DocComponentsModule } from '@cdp/component-document-portal/ui-portal-components';

@Component({
  template: `
    <cdp-tab-menu>
      <div overview>
        <h1>Button Component Document Page</h1>
        <button>Example Button</button>

        <p>The button is used to get actions from the user by click</p>
      </div>
      <div examples>
        <button>Example Button</button>
        <cdp-code-reveal lang="html">
          <button>Example Button</button>
        </cdp-code-reveal>
      </div>
    </cdp-tab-menu>
  `,
})
export class ButtonDocumentPageComponent {}

// This can probably go away when Optional Modules is in Angular
@NgModule({
  declarations: [ButtonDocumentPageComponent],
  imports: [DocComponentsModule],
})
class DocumentPageModule {}

const docPageConfig: DocPageConfig = {
  title: 'General/Button',
  docPage: ButtonDocumentPageComponent,
  ngModule: DocumentPageModule,
};

export default docPageConfig;
