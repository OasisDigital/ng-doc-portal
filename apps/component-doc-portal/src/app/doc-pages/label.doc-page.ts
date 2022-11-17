import { Component } from '@angular/core';
import { DocPageConfig } from '@oasisdigital/ng-doc-portal';

@Component({
  standalone: true,
  template: `
    <h1>Label Component Document Page</h1>
    <label>Example Label</label>
  `,
})
export class LabelDocumentPageComponent {}

const docPageConfig: DocPageConfig = {
  title: 'General/Label',
  docPageComponent: LabelDocumentPageComponent,
};

export default docPageConfig;
