import { Component } from '@angular/core';
import {
  DocPageConfig,
  NgDocPortalComponentsModule,
} from '@oasisdigital/ng-doc-portal';

@Component({
  standalone: true,
  imports: [NgDocPortalComponentsModule],
  template: `
    <h1>Input Component Document Page</h1>
    <input placeholder="Example Input" />

    <cdp-code-reveal lang="html">
      <label>Hello World</label>
      <input placeholder="Example Input" />
      <button>Example Button</button>
    </cdp-code-reveal>
  `,
})
export class InputDocumentPageComponent {}

const docPageConfig: DocPageConfig = {
  title: 'Forms/Input',
  docPageComponent: InputDocumentPageComponent,
};

export default docPageConfig;
