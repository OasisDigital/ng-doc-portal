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
  templateUrl: './markdown-example.doc-page.html',
})
export class MarkdownExampleDocumentPageComponent {
  markdownString = exampleMarkdown;
}

const docPageConfig: DocPageConfig = {
  title: 'General/Markdown Example',
  component: MarkdownExampleDocumentPageComponent,
};

export default docPageConfig;
