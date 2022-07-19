import { Component } from '@angular/core';
import {
  NgDocPortalComponentsModule,
  DocPageConfig,
} from '@oasisdigital/ng-doc-portal';

@Component({
  standalone: true,
  imports: [NgDocPortalComponentsModule],
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
          <button>Example Buttons</button>
        </cdp-code-reveal>
      </cdp-tab-item>
    </cdp-tab-menu>
  `,
})
export class ButtonDocumentPageComponent {}

const docPageConfig: DocPageConfig = {
  title: 'General/Button',
  docPageComponent: ButtonDocumentPageComponent,
};

export default docPageConfig;
