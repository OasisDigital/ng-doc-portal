import { Component } from '@angular/core';
import {
  NgDocPortalComponentsModule,
  DocPageConfig,
} from '@oasisdigital/ng-doc-portal';

const exampleMarkdown = `
# Markdown from a string

Hello World!
`;

@Component({
  standalone: true,
  imports: [NgDocPortalComponentsModule],
  template: `
    <ngdp-tab-menu>
      <ngdp-tab-item title="File Based">
        <ngdp-markdown filePath="/assets/test-markdown.md"></ngdp-markdown>
      </ngdp-tab-item>
      <ngdp-tab-item title="Local String">
        <ngdp-markdown [markdown]="markdownString"></ngdp-markdown>
      </ngdp-tab-item>
    </ngdp-tab-menu>
  `,
})
export class MarkdownExampleDocumentPageComponent {
  markdownString = exampleMarkdown;
}

const docPageConfig: DocPageConfig = {
  title: 'General/Markdown Example',
  component: MarkdownExampleDocumentPageComponent,
};

export default docPageConfig;
