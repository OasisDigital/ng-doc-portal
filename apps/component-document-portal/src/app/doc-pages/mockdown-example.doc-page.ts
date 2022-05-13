import { Component, NgModule } from '@angular/core';
import { DocComponentsModule } from '@cdp/component-document-portal/ui-portal-components';

import { DocPageConfig } from '@cdp/component-document-portal/util-types';

const exampleMarkdown = `
# Markdown from a string

Hello World!
`;

@Component({
  template: `
    <cdp-tab-menu>
      <cdp-tab-item title="File Based">
        <cdp-markdown filePath="/assets/test-markdown.md"></cdp-markdown>
      </cdp-tab-item>
      <cdp-tab-item title="Local String">
        <cdp-markdown [markdown]="markdownString"></cdp-markdown>
      </cdp-tab-item>
    </cdp-tab-menu>
  `,
})
export class MarkdownExampleDocumentPageComponent {
  markdownString = exampleMarkdown;
}

// This can probably go away when Optional Modules is in Angular
@NgModule({
  declarations: [MarkdownExampleDocumentPageComponent],
  imports: [DocComponentsModule],
})
export class DocumentPageModule {}

const docPageConfig: DocPageConfig = {
  title: 'General/Markdown Example',
  docPageComponent: MarkdownExampleDocumentPageComponent,
  ngModule: DocumentPageModule,
};

export default docPageConfig;
