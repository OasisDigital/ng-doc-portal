import { Component, NgModule } from '@angular/core';

import { DocPageConfig } from '@cdp/component-document-portal/util-types';
// This import fails due to tsconfig paths not being registered...
import { DocComponentsModule } from '@cdp/component-document-portal/ui-portal-components';

@Component({
  template: `
    <cdp-tab-menu>
      <cdp-tab-item title="Overview">
        <h1>Button Component Document Page</h1>
        <button>Example Button</button>

        <p>The button is used to get actions from the user by click</p>
      </cdp-tab-item>
      <cdp-tab-item title="Examples">
        <button>Example Button</button>
        <cdp-code-reveal lang="html">
          <button>Example Button</button>
        </cdp-code-reveal>
      </cdp-tab-item>
    </cdp-tab-menu>
  `,
})
export class ButtonDocumentPageComponent {}

// This can probably go away when Optional Modules is in Angular
@NgModule({
  declarations: [ButtonDocumentPageComponent],
  imports: [DocComponentsModule],
})
export class DocumentPageModule {}

const docPageConfig: DocPageConfig = {
  title: 'General/Button',
  docPageComponent: ButtonDocumentPageComponent,
  ngModule: DocumentPageModule,
};

export default docPageConfig;
