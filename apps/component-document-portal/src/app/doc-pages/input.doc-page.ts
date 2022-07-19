import { Component } from '@angular/core';
import { DocPageConfig } from '@oasisdigital/ng-doc-portal';

@Component({
  standalone: true,
  template: `
    <h1>Input Component Document Page</h1>
    <input placeholder="Example Input" />
  `,
})
export class InputDocumentPageComponent {}

const docPageConfig: DocPageConfig = {
  title: 'Forms/Input',
  docPageComponent: InputDocumentPageComponent,
};

export default docPageConfig;
